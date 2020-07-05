import Server from "@unapy/Core/Server"

class Core {
	async boot() {
		await Server.boot()
	}
}

export default new Core()
