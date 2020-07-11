import { createContext, useContext } from "react"
import { Socket } from "socket.io-client"

export interface ContextData {
	io: typeof Socket
	playerId: string
}

export const SocketState = createContext<ContextData>({} as ContextData)

export const useSocketState = () => useContext(SocketState)
