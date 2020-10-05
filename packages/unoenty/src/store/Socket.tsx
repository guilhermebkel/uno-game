import React, { createContext, useContext, useState } from "react"
import { Socket } from "socket.io-client"

import client, { connectSocket, getPlayerData } from "@/services/socket"

import useDidMount from "@/hooks/useDidMount"

import { LoadingApp } from "@/components"

import { preloadCardPictures } from "@/utils/card"

import { Game, ChatMessage, Chat } from "@uno-game/protocols"

export interface SocketContextData {
	io: typeof Socket
	playerId: string
	game?: Game
	chat?: Chat
	addChatMessage: (message: ChatMessage) => void
	set: (data: Partial<this>) => void
}

interface SocketProviderProps {
	children: React.ReactNode
}

const SocketStore = createContext<SocketContextData>({} as SocketContextData)

export const useSocketStore = () => useContext(SocketStore)

const SocketProvider = (props: SocketProviderProps) => {
	const { children } = props

	const [loading, setLoading] = useState(true)
	const [socketData, setSocketData] = useState<SocketContextData>({} as SocketContextData)

	const setData = (data: Partial<SocketContextData>) => {
		setSocketData(lastState => {
			return {
				...(lastState || {}),
				...data
			}
		})
	}

	const addChatMessage = (message: ChatMessage) => {
		setSocketData(lastState => {
			const chat = { ...lastState.chat } as Chat

			chat?.messages?.push(message)

			return {
				...(lastState || {}),
				chat
			}
		})
	}

	const onChatStateChanged = () => {
		client.on("ChatStateChanged", (chat: Chat) => {
			setData({ chat })
		})
	}

	const onGameStateChanged = () => {
		client.on("GameStateChanged", (game: Game) => {
			setData({ game })
		})
	}

	const onGameRoundRemainingTimeChanged = () => {
		client.on("GameRoundRemainingTimeChanged", (remainingTimeInSeconds: number) => {
			setSocketData(lastState => ({
				...lastState,
				game: {
					...(lastState.game || {}),
					roundRemainingTimeInSeconds: remainingTimeInSeconds
				} as Game
			}))
		})
	}

	const connect = async () => {
		preloadCardPictures()

		const playerId = await connectSocket()

		const playerData = await getPlayerData(playerId)

		setData({
			io: client,
			set: setData,
			playerId: playerData.id,
			addChatMessage
		})

		setLoading(false)
	}


	useDidMount(() => {
		connect()
		onGameStateChanged()
		onChatStateChanged()
		onGameRoundRemainingTimeChanged()
	})

	return (
		<SocketStore.Provider value={socketData}>
			<LoadingApp loading={loading}>
				{children}
			</LoadingApp>
		</SocketStore.Provider>
	)
}

export default SocketProvider
