import { GameHistory } from "@uno-game/protocols"

import { Store } from "@/Protocols/StoreProtocol"

import MemoryWithCacheStoreService from "@/Services/MemoryWithCacheStoreService"

class GameRepository {
	private static gameHistories: Store<GameHistory[]> = new MemoryWithCacheStoreService("game-history")

	static async setGameHistory (playerId: string, gameHistory: GameHistory[]): Promise<void> {
		await this.gameHistories.set(playerId, gameHistory)
	}

	static async getGameHistory (playerId: string): Promise<GameHistory[]> {
		const gameHistory = await this.gameHistories.getOne(playerId)

		return gameHistory
	}
}

export default GameRepository
