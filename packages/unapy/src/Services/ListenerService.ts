import GameService from "@/Services/GameService"
import PlayerService from "@/Services/PlayerService"

/**
 * Usually the class which handles events from client
 */
class ListenerService {
	onJoinGame (gameId: string, playerId: string) {
		const gameExists = GameService.gameExists(gameId)

		if (gameExists) {
			GameService.joinGame(gameId, playerId)
		}
	}

	onCreateGame (gameId: string, playerId: string) {
		GameService.setupGame(playerId, gameId)
	}

	onPlayerDisconnect (playerId: string) {
		GameService.purgePlayer(playerId)
	}

	onBuyCard (gameId: string, playerId: string) {
		const gameExists = GameService.gameExists(gameId)

		if (gameExists) {
			GameService.buyCard(playerId, gameId)
		}
	}

	onPutCard (gameId: string, playerId: string, cardId: string) {
		const gameExists = GameService.gameExists(gameId)

		if (gameExists) {
			GameService.putCard(playerId, cardId, gameId)
		}
	}

	onToggleReady (gameId: string, playerId: string) {
		const gameExists = GameService.gameExists(gameId)

		if (gameExists) {
			GameService.toggleReady(playerId, gameId)
		}
	}

	onSetPlayerData (playerId: string, playerName: string) {
		PlayerService.setPlayerData({ id: playerId, name: playerName })
	}
}

export default new ListenerService()
