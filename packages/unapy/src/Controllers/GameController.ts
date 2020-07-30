import GameService from "@/Services/GameService"
import { Request, Response } from "express"

class GameController {
	async getGameList (req: Request, res: Response) {
		const games = GameService.getGameList()

		const gameList = games.map(game => ({
			id: game.id,
			title: game.title,
			status: game.status,
			players: game.players.map(player => ({ name: player.name }))
		}))

		return res.status(200).json({
			games: gameList
		})
	}
}

export default new GameController()
