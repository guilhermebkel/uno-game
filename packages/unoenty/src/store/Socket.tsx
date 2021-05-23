import React, { createContext, useContext, useState } from "react"

import SocketService from "@/services/socket"

import useDidMount from "@/hooks/useDidMount"

import { LoadingScene } from "@/components"

import { preloadCardPictures } from "@/utils/card"
import { refreshCacheIfNeeded } from "@/utils/cache"

import {
	Game,
	ChatMessage,
	Chat,
	Player,
	GameHistory,
	PlayerJoinedEventData,
	PlayerLeftEventData,
	PlayerToggledReadyEventData,
	PlayerPutCardEventData,
	PlayerChoseCardColorEventData,
	GameRoundRemainingTimeChangedEventData,
	GameHistoryConsolidatedEventData,
	PlayerBoughtCardEventData,
	PlayerCardUsabilityConsolidatedEventData,
	GameAmountToBuyChangedEventData,
	PlayerStatusChangedEventData,
} from "@uno-game/protocols"

export interface SocketContextData {
	game?: Game
	chats?: Map<string, Chat>
	player?: Player
	gameHistory?: GameHistory[]
	gameRoundRemainingTimeInSeconds?: number
	addChatMessage: (chatId: string, message: ChatMessage) => void
	setGameData: (data: Game) => void
	setPlayerData: (data: Player) => void
	setChatData: (data: Chat) => void
}

const SocketStore = createContext<SocketContextData>({} as SocketContextData)

export const useSocketStore = (): SocketContextData => useContext(SocketStore)

