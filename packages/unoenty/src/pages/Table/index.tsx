import React, { useEffect } from "react"
import { Grid } from "@material-ui/core"

import useCards from "../../hooks/useCards"

import CardStack from "./CardStack"
import CardDeck from "./CardDeck"

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
				<Grid container spacing={2} justify="center" style={{ width: "100%", height: "100%" }}>
					<Grid item xs={12} md={12} lg={12} xl={12}>
						<button onClick={putRandomCard}>PUT CARD</button>
						<button onClick={buyRandomCard}>BUY CARD</button>
					</Grid>
					<Grid item xs={12} md={12} lg={12} xl={12}>
						<CardStack
							cards={usedCards}
						/>
						<CardDeck
							cards={decks[0]?.handCards || []}
							player={decks[0]}
							position="bottom"
						/>
					</Grid>
				</Grid>
			)}
		</>
	)
}

export default Table
