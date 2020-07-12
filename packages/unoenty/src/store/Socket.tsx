import React, { createContext, useContext, useState } from "react"
import { Socket } from "socket.io-client"
import _ from "lodash"

import client, { connectSocket } from "../services/socket"

import useDidMount from "../hooks/useDidMount"

import { Loading } from "../components"

import { Game } from "../protocols/Game"
import { PlayerData } from "../protocols/Player"

export interface SocketContextData {
	io: typeof Socket
	playerId: string
	currentPlayer: PlayerData
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
		setSocketData(lastState => _.merge(lastState, data))
	}

	const onGameStateChanged = () => {
		client.on("GameStateChanged", (game: Game) => {
			setData({ game })
		})
	}

	const connect = async () => {
		const playerId = await connectSocket()

		const data: SocketContextData = {
			io: client,
			set: setData,
			playerId,
			get currentPlayer () {
				const player = this?.game?.players?.
					find(player => player.id === this.playerId) || {}

				return player as PlayerData
			}
		}

		setSocketData(data)

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
