import { Socket } from "socket.io"

import GameHistoryService from "@/Services/GameHistoryService"

import ClientRepository from "@/Repositories/ClientRepository"

class ClientService {
	dispatchGameHistoryConsolidated (playerId?: string): void {
		let connectedPlayerIds: string[] = []

		if (playerId) {
			connectedPlayerIds = [playerId]
		} else {
			connectedPlayerIds = ClientRepository.getConnectedPlayerIdList()
		}

		connectedPlayerIds.forEach(playerId => {
			const gameHistory = GameHistoryService.retrieveGameHistory(playerId)

			const client = ClientRepository.getClient(playerId)

			if (gameHistory && client) {
				client.emit("GameHistoryConsolidated", gameHistory)
			}
		})
	}

	dispatchGameListUpdated (): void {
		const connectedPlayerIds = ClientRepository.getConnectedPlayerIdList()

		connectedPlayerIds.forEach(playerId => {
			const client = this.getClient(playerId)

			if (client) {
				client.emit("GameListUpdated")
			}
		})
	}

	setClient (playerId: string, client: Socket): void {
		ClientRepository.setClient(playerId, client)
	}

	destroyClient (playerId: string): void {
		ClientRepository.destroyClient(playerId)
	}

	private getClient (playerId: string): Socket {
		const client = ClientRepository.getClient(playerId)

		return client
	}
}

export default new ClientService()
