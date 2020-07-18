import GameService from "@unapy/Services/GameService"

/**
 * Usually the class which handles events from client
 */
class ListenerService {
	onJoinGame (gameId: string, playerId: string) {
		GameService.joinGame(gameId, playerId)
	}

	onCreateGame (gameId: string, playerId: string) {
		GameService.setupGame(playerId, gameId)
	}

	onPlayerDisconnect (playerId: string) {
		GameService.purgePlayer(playerId)
	}

	onStartGame (gameId: string) {
		GameService.startGame(gameId)
	}

	onBuyCard (gameId: string, playerId: string) {
		GameService.buyCard(playerId, gameId)
	}

	onPutCard (gameId: string, playerId: string, cardId: string) {
		GameService.putCard(playerId, cardId, gameId)
	}

	onToggleReady (gameId: string, playerId: string) {
		GameService.toggleReady(playerId, gameId)
	}
}

export default new ListenerService()
