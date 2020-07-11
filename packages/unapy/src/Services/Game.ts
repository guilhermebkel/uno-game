import uuid from "uuid"

import CardService from "@unapy/Services/Card"

import { Game } from "@unapy/Protocols/Game"
import { PlayerData } from "@unapy/Protocols/Player"

class GameService {
	games: Game[]

	setupGame (playerId: number) {
		const cards = CardService.setupInitialCards()
		const gameId = uuid.v4()

		const initialPlayer: PlayerData = {
			id: playerId,
			name: "player",
			handCards: [],
			usedCards: []
		}

		const game: Game = {
			id: gameId,
			title: "test",
			availableCards: [],
			usedCards: [],
			players: [initialPlayer],
			cards
		}

		this.games.push(game)
	}
}

export default new GameService()
