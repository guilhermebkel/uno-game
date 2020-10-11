import api from "@/services/api"

import { CardData } from "@uno-game/protocols"

import { preloadImage } from "@/utils/image"

import Queue from "@/services/queue"

export const preloadCardPictures = async (): Promise<void> => {
	try {
		const { data } = await api.get("/cards")

		const cardList = data.cards as CardData[]

		const worker = async (card: CardData) => {
			await preloadImage(card.src)
		}

		const queue = new Queue(worker, {
			concurrency: 2,
			delay: 2000,
			retries: 3,
		})

		queue.addPayload(cardList)

		await queue.process()
	} catch (error) {
		console.log(error)
	}
}
