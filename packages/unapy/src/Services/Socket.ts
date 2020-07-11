import { io } from "@unapy/Core/Socket"

class SocketService {
	emitRoomEvent (roomId: string, event: string, data?: any) {
		io.to(roomId).emit(event, data)
	}
}

export default new SocketService()
