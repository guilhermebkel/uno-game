import express from "express"
import { createServer } from "http"
import cors from "cors"
import socket from 'socket.io'

import routes from "@unapy/routes"

class Server {
	private static app = express()
	private static http = createServer(Server.app)
	static socket = socket(Server.http)

	static async boot() {
		Server.setupMiddlewares()
		Server.setupRoutes()
		Server.start()
	}

	private static setupMiddlewares() {
		const middlewares = [
			express.json(),
			cors()
		]

		middlewares.map(middleware => Server.app.use(middleware))
	}

	private static start() {
		Server.http.listen(process.env.PORT, () => {
			console.log(`Server is running... [PORT ${process.env.PORT}]`)
		})
	}

	private static setupRoutes() {
		Server.app.use(routes)
	}
}

export default Server