const SocketProvider: React.FC = (props) => {
	const { children } = props

	const [loading, setLoading] = useState(true)
	const [player, setPlayer] = useState<Player>({} as Player)
	const [game, setGame] = useState<Game>({} as Game)
	const [chats, setChats] = useState<Map<string, Chat>>(new Map())
	const [gameHistory, setGameHistory] = useState<GameHistory[]>([])
	const [gameRoundRemainingTimeInSeconds, setGameRoundRemainingTimeInSeconds] = useState<number>(0)

	const setPlayerData = (data: Player) => {
		setPlayer(data)
	}

	const setGameData = (data: Game) => {
		setGame(lastState => ({
			...(lastState || {}),
			...(data || {}),
		}))
	}

	const setChatData = (data: Chat) => {
		setChats(lastState => {
			const updatedChats = new Map(lastState.entries())

			updatedChats.set(data.id, data)

			return updatedChats
		})
	}

	const addChatMessage = (chatId: string, message: ChatMessage) => {
		setChats(lastState => {
			const updatedChats = new Map(lastState.entries())

			const chat = updatedChats.get(chatId)

			if (chat) {
				const isThereAnyDuplicatedMessage = chat.messages
					.some(existentMessage => existentMessage.id === message.id)

				if (!isThereAnyDuplicatedMessage) {
					chat.messages.push(message)
				}

				updatedChats.set(chatId, chat)
			}

			return updatedChats
		})
	}

	const onGameHistoryConsolidated = () => {
		SocketService.on<GameHistoryConsolidatedEventData>("GameHistoryConsolidated", ({ gameHistory }) => {
			setGameHistory(gameHistory)
		})
	}

	const onGameRoundRemainingTimeChanged = () => {
		SocketService.on<GameRoundRemainingTimeChangedEventData>("GameRoundRemainingTimeChanged", ({ roundRemainingTimeInSeconds }) => {
			setGameRoundRemainingTimeInSeconds(roundRemainingTimeInSeconds)
		})
	}

	const onPlayerJoined = () => {
		SocketService.on<PlayerJoinedEventData>("PlayerJoined", ({ player }) => {
			setGame(lastState => {
				if (!lastState?.id) {
					return lastState
				}

				const updatedData = { ...lastState }

				const playerExists = updatedData.players.some(({ id }) => id === player.id)

				if (!playerExists) {
					updatedData.players.push(player)
				}

				return updatedData
			})
		})
	}

	const onPlayerLeft = () => {
		SocketService.on<PlayerLeftEventData>("PlayerLeft", ({ playerId }) => {
			setGame(lastState => {
				if (!lastState?.id) {
					return lastState
				}

				const updatedData = { ...lastState }

				if (updatedData?.status === "waiting") {
					updatedData.players = updatedData.players.filter(({ id }) => id !== playerId)
				}

				return updatedData
			})
		})
	}

	const onPlayerToggledReady = () => {
		SocketService.on<PlayerToggledReadyEventData>("PlayerToggledReady", ({ playerId, ready }) => {
			setGame(lastState => {
				if (!lastState?.id) {
					return lastState
				}

				const updatedData = { ...lastState }

				updatedData.players = updatedData.players.map(player => {
					if (player.id === playerId) {
						return {
							...player,
							ready,
						}
					}

					return player
				})

				return updatedData
			})
		})
	}

	const onPlayerPutCard = () => {
		SocketService.on<PlayerPutCardEventData>("PlayerPutCard", ({ playerId, cards }) => {
			setGame(lastState => {
				if (!lastState?.id) {
					return lastState
				}

				const updatedData = { ...lastState }

				cards
					.reverse()
					.forEach(card => {
						const cardExists = updatedData.usedCards.some(({ id }) => id === card.id)

						if (!cardExists) {
							updatedData.usedCards.unshift(card)
						}
					})

				updatedData.players = updatedData.players.map(player => {
					if (player.id === playerId) {
						player.handCards = player.handCards.filter(handCard => {
							const handCardIsPutCard = cards.some(({ id }) => id === handCard.id)

							return !handCardIsPutCard
						})
					}

					return player
				})

				return updatedData
			})
		})
	}

	const onPlayerChoseCardColor = () => {
		SocketService.on<PlayerChoseCardColorEventData>("PlayerChoseCardColor", ({ cards }) => {
			setGame(lastState => {
				if (!lastState?.id) {
					return lastState
				}

				const updatedData = { ...lastState }

				updatedData.usedCards = updatedData.usedCards.map(usedCard => {
					const card = cards.find(({ id }) => id === usedCard.id)

					if (card) {
						return card
					}

					return usedCard
				})

				return updatedData
			})
		})
	}

	const onPlayerBoughtCard = () => {
		SocketService.on<PlayerBoughtCardEventData>("PlayerBoughtCard", ({ playerId, cards }) => {
			setGame(lastState => {
				if (!lastState?.id) {
					return lastState
				}

				const updatedData = { ...lastState }

				updatedData.players = updatedData.players.map(player => {
					if (player.id === playerId) {
						cards.forEach(card => {
							const cardExists = player.handCards.some(({ id }) => id === card.id)

							if (!cardExists) {
								player.handCards.unshift(card)
							}
						})
					}

					return player
				})

				return updatedData
			})
		})
	}

	const onPlayerCardUsabilityConsolidated = () => {
		SocketService.on<PlayerCardUsabilityConsolidatedEventData>("PlayerCardUsabilityConsolidated", ({ players }) => {
			setGame(lastState => {
				if (!lastState?.id) {
					return lastState
				}

				const updatedData = { ...lastState }

				updatedData.players = updatedData.players.map(player => {
					const consolidatedPlayer = players.find(({ id }) => id === player.id)

					if (consolidatedPlayer) {
						player.isCurrentRoundPlayer = consolidatedPlayer.isCurrentRoundPlayer
						player.canBuyCard = consolidatedPlayer.canBuyCard

						player.handCards = player.handCards.map(handCard => {
							const consolidatedHandCard = consolidatedPlayer.handCards.find(({ id }) => id === handCard.id)

							if (consolidatedHandCard) {
								handCard.canBeCombed = consolidatedHandCard.canBeCombed
								handCard.canBeUsed = consolidatedHandCard.canBeUsed
							}

							return handCard
						})
					}

					return player
				})

				return updatedData
			})
		})
	}

	const onPlayerStatusChanged = () => {
		SocketService.on<PlayerStatusChangedEventData>("PlayerStatusChanged", ({ playerId, status }) => {
			setGame(lastState => {
				if (!lastState?.id) {
					return lastState
				}

				const updatedData = { ...lastState }

				updatedData.players = updatedData.players.map(player => {
					if (player.id === playerId) {
						player.status = status
					}

					return player
				})

				return updatedData
			})
		})
	}

	const onGameAmountToBuyChanged = () => {
		SocketService.on<GameAmountToBuyChangedEventData>("GameAmountToBuyChanged", ({ amountToBuy }) => {
			setGame(lastState => {
				if (!lastState?.id) {
					return lastState
				}

				const updatedData = { ...lastState }

				updatedData.currentCardCombo.amountToBuy = amountToBuy

				return updatedData
			})
		})
	}

	const connect = async () => {
		preloadCardPictures()

		refreshCacheIfNeeded()

		const playerData = await SocketService.getPlayerData()

		setPlayerData(playerData)

		setTimeout(() => {
			setLoading(false)
		}, 1000)
	}

	const setupListeners = () => {
		onGameRoundRemainingTimeChanged()
		onGameHistoryConsolidated()
		onPlayerJoined()
		onPlayerLeft()
		onPlayerToggledReady()
		onPlayerPutCard()
		onPlayerChoseCardColor()
		onPlayerBoughtCard()
		onPlayerCardUsabilityConsolidated()
		onPlayerStatusChanged()
		onGameAmountToBuyChanged()
	}

	useDidMount(() => {
		connect()
		setupListeners()
	})

	return (
		<SocketStore.Provider
			value={{
				addChatMessage,
				chats,
				setPlayerData,
				player,
				setGameData,
				game,
				gameHistory,
				gameRoundRemainingTimeInSeconds,
				setChatData,
			}}
		>
			<LoadingScene loading={loading}>
				{children}
			</LoadingScene>
		</SocketStore.Provider>
	)
}

export default SocketProvider
