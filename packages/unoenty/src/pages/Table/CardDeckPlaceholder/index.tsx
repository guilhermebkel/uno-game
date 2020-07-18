import React from "react"
import { Container } from "@material-ui/core"

import { CardData } from "@shared/protocols/Card"
import { PlayerData } from "@shared/protocols/Player"

import useStyles from "@unoenty/pages/Table/CardDeck/styles"

import cardPlaceholder from "@unoenty/assets/card_placeholder.png"

interface CardDeckPlaceholderProps {
	cards: CardData[]
	player: PlayerData
}

const CardDeckPlaceholder = (props: CardDeckPlaceholderProps) => {
	const { cards, player } = props

	const classes = useStyles()

	return (
		<Container
			disableGutters
			className={classes.cardContainer}
			maxWidth={false}
			style={{
				width: (cards?.length * 25) + 75,
				pointerEvents: "none"
			}}
		>
			{cards?.map((card, index) => (
				<img
					key={card.name}
					className={classes.card}
					alt="card-placeholder"
					src={cardPlaceholder}
					style={{
						zIndex: index,
						left: index * 25,
						filter: player?.isCurrentRoundPlayer ? "none" : "grayscale(1)",
						pointerEvents: "none"
					}}
				/>
			))}
		</Container>
	)
}

export default CardDeckPlaceholder
