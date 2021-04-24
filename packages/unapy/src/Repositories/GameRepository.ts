import { Game } from "@uno-game/protocols"

class GameRepository {
	private static games: Map<string, Game> = new Map()

	static async setGameData (gameId: string, game: Game): Promise<void> {
		this.games.set(gameId, game)
	}

	static async getGame (gameId: string): Promise<Game> {
		const game = this.games.get(gameId)

		return game
	}

	static async getGameList (): Promise<Game[]> {
		const games: Game[] = []

		for (const game of this.games.values()) {
			games.push(game)
		}

		return games
	}
}

export default GameRepository
