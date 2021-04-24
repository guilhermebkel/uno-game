import uuid from "uuid"

import ArrayUtil from "@/Utils/ArrayUtil"

import { CardData, CardTypes, CardColors } from "@uno-game/protocols"

import staticFilesConfig from "@/Config/static-files"

class CardService {
	private readonly cardTypes: CardTypes[] = [
		"0",
		"1",
		"2",
		"3",
		"4",
		"5",
		"6",
		"7",
		"8",
		"9",
		"block",
		"buy-2",
		"reverse",
	]

	private readonly cardColors: CardColors[] = [
		"blue",
		"green",
		"red",
		"yellow",
	]

	async setupRandomCards (): Promise<CardData[]> {
		const randomCards: CardData[] = [
			...await this.getCardStack(),
			...await this.getCardStack(),
		]

		ArrayUtil.shuffle(randomCards)

		return randomCards
	}

	async retrieveRandomCardColor (): Promise<CardColors> {
		const cardColors: Array<CardColors> = [
			"blue",
			"green",
			"yellow",
			"red",
		]

		ArrayUtil.shuffle(cardColors)

		return cardColors[0]
	}

	async getCardStack (): Promise<CardData[]> {
		const cardStack: CardData[] = []

		this.cardTypes.map(cardType => {
			this.cardColors.map(cardColor => {
				const cardPictureSrc = this.buildCardPictureSrc(cardType, cardColor)
				const cardId = uuid.v4()

				cardStack.push({
					id: cardId,
					src: cardPictureSrc,
					name: `${cardType}-${cardColor}`,
					color: cardColor,
					type: cardType,
				})
			})
		})

		for (let i = 0; i < 2; i++) {
			const blackCardPictureSrc = this.buildCardPictureSrc("buy-4", "black")
			const redCardPictureSrc = this.buildCardPictureSrc("buy-4", "red")
			const blueCardPictureSrc = this.buildCardPictureSrc("buy-4", "blue")
			const yellowCardPictureSrc = this.buildCardPictureSrc("buy-4", "yellow")
			const greenCardPictureSrc = this.buildCardPictureSrc("buy-4", "green")

			const cardId = uuid.v4()

			cardStack.push({
				id: cardId,
				src: blackCardPictureSrc,
				name: "buy-4",
				color: "black",
				type: "buy-4",
				selectedColor: null,
				possibleColors: {
					red: redCardPictureSrc,
					blue: blueCardPictureSrc,
					yellow: yellowCardPictureSrc,
					green: greenCardPictureSrc,
					black: blackCardPictureSrc,
				},
			})
		}

		for (let i = 0; i < 2; i++) {
			const blackCardPictureSrc = this.buildCardPictureSrc("change-color", "black")
			const redCardPictureSrc = this.buildCardPictureSrc("change-color", "red")
			const blueCardPictureSrc = this.buildCardPictureSrc("change-color", "blue")
			const yellowCardPictureSrc = this.buildCardPictureSrc("change-color", "yellow")
			const greenCardPictureSrc = this.buildCardPictureSrc("change-color", "green")

			const cardId = uuid.v4()

			cardStack.push({
				id: cardId,
				src: blackCardPictureSrc,
				name: "change-color",
				color: "black",
				type: "change-color",
				selectedColor: null,
				possibleColors: {
					red: redCardPictureSrc,
					blue: blueCardPictureSrc,
					yellow: yellowCardPictureSrc,
					green: greenCardPictureSrc,
					black: blackCardPictureSrc,
				},
			})
		}

		return cardStack
	}

	private buildCardPictureSrc (cardType: CardTypes, cardColor: CardColors) {
		const baseUrl = staticFilesConfig.staticFilesBaseUrl

		const picturePath = `cards/${cardType}/${cardColor}.svg`

		return `${baseUrl}/${picturePath}`
	}
}

export default new CardService()
