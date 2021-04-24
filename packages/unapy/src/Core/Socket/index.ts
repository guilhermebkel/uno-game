import socket, { Server as SocketServer } from "socket.io"
import { Server as HttpServer } from "http"
import MsgPackParser from "socket.io-msgpack-parser"

import SocketService from "@/Services/SocketService"

import EventHandlerModule from "@/Modules/EventHandlerModule"

class Socket {
	private static io: SocketServer

	static async boot (http: HttpServer): Promise<void> {
		Socket.setupSocket(http)
		Socket.setupListeners()
		Socket.setupService()
	}

	private static setupSocket (http: HttpServer): void {
		const oneSecondInMilliseconds = 1000

		this.io = socket(http, {
			pingInterval: oneSecondInMilliseconds,
			pingTimeout: oneSecondInMilliseconds * 2,
			...({ parser: MsgPackParser }),
		})
	}

	private static setupListeners (): void {
		this.io.on("connection", client => EventHandlerModule.onConnection(client))
	}

	private static setupService (): void {
		SocketService.setup(this.io)
	}
}

export default Socket
