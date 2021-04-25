import React, { createContext, useContext, useState } from "react"
import { Socket } from "socket.io-client"

import client, { getPlayerData } from "@/services/socket"

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
} from "@uno-game/protocols"

export interface SocketContextData {
	io: typeof Socket
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
		setGame(data)
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

	const onChatStateChanged = () => {
		client.on("ChatStateChanged", (chat: Chat) => {
			setChats(lastState => {
				const updatedChats = new Map(lastState.entries())

				updatedChats.set(chat.id, chat)

				return updatedChats
			})
		})
	}

	const onGameHistoryConsolidated = () => {
		client.on("GameHistoryConsolidated", (gameHistory: GameHistory[]) => {
			setGameHistory(gameHistory)
		})
	}

	const onGameStateChanged = () => {
		client.on("GameStateChanged", (game: Game) => {
			setGameData(game)
		})
	}

	const onGameRoundRemainingTimeChanged = () => {
		client.on("GameRoundRemainingTimeChanged", (remainingTimeInSeconds: number) => {
			setGameRoundRemainingTimeInSeconds(remainingTimeInSeconds)
		})
	}

	const connect = async () => {
		preloadCardPictures()

		refreshCacheIfNeeded()

		const playerData = await getPlayerData()

		setPlayerData(playerData)

		setTimeout(() => {
			setLoading(false)
		}, 1000)
	}

	useDidMount(() => {
		connect()
		onGameStateChanged()
		onChatStateChanged()
		onGameRoundRemainingTimeChanged()
		onGameHistoryConsolidated()
	})

	return (
		<SocketStore.Provider
			value={{
				io: client,
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
