import React, { createContext, useContext, useState } from "react"
import { Socket } from "socket.io-client"

import client, { connectSocket } from "@/services/socket"
import Auth from "@/services/auth"

import useDidMount from "@/hooks/useDidMount"

import { LoadingApp, LoginDialog } from "@/components"

import { preloadCardPictures } from "@/utils/card"

import { Game } from "@uno-game/protocols"

export interface SocketContextData {
	io: typeof Socket
	playerId: string
	game?: Game
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

	const onGameStateChanged = () => {
		client.on("GameStateChanged", (game: Game) => {
			setData({ game })
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
			playerId
		}

		setData(data)

		setLoading(false)
	}

	useDidMount(() => {
		connect()
		onGameStateChanged()
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
