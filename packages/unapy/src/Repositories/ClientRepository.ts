import { Socket } from "socket.io"

import { Store } from "@/Protocols/StoreProtocol"

import AsyncMapStoreService from "@/Services/AsyncMapStoreService"

class ClientRepository {
	private static clients: Store<Socket> = new AsyncMapStoreService()

	static async setClient (playerId: string, client: Socket): Promise<void> {
		await this.clients.set(playerId, client)
	}

	static async destroyClient (playerId: string): Promise<void> {
		await this.clients.delete(playerId)
	}

	static async getClient (playerId: string): Promise<Socket> {
		const client = await this.clients.getOne(playerId)

		return client
	}

	static async getConnectedPlayerIdList (): Promise<string[]> {
		const playerIds = await this.clients.getKeys()

		return playerIds
	}
}

export default ClientRepository
