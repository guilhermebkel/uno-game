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

type GetCardPosition = {
	Props: {
		cardWidth: number
		cardHeight: number
		cardIndex: number
		radius: number
		maxAngle: number
		expectedCardsCount: number
		cardsCount: number
	}
	Response: {
		x: number
		y: number
		inclination: number
	}
}

export const getCardPosition = (props: GetCardPosition["Props"]): GetCardPosition["Response"] => {
	const {
		cardHeight,
		cardWidth,
		cardIndex,
		cardsCount,
		expectedCardsCount,
		radius,
		maxAngle,
	} = props

	const maxRadAngle = ((Math.PI * maxAngle) / 180)

	let ratio = (((cardsCount * cardWidth) / (2 * Math.PI)) - cardHeight)

	if (ratio < 0) {
		ratio = 1
	}

	const angle = (maxRadAngle * (1 - (cardIndex / (cardsCount + 1))))

	const x = (ratio * Math.cos(angle)) * radius

	const y = (ratio * Math.sin(angle)) * radius

	const inclination = ((maxAngle / expectedCardsCount) * cardIndex)

	return {
		x,
		y,
		inclination,
	}
}
