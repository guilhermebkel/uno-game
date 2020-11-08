import { GameHistory } from "@uno-game/protocols"

import GameService from "@/Services/GameService"

import GameHistoryRepository from "@/Repositories/GameHistoryRepository"

class GameHistoryService {
	retrieveGameHistory (playerId: string): GameHistory[] {
		const gameHistory = this.consolidateGameHistory(playerId)

		return gameHistory
	}

	private consolidateGameHistory (playerId: string): GameHistory[] {
		const gameHistory = GameHistoryRepository.getGameHistory(playerId) || []

		const consolidatedGameHistory: GameHistory[] = []

		const games = GameService.getGameList()

		gameHistory
			.forEach(history => {
				const game = games.find(game => game.id === history.gameId)

				if (game) {
					consolidatedGameHistory.push({
						createdAt: game.createdAt,
						gameId: game.id,
						name: game.title,
						playersCount: game.players.length,
						status: game.status,
					})
				}
			})

		games
			.filter(game => game.players.some(player => player.id === playerId))
			.filter(game => !consolidatedGameHistory.some(history => history.gameId === game.id))
			.forEach(game => {
				consolidatedGameHistory.push({
					createdAt: game.createdAt,
					gameId: game.id,
					name: game.title,
					playersCount: game.players.length,
					status: game.status,
				})
			})

		GameHistoryRepository.setGameHistory(playerId, consolidatedGameHistory)

		return consolidatedGameHistory
	}
}

export default new GameHistoryService()
