import { Server as SocketServer } from "socket.io"

class SocketService {
	private io: SocketServer

	emitRoomEvent (roomId: string, event: string, ...data: unknown[]) {
		// eslint-disable-next-line
		const socket = this.io as any

		socket.binary(false).to(roomId).emit(event, ...data)
	}

	setup (socket: SocketServer) {
		this.io = socket
	}
}

export default new SocketService()
