import socket, { Server as SocketServer } from "socket.io"
import { Server as HttpServer } from "http"
import MsgPackParser from "socket.io-msgpack-parser"

import ListenerService from "@/Services/ListenerService"

/**
 * Kept it here to avoid circular dependency problems
 */
export let io: SocketServer

class Socket {
	static async boot(http: HttpServer) {
		Socket.setupSocket(http)
		Socket.setupListeners()
	}

	static setupSocket(http: HttpServer) {
		const oneSecondInMilliseconds = 1000
		const twoMinutesInMilliseconds = 2000

		io = socket(http, {
			pingInterval: oneSecondInMilliseconds,
			pingTimeout: twoMinutesInMilliseconds,
			...({ parser: MsgPackParser })
		})
	}

	static setupListeners() {
		io.on("connection", client => ListenerService.onConnection(client))
	}

	static get io() {
		return io
	}
}

export default Socket
