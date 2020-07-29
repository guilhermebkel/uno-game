import socket, { Server as SocketServer } from "socket.io"
import { Server as HttpServer } from "http"
import MsgPackParser from "socket.io-msgpack-parser"

import ListenerService from "@/Services/ListenerService"

import CryptUtil from "@/Utils/CryptUtil"

import { Player } from "@uno-game/protocols"

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
		const twoMinutesInMilliseconds = 120000

		io = socket(http, {
			pingInterval: oneSecondInMilliseconds,
			pingTimeout: twoMinutesInMilliseconds,
			...({ parser: MsgPackParser })
		})
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
				const roomId = CryptUtil.makeShortUUID()

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

			client.on("PutCard", (roomId: string, cardIds: string[], ) => {
				ListenerService.onPutCard(roomId, playerData.id, cardIds)
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
