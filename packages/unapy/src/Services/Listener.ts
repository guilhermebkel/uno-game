import GameService from "@unapy/Services/Game"

/**
 * Usually the class which handles events from client
 */
class ListenerService {
	onJoinGame (gameId: string, playerId: string) {
		GameService.addPlayer(gameId, playerId)
	}

	onCreateGame (gameId: string, playerId: string) {
		GameService.setupGame(gameId, playerId)
	}
}

export default new ListenerService()
