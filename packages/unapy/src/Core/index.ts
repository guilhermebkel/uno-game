import Server from "@/Core/Server"
import Socket from "@/Core/Socket"

import ServerHandlerModule from "@/Modules/ServerHandlerModule"

class Core {
	async boot () {
		await Server.boot()
		await Socket.boot(Server.http)

		ServerHandlerModule.onSocketStart()
	}
}

export default new Core()
