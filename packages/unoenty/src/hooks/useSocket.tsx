import { useSocketStore } from "@/store/Socket"
import SocketService from "@/services/socket"

import {
	PlayerData,
	Game,
	PlayerState,
	CardColors,
	Chat,
	CardData,
	JoinGameEventInput,
	JoinGameEventResponse,
	BuyCardEventInput,
	PutCardEventInput,
	SendChatMessageEventInput,
	ChangePlayerStatusEventInput,
	ToggleReadyEventInput,
	ForceSelfDisconnectEventInput,
	PlayerBuyCardsEventData,
	PlayerBlockedEventData,
	PlayerUnoEventData,
	GameStartedEventData,
	NewMessageEventData,
} from "@uno-game/protocols"
import { GameDeckLayoutPosition } from "@/utils/game"
import { getSanitizedValueWithBoundaries } from "@/utils/number"

type UseSocketResponse = {
	currentPlayer: PlayerData
	winner: PlayerData | null
	layoutedOtherPlayers: Record<GameDeckLayoutPosition, PlayerData>
	currentRoundPlayer: PlayerData
	getWinner: (game?: Game) => PlayerData | null
	getCurrentPlayer: (players?: PlayerData[] | undefined) => PlayerData
	joinGame: (gameId: string) => Promise<Game>
	toggleReady: (gameId: string) => void
	buyCard: (gameId: string) => void
	putCard: (gameId: string, cardIds: string[], selectedColor: CardColors) => void
	toggleOnlineStatus: (gameId: string) => void
	sendChatMessage: (chatId: string, content: string) => void
	onGameStart: (fn: () => void) => void
	onNewChatMessage: (fn?: () => void) => void
	onPlayerStateChange: (fn: (playerState: PlayerState, playerId: string, amountToBuy?: number) => void) => void
	onReconnect: (fn: () => void) => void
	forceSelfDisconnect: (gameId: string) => Promise<void>
	getChat: (chatId?: string) => Chat | null
	onGameListUpdated: (fn: () => void) => void
}

