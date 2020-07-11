import Server from "@unapy/Core/Server"
import Socket from "@unapy/Core/Socket"

class Core {
	async boot() {
		await Server.boot()
		Socket.boot(Server.http)
	}
}

export default new Core()
