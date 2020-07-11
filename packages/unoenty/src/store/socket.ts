import { createContext, useContext } from "react"
import { Socket } from "socket.io-client"

export interface ContextData {
	io: typeof Socket
	playerId: string
}

export const SocketStore = createContext<ContextData>({} as ContextData)

export const useSocketStore = () => useContext(SocketStore)
