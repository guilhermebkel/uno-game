import { Server as SocketServer } from "socket.io"

class SocketService {
	private io: SocketServer

	emitRoomEvent (roomId: string, event: string, ...data: unknown[]) {
		const socket = this.io

		socket.to(roomId).emit(event, ...data)
	}

	setup (socket: SocketServer) {
		// eslint-disable-next-line
		const socketWithDisabledBinary = (socket as any).binary(false)

		this.io = socketWithDisabledBinary as SocketServer
	}
}

export default new SocketService()
