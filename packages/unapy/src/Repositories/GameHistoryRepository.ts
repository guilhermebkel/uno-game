import { GameHistory } from "@uno-game/protocols"

class GameRepository {
	private static gameHistories: Map<string, GameHistory[]> = new Map()

	static async setGameHistory (playerId: string, gameHistory: GameHistory[]): Promise<void> {
		this.gameHistories.set(playerId, gameHistory)
	}

	static async getGameHistory (playerId: string): Promise<GameHistory[]> {
		const game = this.gameHistories.get(playerId)

		return game
	}
}

export default GameRepository
