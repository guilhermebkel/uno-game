import { Game } from "@uno-game/protocols"

class GameRepository {
	static games: Map<string, Game> = new Map()

	static setGameData (gameId: string, game: Game) {
		this.games.set(gameId, game)
	}

	static getGame (gameId: string) {
		const game = this.games.get(gameId)

		return game
	}

	static getGameList () {
		const games: Game[] = []

		for (const game of this.games.values()) {
			games.push(game)
		}

		return games
	}
}

export default GameRepository
