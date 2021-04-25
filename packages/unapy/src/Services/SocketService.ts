import { Server as SocketServer } from "socket.io"
import { SocketServerEvents, SocketClientEvents, SocketEventHandler } from "@uno-game/protocols"
import ErrorHandler from "@uno-game/error-handler"

import { SocketCallback, SocketClient } from "@/Protocols/SocketProtocol"

class SocketService {
	private io: SocketServer

	on<ReceivedData extends unknown, ResponseData extends unknown> (
		client: SocketClient,
		event: SocketServerEvents,
		handler: SocketEventHandler<ReceivedData, ResponseData>,
	): void {
		client.on(event, async (data: ReceivedData, callback: SocketCallback) => {
			try {
				const result = await handler(data)

				this.callback(callback, null, result)
			} catch (error) {
				ErrorHandler.handle(error)
				this.callback(callback, error.name, null)
			}
		})
	}

	setup (socket: SocketServer) {
		// eslint-disable-next-line
		const socketWithDisabledBinary = (socket as any).binary(false)

		this.io = socketWithDisabledBinary as SocketServer
	}

	emitGameEvent (gameId: string, event: SocketClientEvents, ...data: unknown[]) {
		const roomName = this.mountGameRoomName(gameId)

		this.emitRoomEvent(roomName, event, ...data)
	}

	emitPlayerEvent (playerId: string, event: SocketClientEvents, ...data: unknown[]) {
		const roomName = this.mountPlayerRoomName(playerId)

		this.emitRoomEvent(roomName, event, ...data)
	}

	emitChatEvent (chatId: string, event: SocketClientEvents, ...data: unknown[]) {
		const roomName = this.mountChatRoomName(chatId)

		this.emitRoomEvent(roomName, event, ...data)
	}

	setupPlayerListener (client: SocketClient, playerId: string) {
		const roomName = this.mountPlayerRoomName(playerId)

		client.join(roomName)
	}

	setupGameListener (client: SocketClient, gameId: string) {
		const roomName = this.mountGameRoomName(gameId)

		client.join(roomName)
	}

	setupChatListener (client: SocketClient, chatId: string) {
		const roomName = this.mountChatRoomName(chatId)

		client.join(roomName)
	}

	private mountChatRoomName (playerId: string): string {
		const playerRoomName = `chat:${playerId}`

		return playerRoomName
	}

	private mountPlayerRoomName (playerId: string): string {
		const playerRoomName = `player:${playerId}`

		return playerRoomName
	}

	private mountGameRoomName (gameId: string): string {
		const gameRoomName = `game:${gameId}`

		return gameRoomName
	}

	private emitRoomEvent (roomId: string, event: SocketClientEvents, ...data: unknown[]) {
		const socket = this.io

		socket.to(roomId).emit(event, ...data)
	}

	private callback (callback: SocketCallback, error: string, data: unknown): void {
		if (typeof callback === "function") {
			callback(error, data)
		}
	}
}

export default new SocketService()
