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

export interface CardData {
	id: number
	src: string
	name: string
	color: CardColors
	type: CardTypes
}

interface Player {
	id: number
	name: string
}

interface PlayerData extends Player {
	handCards: CardData[]
	usedCards: CardData[]
}

interface PropTypes {
	preloadCardPictures: boolean
	players: Player[]
}

const useCards = (props: PropTypes) => {
	const { preloadCardPictures, players } = props

	const [decks, setDecks] = useState<PlayerData[]>([])

	const [availableCards, setAvailableCards] = useState<CardData[]>([])
	const [usedCards, setUsedCards] = useState<CardData[]>([])

	const [cards, setCards] = useState<CardData[]>([])
	const [preloadingCardPictures, setPreloadingCardPictures] = useState(preloadCardPictures)

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

	const commitPlay = (type: "buy" | "put", playerId: number, cardId?: number) => {
		if (availableCards.length <= 0) {
			return
		}

		if (type === "buy") {
			const available = [...availableCards]

			const card = available.shift()

			if (card) {
				setDecks(lastDecks => lastDecks.map(deck => {
					if (deck.id === playerId) {
						return {
							...deck,
							handCards: [card, ...deck.handCards]
						}
					} else {
						return deck
					}
				}))
			}

			setAvailableCards(available)
		} else if (type === "put") {
			const currentPlayerDeck = decks.find(deck => deck.id === playerId)

			if (currentPlayerDeck) {
				const card = currentPlayerDeck.handCards.find(card => card.id === cardId)

				if (card) {
					setUsedCards(lastUsedCards => [card, ...lastUsedCards])

					setDecks(lastDecks => lastDecks.map(deck => {
						if (deck.id === playerId) {
							return {
								...deck,
								handCards: deck.handCards.filter(card => card.id !== cardId),
								usedCards: [card, ...deck.usedCards]
							}
						} else {
							return deck
						}
					}))
				}
			}
		}
	}

	const buildPictureSrc = async (
		cardType: CardTypes,
		cardColor: CardColors
	): Promise<string> => (
		(await import(`../assets/cards/${cardType}/${cardColor}.png`)).default
	)

	const buildId = () => Math.round(Math.random() * 1000)

	const getCard = (type: CardTypes, color: CardColors): CardData => {
		const card = cards.find(card => card.type === type && card.color === color)

		if (card) {
			return card
		} else {
			return {
				id: null as any,
				src: null as any,
				name: null as any,
				color: null as any,
				type: null as any
			}
		}
	}

	const loadCards = async () => {
		const loadedCards: CardData[] = []

		/**
		 * Creates the default cardCollection array
		 */
		await Promise.all(
			cardTypes.map(async cardType => {
				await Promise.all(
					cardColors.map(async cardColor => {
						const cardPictureSrc = await buildPictureSrc(cardType, cardColor)

						loadedCards.push({
							id: buildId(),
							src: cardPictureSrc,
							name: `${cardType}-${cardColor}`,
							color: cardColor,
							type: cardType
						})
					})
				)
			})
		)

		setCards(loadedCards)

		if (preloadCardPictures) {
			/**
			 * Preload all pictures
			 */
			await Promise.all(
				cardTypes.map(async cardType => {
					await Promise.all(
						cardColors.map(async cardColor => {
							const card = loadedCards.find(card => card.type === cardType && card.color === cardColor)

							const cardPictureSrc = card?.src || ""

							const cardPicture = new Image()

							cardPicture.src = cardPictureSrc

							return new Promise(resolve => cardPicture.onload = resolve)
						})
					)
				})
			)

			setPreloadingCardPictures(false)
		}

		return loadedCards
	}

	const loadDecks = (loadedCards: CardData[]) => {
		const allCards: CardData[] = [...loadedCards]

		const loadedDecks: PlayerData[] = players.map(player => {
			const deckCards: CardData[] = []

			const array = [1, 2, 3, 4, 5, 6, 7]
			
			array.forEach(() => {
				const selectedCard = allCards.shift()

				deckCards.push(selectedCard as CardData)
			})

			return {
				id: player.id,
				name: player.name,
				handCards: deckCards,
				usedCards: []
			}
		})
console.log(loadedDecks)
		setDecks(loadedDecks)
		setAvailableCards(allCards)
	}

	const setup = async () => {
		const loadedCards = await loadCards()
		loadDecks(loadedCards)
	}

	// eslint-disable-next-line
	useEffect(() => { setup() }, [])

	return {
		cards,
		getCard,
		commitPlay,
		decks,
		availableCards,
		usedCards,
		preloadingCardPictures
	}
}

export default useCards
