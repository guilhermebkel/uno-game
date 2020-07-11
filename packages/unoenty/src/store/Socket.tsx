import React, { createContext, useContext, useState } from "react"
import { Socket } from "socket.io-client"
import _ from "lodash"

import client, { connectSocket } from "../services/socket"

import useDidMount from "../hooks/useDidMount"

import { Loading } from "../components"

import { Game } from "../protocols/Game"

export interface ContextData {
	io: typeof Socket
	playerId: string
	game?: Game
	set: (data: Partial<this>) => void
}

interface SocketProviderProps {
	children: React.ReactNode
}

const SocketStore = createContext<ContextData>({} as ContextData)

export const useSocketStore = () => useContext(SocketStore)

const SocketProvider = (props: SocketProviderProps) => {
	const { children } = props

	const [loading, setLoading] = useState(true)
	const [socketData, setSocketData] = useState<ContextData>({} as ContextData)

	const setData = (data: Partial<ContextData>) => {
		setSocketData(lastState => _.merge(lastState, data))
	}

	const onGameStateChanged = () => {
		client.on("GameStateChanged", (game: Game) => {
			setData({ game })
		})
	}

	const connect = async () => {
		const playerId = await connectSocket()

		setSocketData({
			io: client,
			set: setData,
			playerId
		})

		setLoading(false)
	}

	useDidMount(() => {
		connect()
		onGameStateChanged()
	})

	return (
		<SocketStore.Provider value={socketData}>
			<Loading loading={loading}>
				{children}
			</Loading>
		</SocketStore.Provider>
	)
}

export default SocketProvider
