import io, { Socket as SocketClient } from "socket.io-client"
import MsgPackParser from "socket.io-msgpack-parser"

import { LoginDialog } from "@/components"

import AuthService from "@/services/auth"

import ErrorHandler from "@uno-game/error-handler"

import {
	SocketServerEvents,
	SocketEventHandler,
	SocketClientEvents,
	Player,
	SetPlayerDataEventInput,
	SetPlayerDataEventResponse,
} from "@uno-game/protocols"

import serverConfig from "@/config/server"

class Socket {
	static client: typeof SocketClient

	constructor () {
		if (!Socket.client) {
			Socket.client = io(serverConfig.apiUrl, {
				reconnection: true,
				reconnectionAttempts: Infinity,
				reconnectionDelay: 1000,
				reconnectionDelayMax: 5000,
				randomizationFactor: 0.5,
				...({ parser: MsgPackParser }),
			})
		}

		this.on("connect", () => {
			const playerData = AuthService.getPlayerData()

			if (playerData) {
				this.emit<SetPlayerDataEventInput, SetPlayerDataEventResponse>("SetPlayerData", {
					player: playerData,
				})
			}
		})
	}

	async emit<RequestPayload extends unknown, ResponsePayload extends unknown> (
		event: SocketServerEvents,
		data: RequestPayload,
	): Promise<ResponsePayload> {
		return await new Promise<ResponsePayload>((resolve, reject) => {
			Socket.client.emit(event, data, (error: string, responsePayload: ResponsePayload) => {
				if (error) {
					reject(error)
				}

				resolve(responsePayload)
			})
		})
	}

	on<ReceivedData extends unknown> (
		event: SocketClientEvents,
		handler: SocketEventHandler<ReceivedData, ReceivedData>,
	): void {
		Socket.client.on(event, async (data: ReceivedData) => {
			try {
				await handler(data)
			} catch (error) {
				ErrorHandler.handle(error)
			}
		})
	}
}

export const SocketService = new Socket()

export default Socket.client

export const getPlayerData = async (): Promise<Player> => {
	let playerData = AuthService.getPlayerData()

	if (!playerData) {
		const loginData = await LoginDialog.open()

		playerData = {
			id: "",
			name: loginData.name,
		}
	}

	const { player } = await SocketService.emit<SetPlayerDataEventInput, SetPlayerDataEventResponse>("SetPlayerData", {
		player: playerData,
	})

	AuthService.setPlayerData(player)

	return player
}
