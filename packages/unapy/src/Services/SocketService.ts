import { Server as SocketServer } from "socket.io"
import { SocketEventHandler, SocketServerEvents } from "@uno-game/protocols"
import ErrorHandler from "@uno-game/error-handler"

import { SocketCallback, SocketClient } from "@/Protocols/SocketProtocol"

class SocketService {
	private io: SocketServer

	on<ReceivedData extends unknown, ResponseData extends unknown> (
		client: SocketClient,
		event: SocketServerEvents,
		handler: SocketEventHandler<ReceivedData, ResponseData>,
	): void {
		client.on(event, async (...data: unknown[]) => {
			try {
				await handler(...data)

				// this.callback(callback, null, result)
			} catch (error) {
				ErrorHandler.handle(error)
				// this.callback(callback, error.name, null)
			}
		})
	}

	emitRoomEvent (roomId: string, event: string, ...data: unknown[]) {
		const socket = this.io

		socket.to(roomId).emit(event, ...data)
	}

	setup (socket: SocketServer) {
		// eslint-disable-next-line
		const socketWithDisabledBinary = (socket as any).binary(false)

		this.io = socketWithDisabledBinary as SocketServer
	}

	private callback (callback: SocketCallback, error: string, data: unknown): void {
		if (typeof callback === "function") {
			callback(error, data)
		}
	}
}

export default new SocketService()
