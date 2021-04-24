import socket, { Server as SocketServer } from "socket.io"
import { Server as HttpServer } from "http"
import MsgPackParser from "socket.io-msgpack-parser"
import { createAdapter } from "socket.io-redis"
import Redis from "ioredis"

import SocketService from "@/Services/SocketService"

import redisConfig from "@/Config/redis"

import EventHandlerModule from "@/Modules/EventHandlerModule"

class Socket {
	private static io: SocketServer

	static async boot (http: HttpServer): Promise<void> {
		Socket.setupSocket(http)
		Socket.setupListeners()
		Socket.setupService()
	}

	private static setupAdapter (): void {
		const pubClient = new Redis({
			host: redisConfig.host,
			port: redisConfig.port,
		})

		const subClient = pubClient.duplicate()

		this.io.adapter(
			createAdapter({
				pubClient,
				subClient,
			}),
		)
	}

	private static setupSocket (http: HttpServer): void {
		this.io = socket(http, {
			...({ parser: MsgPackParser }),
		})
	}

	private static setupListeners (): void {
		this.io.on("connection", client => EventHandlerModule.onConnection(client))
	}

	private static setupService (): void {
		SocketService.setup(this.io)
	}
}

export default Socket
