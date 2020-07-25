import api from "@/services/api"

import { CardData } from "@uno-game/protocols"

export const preloadCardPictures = async () => {
	try {
		const { data } = await api.get("/cards")

		const cardList = data.cards as CardData[]

		cardList.forEach(card => {
			const picture = new Image()

			picture.src = card.src
		})
	} catch (error) {
		console.log(error)
	}
}
