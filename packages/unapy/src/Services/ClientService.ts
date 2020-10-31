import { Socket } from "socket.io"

import GameService from "@/Services/GameService"

import ClientRepository from "@/Repositories/ClientRepository"

class ClientService {
	consolidateGameHistory (playerId: string): void {
		const gameHistory = GameService.retrieveGameHistory(playerId)

		const client = this.getClient(playerId)

		if (client && gameHistory) {
			client.emit("GameHistoryConsolidated", gameHistory)
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
