import io from "socket.io-client"
import MsgPackParser from "socket.io-msgpack-parser"

import { LoginDialog } from "@/components"
import Auth from "@/services/auth"

import serverConfig from "@/config/server"

const client = io(serverConfig.apiUrl, {
	reconnection: true,
	reconnectionAttempts: Infinity,
	reconnectionDelay: 1000,
	reconnectionDelayMax: 5000,
	randomizationFactor: 0.5,
	...({ parser: MsgPackParser })
})

export const connectSocket = async () => {
	return new Promise<string>(resolve => {
		client.on("PlayerConnected", (playerId: string) => {
			resolve(playerId)
		})
	})
}

export const getPlayerData = async (playerId: string) => {
	let playerData = Auth.getPlayerData()

	if (!playerData) {
		const loginData = await LoginDialog.open()

		playerData = {
			id: playerId,
			name: loginData.name
		}

		Auth.setPlayerData(playerData)
	}

	client.emit("SetPlayerData", playerData.id, playerData.name)

	await new Promise<void>((resolve) => {
		client.on("PlayerDataSet", resolve)
	})

	return playerData
}

export default client
