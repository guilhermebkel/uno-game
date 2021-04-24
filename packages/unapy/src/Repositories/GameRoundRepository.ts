import { GameRoundCounter } from "@uno-game/protocols"

import { Store } from "@/Protocols/StoreProtocol"

import AsyncMapStoreService from "@/Services/AsyncMapStoreService"

class GameRoundRepository {
	private static gameRoundCounters: Store<GameRoundCounter> = new AsyncMapStoreService()

	static async getGameRoundCounter (gameId: string): Promise<GameRoundCounter> {
		const gameRoundCounter = await this.gameRoundCounters.getOne(gameId)

		return gameRoundCounter
	}

	static async deleteGameRoundCounter (gameId: string): Promise<void> {
		await this.gameRoundCounters.delete(gameId)
	}

	static async setGameRoundCounterData (gameId: string, roundCounter: GameRoundCounter): Promise<void> {
		await this.gameRoundCounters.set(gameId, roundCounter)
	}
}

export default GameRoundRepository
