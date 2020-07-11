import GameService from "@unapy/Services/Game"

/**
 * Usually the class which handles events from client
 */
class ListenerService {
	onGameCreate (playerId: string, gameId: string) {
		GameService.setupGame(playerId, gameId)
	}
}

export default new ListenerService()
