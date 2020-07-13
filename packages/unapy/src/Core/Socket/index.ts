import socket, { Server as SocketServer } from "socket.io"
import { Server as HttpServer } from "http"
import uuid from "uuid"

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
			let roomId: string

			client.emit("PlayerConnected", playerId)

			client.on("CreateGame", () => {
				roomId = uuid.v4()

				client.join(roomId)

				ListenerService.onCreateGame(roomId, playerId)
			})

			client.on("JoinGame", (roomId: string) => {
				client.join(roomId)

				ListenerService.onJoinGame(roomId, playerId)
			})

			client.on("StartGame", (roomId: string) => {
				ListenerService.onStartGame(roomId)
			})

			client.on("BuyCard", (roomId: string) => {
				ListenerService.onBuyCard(roomId, playerId)
			})

			client.on("PutCard", (roomId: string, cardId: string) => {
				ListenerService.onPutCard(roomId, playerId, cardId)
			})

			client.on("StartListeningGame", (roomId: string) => {
				client.join(roomId)

				ListenerService.onListenGame(roomId)
			})

			client.on("disconnect", () => {
				ListenerService.onPlayerDisconnect(playerId)
			})
		})
	}

	static get io() {
		return io
	}
}

export default Socket
