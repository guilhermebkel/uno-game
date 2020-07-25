import GameService from "@/Services/GameService"
import { Request, Response } from "express"

class GameController {
	async getGameList (req: Request, res: Response) {
		const games = GameService.getGameList()

		return res.status(200).json({ games })
	}
}

export default new GameController()
