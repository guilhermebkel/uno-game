import { Socket } from "socket.io"

class ClientRepository {
	private static clients: Map<string, Socket> = new Map()

	static setClient (playerId: string, client: Socket): void {
		this.clients.set(playerId, client)
	}

	static getClient (playerId: string): Socket {
		const client = this.clients.get(playerId)

		return client
	}
}

export default ClientRepository
