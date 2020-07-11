import { createContext, useContext } from "react"
import { Socket } from "socket.io-client"

interface ContextData {
	io: typeof Socket
}

export const SocketState = createContext<ContextData>({} as ContextData)

export const useSocketState = () => useContext(SocketState)
