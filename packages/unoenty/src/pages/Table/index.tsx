import React from "react"
import { Grid, Button } from "@material-ui/core"
import { DndProvider } from "react-dnd"
import { HTML5Backend } from "react-dnd-html5-backend"
import { TouchBackend } from "react-dnd-touch-backend"

import useCards from "../../hooks/useCards"

import { DeviceUtil } from "../../utils/Device"

import CardStack from "./CardStack"
import CardDeck from "./CardDeck"

const Table = () => {
	const {
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

	const buyRandomCard = () => {
		const [deck] = decks

		if (deck) {
			commitPlay("buy", deck.id)
		}
	}

	const onDrop = (cardId: number) => {
		const [deck] = decks
	
		if (deck) {
			commitPlay("put", deck.id, cardId)
		}
	}

	return (
		<DndProvider
			backend={DeviceUtil.isTouchDevice ? (
				TouchBackend
			) : (
				HTML5Backend
			)}
		>
			<Grid container>
				<Grid container>
					<Grid item xs={1}></Grid>
					<Grid item xs={10}>
						<Grid container justify="center" alignItems="center" style={{ backgroundColor: "blue" }}>
							
						</Grid>
					</Grid>
					<Grid item xs={1}></Grid>
				</Grid>
				<Grid container>
					<Grid item xs={1}>
						<Grid container justify="center" alignItems="center" style={{ backgroundColor: "red" }}>

						</Grid>
					</Grid>
					<Grid item xs={10}>
						<Grid container justify="center" alignItems="center" style={{ height: "100%" }}>
							<CardStack
								cards={usedCards}
								onDrop={onDrop}
							/>
						</Grid>
					</Grid>
					<Grid item xs={1}>
						<Grid container justify="center" alignItems="center" style={{ backgroundColor: "yellow" }}>
							<Button color="primary" variant="contained" onClick={buyRandomCard}>BUY CARD</Button>
						</Grid>
					</Grid>
				</Grid>
				<Grid container>
					<Grid item xs={1}></Grid>
					<Grid item xs={10}>
						<Grid container justify="center" alignItems="center" style={{ backgroundColor: "black" }}>
							<CardDeck
								cards={decks[0]?.handCards || []}
								player={decks[0]}
							/>
						</Grid>
					</Grid>
					<Grid item xs={1}></Grid>
				</Grid>
			</Grid>
		</DndProvider>
	)
}

export default Table
