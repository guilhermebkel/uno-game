import { Socket } from "socket.io"

export type SocketCallback = (error: string, data: unknown) => void

export type SocketClient = Socket

export type SocketContext = "chat" | "game" | "player"

export type SocketRoomNameMap = {
	[key in SocketContext]: string
}
