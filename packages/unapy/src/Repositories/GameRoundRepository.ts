import { GameRoundCounter } from "@uno-game/protocols"

class GameRoundRepository {
	private static gameRoundCounters: Map<string, GameRoundCounter> = new Map()

	static getGameRoundRemainingTimeInSeconds (gameId: string): number {
		const gameRoundCounter = this.gameRoundCounters.get(gameId)

		if (gameRoundCounter) {
			const { initializedAtMilliseconds, timeInSeconds } = gameRoundCounter

			const currentTimeInMilliseconds = Date.now()

			const passedTimeInSeconds = ((currentTimeInMilliseconds - initializedAtMilliseconds) / 1000)

			if (passedTimeInSeconds > timeInSeconds) {
				return timeInSeconds
			}

			const remainingTimeInSeconds = Math.round(timeInSeconds - passedTimeInSeconds)

			return remainingTimeInSeconds
		}

		return null
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

export default GameRoundRepository
