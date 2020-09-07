import { Game, GameRoundCounter } from "@uno-game/protocols"

class GameRepository {
	private static games: Map<string, Game> = new Map()
	private static gameRoundCounters: Map<string, GameRoundCounter> = new Map()

	static setGameData (gameId: string, game: Game): void {
		this.games.set(gameId, game)
	}

	static getGame (gameId: string): Game {
		const game = this.games.get(gameId)

		return game
	}

	static getGameList (): Game[] {
		const games: Game[] = []

		for (const game of this.games.values()) {
			games.push(game)
		}

		return games
	}

	static getGameRoundRemainingTimeInSeconds (gameId: string): number {
		const { maxRoundDurationInSeconds } = this.getGame(gameId)

		const gameRoundCounter = this.gameRoundCounters.get(gameId)

		if (gameRoundCounter) {
			const { initializedAtMilliseconds } = gameRoundCounter

			const currentTimeInMilliseconds = Date.now()

			const passedTimeInSeconds = ((currentTimeInMilliseconds - initializedAtMilliseconds) / 1000)

			if (passedTimeInSeconds > maxRoundDurationInSeconds) {
				return maxRoundDurationInSeconds
			}

			const remainingTimeInSeconds = Math.round(maxRoundDurationInSeconds - passedTimeInSeconds)

			return remainingTimeInSeconds
		}

		return maxRoundDurationInSeconds
	}

	static resetGameRoundCounter (gameId: string, roundCounter: GameRoundCounter): void {
		const currentRoundCounter = this.gameRoundCounters.get(gameId)

		if (currentRoundCounter) {
			const oldTimeoutId = currentRoundCounter.timeoutId
			const oldIntervalId = currentRoundCounter.intervalId

			clearTimeout(oldTimeoutId)
			clearInterval(oldIntervalId)
		}

		const roundCounterInMilliseconds = roundCounter.timeInSeconds * 1000

		const newTimeoutId = setTimeout(() => {
			roundCounter.timeoutAction(gameId)
		}, roundCounterInMilliseconds)

		const newIntervalId = setInterval(() => {
			roundCounter.intervalAction(gameId)
		}, 1000)

		this.gameRoundCounters.set(gameId, {
			...roundCounter,
			timeoutId: newTimeoutId,
			intervalId: newIntervalId,
			initializedAtMilliseconds: Date.now()
		})
	}

	static removeRoundCounter (gameId: string): void {
		const currentRoundCounter = this.gameRoundCounters.get(gameId)

		if (currentRoundCounter) {
			const oldTimeoutId = currentRoundCounter.timeoutId
			const oldIntervalId = currentRoundCounter.intervalId

			clearTimeout(oldTimeoutId)
			clearInterval(oldIntervalId)

			this.gameRoundCounters.delete(gameId)
		}
	}
}

export default GameRepository
