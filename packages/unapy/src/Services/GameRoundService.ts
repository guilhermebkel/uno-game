import SocketService from "@/Services/SocketService"

import {
	GameRoundEvents,
	GameRoundCounter,
} from "@uno-game/protocols"

import GameRoundRepository from "@/Repositories/GameRoundRepository"

class GameService {
	getRoundRemainingTimeInSeconds (gameId: string): number {
		const gameRoundCounter = GameRoundRepository.getGameRoundCounter(gameId)

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

	resetRoundCounter (gameId: string, roundCounter: GameRoundCounter) {
		const currentRoundCounter = GameRoundRepository.getGameRoundCounter(gameId)

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

		GameRoundRepository.setGameRoundCounterData(gameId, {
			...roundCounter,
			timeoutId: newTimeoutId,
			intervalId: newIntervalId,
			initializedAtMilliseconds: Date.now(),
		})
	}

	removeRoundCounter (gameId: string) {
		const currentRoundCounter = GameRoundRepository.getGameRoundCounter(gameId)

		if (currentRoundCounter) {
			const oldTimeoutId = currentRoundCounter.timeoutId
			const oldIntervalId = currentRoundCounter.intervalId

			clearTimeout(oldTimeoutId)
			clearInterval(oldIntervalId)

			GameRoundRepository.deleteGameRoundCounter(gameId)
		}
	}

	// eslint-disable-next-line
	emitGameRoundEvent (gameId: string, event: GameRoundEvents, ...data: any) {
		SocketService.emitRoomEvent(gameId, event, ...data)
	}
}

export default new GameService()
