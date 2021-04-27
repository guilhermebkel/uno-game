import { Game } from "@uno-game/protocols"

import { Store } from "@/Protocols/StoreProtocol"

import MemoryWithCacheStoreService from "@/Services/MemoryWithCacheStoreService"

class GameRepository {
	private static games: Store<Game> = new MemoryWithCacheStoreService("game")

	static async setGameData (gameId: string, game: Game): Promise<void> {
		await this.games.set(gameId, game)
	}

	static async getGame (gameId: string): Promise<Game> {
		const game = await this.games.getOne(gameId)

		return game
	}

	static async getGameList (): Promise<Game[]> {
		const games: Game[] = await this.games.getAll()

		return games
	}
}

export default GameRepository
