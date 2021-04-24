import { Socket } from "socket.io"

class ClientRepository {
	private static clients: Map<string, Socket> = new Map()

	static async setClient (playerId: string, client: Socket): Promise<void> {
		this.clients.set(playerId, client)
	}

	static async destroyClient (playerId: string): Promise<void> {
		this.clients.delete(playerId)
	}

	static async getClient (playerId: string): Promise<Socket> {
		const client = this.clients.get(playerId)

		return client
	}

	static async getConnectedPlayerIdList (): Promise<string[]> {
		const playerIds: string[] = []

		for (const playerId of this.clients.keys()) {
			playerIds.push(playerId)
		}

		return playerIds
	}
}

export default ClientRepository
