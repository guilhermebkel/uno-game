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
		const playerExists = PlayerService.playerExists(playerId)

		if (playerExists) {
			GameService.setupGame(playerId, gameId)
		}
	}

	onPlayerDisconnect (playerId: string) {
		const playerExists = PlayerService.playerExists(playerId)

		if (playerExists) {
			GameService.purgePlayer(playerId)
		}
	}

	onBuyCard (gameId: string, playerId: string) {
		const gameExists = GameService.gameExists(gameId)
		const playerExists = PlayerService.playerExists(playerId)

		if (gameExists && playerExists) {
			GameService.buyCard(playerId, gameId)
		}
	}

	onPutCard (gameId: string, playerId: string, cardIds: string[]) {
		const gameExists = GameService.gameExists(gameId)
		const playerExists = PlayerService.playerExists(playerId)

		if (gameExists && playerExists) {
			GameService.putCard(playerId, cardIds, gameId)
		}
	}

	onToggleReady (gameId: string, playerId: string) {
		const gameExists = GameService.gameExists(gameId)
		const playerExists = PlayerService.playerExists(playerId)

		if (gameExists && playerExists) {
			GameService.toggleReady(playerId, gameId)
		}
	}

	onSetPlayerData (playerId: string, playerName: string) {
		PlayerService.setPlayerData({
			id: playerId,
			name: playerName
		})
	}
}

export default new ListenerService()
