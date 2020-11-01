import { GameHistory } from "@uno-game/protocols"

import GameService from "@/Services/GameService"

import GameHistoryRepository from "@/Repositories/GameHistoryRepository"

class GameHistoryService {
	retrieveGameHistory (playerId: string): GameHistory[] {
		const gameHistory = this.consolidateGameHistory(playerId)

		return gameHistory
	}

	private consolidateGameHistory (playerId: string): GameHistory[] {
		const gameHistory = GameHistoryRepository.getGameHistory(playerId)

		let consolidatedGameHistory: GameHistory[] = [
			...(gameHistory || []),
		]

		const games = GameService.getGameList()

		consolidatedGameHistory = games.map(game => {
			const history = gameHistory?.find(historyItem => historyItem.gameId === game.id)

			const data: GameHistory = {
				createdAt: game.createdAt,
				gameId: game.id,
				name: game.title,
				playersCount: game.players.length,
				status: game.status,
			}

			if (history) {
				return {
					...history,
					...data,
				}
			} else {
				return data
			}
		})

		GameHistoryRepository.setGameHistory(playerId, consolidatedGameHistory)

		return consolidatedGameHistory
	}
}

export default new GameHistoryService()
