import socket, { Server as SocketServer } from "socket.io"
import { Server as HttpServer } from "http"
import uuid from "uuid"

import ListenerService from "@unapy/Services/ListenerService"

import { Player } from "@shared/protocols/Player"

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
			const playerData = {} as Player

			client.emit("PlayerConnected", client.id)

			client.on("SetPlayerData", (playerId: string, playerName: string) => {
				playerData.id = playerId
				playerData.name = playerName

				ListenerService.onSetPlayerData(playerId, playerName)

				client.emit("PlayerDataSet")
			})

			client.on("CreateGame", () => {
				const roomId = uuid.v4()

				client.join(roomId)

				ListenerService.onCreateGame(roomId, playerData.id)
			})

			client.on("JoinGame", (roomId: string, ) => {
				client.join(roomId)

				ListenerService.onJoinGame(roomId, playerData.id)
			})

			client.on("BuyCard", (roomId: string, ) => {
				ListenerService.onBuyCard(roomId, playerData.id)
			})

			client.on("PutCard", (roomId: string, cardId: string, ) => {
				ListenerService.onPutCard(roomId, playerData.id, cardId)
			})

			client.on("ToggleReady", (roomId: string, ) => {
				ListenerService.onToggleReady(roomId, playerData.id)
			})

			client.on("disconnect", () => {
				ListenerService.onPlayerDisconnect(playerData.id)
			})
		})
	}

	static get io() {
		return io
	}
}

export default Socket
