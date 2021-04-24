import CardService from "@/Services/CardService"
import { Request, Response } from "express"

class CardController {
	async getCardList (req: Request, res: Response) {
		const cards = await CardService.getCardStack()

		const cardList = cards.map(card => ({ src: card.src }))

		return res.status(200).json({
			cards: cardList,
		})
	}
}

export default new CardController()
