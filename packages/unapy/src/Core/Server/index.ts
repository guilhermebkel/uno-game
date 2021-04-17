import express from "express"
import { createServer } from "http"
import cors from "cors"

import routes from "@/routes"

class Server {
	private static app = express()
	static http = createServer(Server.app)

	static async boot (): Promise<void> {
		Server.setupMiddlewares()
		Server.setupRoutes()
		Server.start()
	}

	private static setupMiddlewares () {
		const middlewares = [
			express.json(),
			cors(),
		]

		middlewares.map(middleware => Server.app.use(middleware))
	}

	private static start () {
		Server.http.listen(process.env.PORT, () => {
			console.log(`Server is running... [PORT ${process.env.PORT}]`)
		})
	}

	private static setupRoutes () {
		Server.app.use(routes)
		Server.app.get("/healthcheck", (_, res) => res.status(200).json({}))
	}
}

export default Server
