import { Player } from "@uno-game/protocols"

import { Store } from "@/Protocols/StoreProtocol"

import MemoryWithCacheStoreService from "@/Services/MemoryWithCacheStoreService"

class PlayerRepository {
	private static players: Store<Player> = new MemoryWithCacheStoreService("player")

	static async setPlayerData (playerData: Player): Promise<void> {
		await this.players.set(playerData.id, playerData)
	}

	static async getPlayerData (playerId: string): Promise<Player> {
		return await this.players.getOne(playerId)
	}

	static async getAllPlayerIds (): Promise<string[]> {
		return await this.players.getKeys()
	}
}

export default PlayerRepository
