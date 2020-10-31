import { Socket } from "socket.io"

import GameService from "@/Services/GameService"

import ClientRepository from "@/Repositories/ClientRepository"

class ClientService {
	dispatchGameHistoryConsolidated (playerId: string): void {
		const gameHistory = GameService.retrieveGameHistory(playerId)

		const client = this.getClient(playerId)

		if (client && gameHistory) {
			client.emit("GameHistoryConsolidated", gameHistory)
		}
	}

	dispatchGameListUpdated (playerId: string): void {
		const client = this.getClient(playerId)

		if (client) {
			client.emit("GameListUpdated")
		}
	}

	setClient (playerId: string, client: Socket) {
		ClientRepository.setClient(playerId, client)
	}

	private getClient (playerId: string): Socket {
		const client = ClientRepository.getClient(playerId)

		return client
	}
}

export default new ClientService()
