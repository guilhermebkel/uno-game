import CardService from "@/Services/CardService"
import { Request, Response } from "express"

class CardController {
	async getCardList (req: Request, res: Response) {
		const cards = CardService.setupRandomCards()

		return res.status(200).json({ cards })
	}
}

export default new CardController()
