import socket, { Server as SocketServer } from "socket.io"
import { Server as HttpServer } from "http"
import MsgPackParser from "socket.io-msgpack-parser"

import ListenerService from "@/Services/ListenerService"

/**
 * Kept it here to avoid circular dependency problems
 */
export let io: SocketServer

class Socket {
	static async boot (http: HttpServer): Promise<void> {
		Socket.setupSocket(http)
		Socket.setupListeners()
	}

	static setupSocket (http: HttpServer): void {
		const oneSecondInMilliseconds = 1000
		const twoMilliseconds = 2000

		io = socket(http, {
			pingInterval: oneSecondInMilliseconds,
			pingTimeout: twoMilliseconds,
			...({ parser: MsgPackParser }),
		})
	}

	static setupListeners (): void {
		io.on("connection", client => ListenerService.onConnection(client))
	}

	static get io (): SocketServer {
		return io
	}
}

export default Socket
