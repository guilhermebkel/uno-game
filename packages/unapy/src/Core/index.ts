import Server from "@/Core/Server"
import Socket from "@/Core/Socket"

class Core {
	async boot () {
		await Server.boot()
		Socket.boot(Server.http)
	}
}

export default new Core()
