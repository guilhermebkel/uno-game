import SocketService from "@/Services/SocketService"

import {
	GameRoundEvents,
	GameRoundCounter,
} from "@uno-game/protocols"

import GameRoundRepository from "@/Repositories/GameRoundRepository"

class GameService {
	getRoundRemainingTimeInSeconds (gameId: string): number {
		const remainingTimeInSeconds = GameRoundRepository.getGameRoundRemainingTimeInSeconds(gameId)

		return remainingTimeInSeconds
	}

	resetRoundCounter (gameId: string, data: GameRoundCounter) {
		GameRoundRepository.resetGameRoundCounter(gameId, data)
	}

	removeRoundCounter (gameId: string) {
		GameRoundRepository.removeRoundCounter(gameId)
	}

	// eslint-disable-next-line
	emitGameRoundEvent (gameId: string, event: GameRoundEvents, ...data: any) {
		SocketService.emitRoomEvent(gameId, event, ...data)
	}
}

export default new GameService()
