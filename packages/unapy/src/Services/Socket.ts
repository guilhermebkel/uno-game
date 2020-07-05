import Server from "@unapy/Core/Server"

class SocketService {
	io = Server.socket
}

export default new SocketService()
