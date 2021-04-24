import { GameRoundCounter } from "@uno-game/protocols"

class GameRoundRepository {
	private static gameRoundCounters: Map<string, GameRoundCounter> = new Map()

	static async getGameRoundCounter (gameId: string): Promise<GameRoundCounter> {
		const gameRoundCounter = this.gameRoundCounters.get(gameId)

		return gameRoundCounter
	}

	static async deleteGameRoundCounter (gameId: string): Promise<void> {
		this.gameRoundCounters.delete(gameId)
	}

	static async setGameRoundCounterData (gameId: string, roundCounter: GameRoundCounter): Promise<void> {
		this.gameRoundCounters.set(gameId, roundCounter)
	}
}

export default GameRoundRepository
