import { useState, useEffect } from "react"

type CardColors =
"yellow" |
"blue" |
"green" |
"red"

type CardTypes =
"0" |
"1" |
"2" |
"3" |
"4" |
"5" |
"6" |
"7" |
"8" |
"9" |
"block" |
"change-color" |
"buy-2" |
"buy-4" |
"reverse"

interface CardData {
	src: string
	name: string
	color: CardColors
	type: CardTypes
}

interface CardCollection {
	cards: {
		[key in CardTypes]?: {
			[key in CardColors]: CardData
		}
	}
}

interface PropTypes {
	preload: boolean
}

const useCards = (props: PropTypes) => {
	const { preload } = props

	const [cardCollection, setCardCollection] = useState<CardCollection>({ cards: {}} as CardCollection)
	const [loading, setLoading] = useState(preload)

	const cardTypes: CardTypes[] = [
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
		"buy-4",
		"change-color",
		"reverse"
	]

	const cardColors: CardColors[] = [
		"blue",
		"green",
		"red",
		"yellow"
	]

	const buildPictureSrc = async (
		cardType: CardTypes,
		cardColor: CardColors
	): Promise<string> => (
		(await import(`../assets/cards/${cardType}/${cardColor}.png`)).default
	)

	const loadCards = async () => {
		const loadedCards = {} as any

		/**
		 * Creates the default cardCollection object
		 */
		await Promise.all(
			cardTypes.map(async cardType => {
				loadedCards[cardType] = {}

				await Promise.all(
					cardColors.map(async cardColor => {
						const cardPictureSrc = await buildPictureSrc(cardType, cardColor)

						loadedCards[cardType][cardColor] = {
							src: cardPictureSrc,
							name: `${cardType}-${cardColor}`,
							color: cardColor,
							type: cardType
						}
					})
				)
			})
		)

		setCardCollection({ cards: loadedCards })

		if (preload) {
			/**
			 * Preload all pictures
			 */
			await Promise.all(
				cardTypes.map(async cardType => {
					await Promise.all(
						cardColors.map(async cardColor => {
							const cardPictureSrc = loadedCards[cardType][cardColor].src

							const cardPicture = new Image()

							cardPicture.src = cardPictureSrc

							return new Promise(resolve => cardPicture.onload = resolve)
						})
					)
				})
			)

			setLoading(false)
		}
	}

	// eslint-disable-next-line
	useEffect(() => { loadCards() }, [])

	return {
		...cardCollection,
		loading
	}
}

export default useCards
