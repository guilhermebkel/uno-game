import React, { createContext, useContext, useState } from "react"
import { Socket } from "socket.io-client"

import client, { connectSocket } from "@/services/socket"
import Auth from "@/services/auth"

import useDidMount from "@/hooks/useDidMount"

import { LoadingApp, LoginDialog } from "@/components"

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

		let playerId = await connectSocket()

		let playerData = Auth.getPlayerData()

		if (playerData) {
			playerId = playerData.id
		} else {
			const loginData = await LoginDialog.open()

			playerData = {
				id: playerId,
				name: loginData.name
			}

			Auth.setPlayerData(playerData)
		}

		client.emit("SetPlayerData", playerData.id, playerData.name)

		await new Promise<void>((resolve) => {
			client.on("PlayerDataSet", resolve)
		})

		const data: SocketContextData = {
			io: client,
			set: setData,
			playerId,
			addChatMessage
		}

		setData(data)

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
