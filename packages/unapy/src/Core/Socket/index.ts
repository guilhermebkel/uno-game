import socket, { Server as SocketServer } from "socket.io"
import { Server as HttpServer } from "http"

import ListenerService from "@unapy/Services/Listener"

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
		io = socket(http)
	}

	static setupListeners() {
		io.on("connection", client => {
			client.on("CreateGame", (playerId: string, roomId: string) => {
				client.join(roomId)

				ListenerService.onGameCreate(playerId, roomId)
			})
		})
	}

	static get io() {
		return io
	}
}

export default Socket
