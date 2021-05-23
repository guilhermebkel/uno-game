import { Server as SocketServer } from "socket.io"
import { SocketServerEvents, SocketClientEvents, SocketEventHandler } from "@uno-game/protocols"
import ErrorHandler from "@uno-game/error-handler"

import {
	SocketCallback,
	SocketClient,
	SocketContext,
	SocketRoomNameMap,
} from "@/Protocols/SocketProtocol"

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

	emitRoomEvent<Data extends unknown> (context: SocketContext, id: string, event: SocketClientEvents, data: Data) {
		const roomName = this.mountRoomName(context, id)

		this.emitEvent(roomName, event, data)
	}

	removeListener (client: SocketClient, context: SocketContext, id: string) {
		const roomName = this.mountRoomName(context, id)

		client.leave(roomName)
	}

	setupListener (client: SocketClient, context: SocketContext, id: string): void {
		const roomName = this.mountRoomName(context, id)

		client.join(roomName)
	}

	private mountRoomName (context: SocketContext, id: string): string {
		const socketRoomNameMap: SocketRoomNameMap = {
			game: `game:${id}`,
			player: `player:${id}`,
			chat: `chat:${id}`,
		}

		const roomName = socketRoomNameMap[context]

		return roomName
	}

	private emitEvent (roomId: string, event: SocketClientEvents, data: unknown): void {
		const socket = this.io

		socket.to(roomId).emit(event, data)
	}

	private callback (callback: SocketCallback, error: string, data: unknown): void {
		if (typeof callback === "function") {
			callback(error, data)
		}
	}
}

export default new SocketService()
