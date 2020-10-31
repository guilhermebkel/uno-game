import { GameHistory } from "@uno-game/protocols"

class GameRepository {
	private static gameHistories: Map<string, GameHistory[]> = new Map()

	static setGameHistory (playerId: string, gameHistory: GameHistory[]): void {
		this.gameHistories.set(playerId, gameHistory)
	}

	static getGameHistory (playerId: string): GameHistory[] {
		const game = this.gameHistories.get(playerId)

		return game
	}
}

export default GameRepository
