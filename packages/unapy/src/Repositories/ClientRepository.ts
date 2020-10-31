import { Socket } from "socket.io"

class ClientRepository {
	private static clients: Map<string, Socket> = new Map()

	static setClient (playerId: string, client: Socket): void {
		this.clients.set(playerId, client)
	}

	static destroyClient (playerId: string): void {
		this.clients.delete(playerId)
	}

	static getClient (playerId: string): Socket {
		const client = this.clients.get(playerId)

		return client
	}

	static getConnectedPlayerIdList (): string[] {
		const playerIds: string[] = []

		for (const playerId of this.clients.keys()) {
			playerIds.push(playerId)
		}

		return playerIds
	}
}

export default ClientRepository
