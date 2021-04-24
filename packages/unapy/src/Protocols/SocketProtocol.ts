import { Socket } from "socket.io"

export type SocketCallback = (error: string, data: unknown) => void

export type SocketClient = Socket
