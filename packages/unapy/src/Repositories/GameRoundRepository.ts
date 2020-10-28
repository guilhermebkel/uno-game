import { GameRoundCounter } from "@uno-game/protocols"

class GameRoundRepository {
	private static gameRoundCounters: Map<string, GameRoundCounter> = new Map()

	static getGameRoundCounter (gameId: string): GameRoundCounter {
		const gameRoundCounter = this.gameRoundCounters.get(gameId)

		return gameRoundCounter
	}

	static deleteGameRoundCounter (gameId: string): void {
		this.gameRoundCounters.delete(gameId)
	}

	static setGameRoundCounterData (gameId: string, roundCounter: GameRoundCounter): void {
		this.gameRoundCounters.set(gameId, roundCounter)
	}
}

export default GameRoundRepository
