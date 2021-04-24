import { Socket } from "socket.io"

import GameHistoryService from "@/Services/GameHistoryService"

import ClientRepository from "@/Repositories/ClientRepository"

class ClientService {
	async dispatchGameHistoryConsolidated (playerId?: string): Promise<void> {
		let connectedPlayerIds: string[] = []

		if (playerId) {
			connectedPlayerIds = [playerId]
		} else {
			connectedPlayerIds = await ClientRepository.getConnectedPlayerIdList()
		}

		await Promise.all(
			connectedPlayerIds.map(async playerId => {
				const gameHistory = await GameHistoryService.retrieveGameHistory(playerId)

				const client = await ClientRepository.getClient(playerId)

				if (gameHistory && client) {
					client.emit("GameHistoryConsolidated", gameHistory)
				}
			}),
		)
	}

	async dispatchGameListUpdated (): Promise<void> {
		const connectedPlayerIds = await ClientRepository.getConnectedPlayerIdList()

		await Promise.all(
			connectedPlayerIds.map(async playerId => {
				const client = await this.getClient(playerId)

				if (client) {
					client.emit("GameListUpdated")
				}
			}),
		)
	}

	async setClient (playerId: string, client: Socket): Promise<void> {
		await ClientRepository.setClient(playerId, client)
	}

	async destroyClient (playerId: string): Promise<void> {
		await ClientRepository.destroyClient(playerId)
	}

	private async getClient (playerId: string): Promise<Socket> {
		const client = await ClientRepository.getClient(playerId)

		return client
	}
}

export default new ClientService()
