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
			const playerId = client.id

			client.emit("PlayerConnected", playerId)

			client.on("CreateGame", (roomId: string) => {
				client.join(roomId)

				ListenerService.onCreateGame(roomId, playerId)
			})

			client.on("JoinGame", (roomId: string) => {
				client.join(roomId)

				ListenerService.onJoinGame(roomId, playerId)
			})
		})
	}

	static get io() {
		return io
	}
}

export default Socket
