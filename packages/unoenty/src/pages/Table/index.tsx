import React, { useEffect } from "react"

import useCards from "../../hooks/useCards"

import CardStack from "./CardStack"

const Table = () => {
	const {
		preloadingCardPictures,
		availableCards,
		usedCards,
		decks,
		commitPlay
	} = useCards({
		preloadCardPictures: true,
		players: [{
			id: 1,
			name: "mota"
		}]
	})

	const putRandomCard = () => {
		const [deck] = decks

		if (deck) {
			const [card] = deck.handCards

			if (card) {
				commitPlay("put", deck.id, card.id)
			}
		}
	}

	const buyRandomCard = () => {
		const [deck] = decks

		if (deck) {
			commitPlay("buy", deck.id)
		}
	}

	useEffect(() => {
		console.log(availableCards, usedCards)
	}, [availableCards, usedCards])

	return (
		<>
			{preloadingCardPictures ? (
				<h1>Preloading Card Pictures...</h1>
			) : (
				<>
					<button onClick={putRandomCard}>PUT CARD</button>
					<button onClick={buyRandomCard}>BUY CARD</button>
					<h1>Table</h1>
					<CardStack
						cards={usedCards}
					/>
				</>
			)}
		</>
	)
}

export default Table
