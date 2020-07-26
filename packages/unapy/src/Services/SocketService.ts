import { io } from "@/Core/Socket"

class SocketService {
	// eslint-disable-next-line
	emitRoomEvent (roomId: string, event: string, ...data: any) {
		io.to(roomId).emit(event, ...data)
	}
}

export default new SocketService()