const useSocket = (): UseSocketResponse => {
	const socketStore = useSocketStore()

	const getCurrentRoundPlayer = (): PlayerData => {
		const currentPlayerIndex = socketStore?.game?.currentPlayerIndex as number

		const currentRoundPlayer = socketStore?.game?.players?.[currentPlayerIndex]

		return currentRoundPlayer as PlayerData
	}

	const getWinner = (game?: Game): PlayerData | null => {
		const gameFallback = game || socketStore?.game

		if (gameFallback?.status !== "ended") {
			return null
		}

		/**
		 * After the game status is set to 'ended'
		 * the winner becomes the current round player.
		 */
		const winnerPlayerIndex = gameFallback?.currentPlayerIndex as number
		const winnerPlayer = gameFallback?.players?.[winnerPlayerIndex]

		return winnerPlayer
	}

	const getCurrentPlayer = (players?: PlayerData[]): PlayerData => {
		const playerId = socketStore.player?.id

		const playersFallback = players || socketStore?.game?.players

		const player = playersFallback?.find(player => player.id === playerId)

		return player as PlayerData
	}

	const getLayoutedOtherPlayers = (): Record<GameDeckLayoutPosition, PlayerData> => {
		const positionsByAmountOfPlayersMap: Record<number, GameDeckLayoutPosition[]> = {
			1: ["bottom"],
			2: ["bottom", "right"],
			3: ["bottom", "right", "left"],
			4: ["bottom", "right", "top", "left"],
			5: ["bottom", "right", "topRight", "top", "left"],
			6: ["bottom", "right", "topRight", "top", "topLeft", "left"],
			7: ["bottom", "bottomRight", "right", "topRight", "top", "topLeft", "left"],
			8: ["bottom", "bottomRight", "right", "topRight", "top", "topLeft", "left", "bottomLeft"],
		}

		const layoutedOtherPlayers = {} as Record<GameDeckLayoutPosition, PlayerData>

		const players = socketStore?.game?.players || []
		const playerId = socketStore.player?.id

		const currentPlayerIndex = players?.findIndex(player => player.id === playerId) as number
		const isSpectator = currentPlayerIndex === -1

    players?.forEach((player, index) => {
			const diff = isSpectator ? 0 : currentPlayerIndex
			const positionIndex = getSanitizedValueWithBoundaries(players.length - diff + index, players.length, 0)
			const currentPositions = positionsByAmountOfPlayersMap[players.length]
			
			layoutedOtherPlayers[currentPositions[positionIndex]] = player
    })

		return layoutedOtherPlayers
	}

	const joinGame = async (gameId: string): Promise<Game> => {
		const {
			game,
			chat,
		} = await SocketService.emit<JoinGameEventInput, JoinGameEventResponse>("JoinGame", { gameId })

		socketStore.setGameData(game)
		socketStore.setChatData(chat)

		return game
	}

	const toggleReady = (gameId: string) => {
		SocketService.emit<ToggleReadyEventInput, unknown>("ToggleReady", { gameId })

		const lastState = { ...socketStore?.game } as Game

		lastState.players = (lastState.players || [])?.map(player => {
			if (player.id === socketStore?.player?.id) {
				return {
					...player,
					ready: !player.ready,
				}
			}

			return player
		}) as PlayerData[]

		socketStore.setGameData(lastState)
	}

	const buyCard = async (gameId: string) => {
		await SocketService.emit<BuyCardEventInput, unknown>("BuyCard", { gameId })
	}

	const putCard = (gameId: string, cardIds: string[], selectedColor: CardColors) => {
		SocketService.emit<PutCardEventInput, unknown>("PutCard", {
			gameId,
			cardIds,
			selectedColor,
		})

		/**
		 * Little trick to improve response time
		 */
		const player = socketStore?.game?.players?.find(player => player.id === socketStore?.player?.id)

		if (!player) {
			return
		}

		const cards: CardData[] = []

		cardIds.forEach(cardId => {
			const card = player?.handCards?.find(card => card?.id === cardId) as CardData

			if (card) {
				cards.push(card)
			}
		})

		socketStore.setGameData({
			...socketStore?.game as Game,
			players: socketStore?.game?.players?.map(player => {
				if (player.id === socketStore?.player?.id) {
					return {
						...player,
						handCards: player.handCards
							.filter(handCard => !cardIds.includes(handCard.id)),
					}
				}

				return player
			}) as PlayerData[],
			usedCards: [
				...cards,
				...socketStore?.game?.usedCards as CardData[],
			],
		})
	}

	const toggleOnlineStatus = async (gameId: string) => {
		await SocketService.emit<ChangePlayerStatusEventInput, unknown>("ChangePlayerStatus", {
			gameId,
			playerStatus: "online",
		})

		const lastState = { ...socketStore?.game } as Game

		lastState.players = (lastState.players || []).map(player => {
			if (player.id === socketStore.player?.id) {
				player.status = "online"
			}

			return player
		})

		socketStore.setGameData(lastState)
	}

	const sendChatMessage = async (chatId: string, message: string) => {
		await SocketService.emit<SendChatMessageEventInput, unknown>("SendChatMessage", {
			chatId,
			message,
		})
	}

	const onGameStart = (fn: () => void) => {
		SocketService.on<GameStartedEventData>("GameStarted", ({ game }) => {
			socketStore.setGameData(game)

			fn()
		})
	}

	const onNewChatMessage = (fn?: () => void) => {
		SocketService.on<NewMessageEventData>("NewMessage", ({ chatId, message }) => {
			socketStore.addChatMessage(chatId, message)

			if (fn) {
				fn()
			}
		})
	}

	const getChat = (chatId?: string): Chat | null => {
		if (!chatId) {
			return null
		}

		const chat = socketStore.chats?.get(chatId)

		if (!chat) {
			return null
		}

		return chat
	}

	const onGameListUpdated = (fn: () => void): void => {
		SocketService.on<unknown>("GameListUpdated", fn)
	}

	const onPlayerStateChange = (fn: (playerState: PlayerState, playerId: string, amountToBuy?: number) => void) => {
		SocketService.on<PlayerBuyCardsEventData>("PlayerBuyCards", ({ playerId, amountToBuy }) => {
			fn("BuyCards", playerId, amountToBuy)
		})

		SocketService.on<PlayerBlockedEventData>("PlayerBlocked", ({ playerId }) => {
			fn("Blocked", playerId)
		})

		SocketService.on<PlayerUnoEventData>("PlayerUno", ({ playerId }) => {
			fn("Uno", playerId)
		})
	}

	const onReconnect = (fn: () => void) => {
		SocketService.on<unknown>("reconnect", async () => {
			const playerData = await SocketService.getPlayerData()

			socketStore.setPlayerData(playerData)

			fn()
		})
	}

	const forceSelfDisconnect = async (gameId: string): Promise<void> => {
		await SocketService.emit<ForceSelfDisconnectEventInput, unknown>("ForceSelfDisconnect", { gameId })
	}

	return {
		get winner (): PlayerData | null {
			return getWinner()
		},
		get currentPlayer (): PlayerData {
			return getCurrentPlayer()
		},
		get layoutedOtherPlayers (): Record<GameDeckLayoutPosition, PlayerData> {
			return getLayoutedOtherPlayers()
		},
		get currentRoundPlayer (): PlayerData {
			return getCurrentRoundPlayer()
		},
		getCurrentPlayer,
		getWinner,
		joinGame,
		sendChatMessage,
		toggleOnlineStatus,
		onGameStart,
		onPlayerStateChange,
		onNewChatMessage,
		onReconnect,
		toggleReady,
		buyCard,
		putCard,
		forceSelfDisconnect,
		getChat,
		onGameListUpdated,
	}
}

export default useSocket
