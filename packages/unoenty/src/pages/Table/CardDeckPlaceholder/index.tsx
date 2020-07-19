import React from "react"
import { Container, Chip } from "@material-ui/core"

import { CardData } from "@shared/protocols/Card"
import { PlayerData } from "@shared/protocols/Player"

import useStyles from "@unoenty/pages/Table/CardDeckPlaceholder/styles"

import cardPlaceholder from "@unoenty/assets/card_placeholder.png"

type CardDeckPlaceholderProps = {
	cards: CardData[]
	player: PlayerData
	transform?: string
}

const CardDeckPlaceholder = (props: CardDeckPlaceholderProps) => {
	const { cards, player, transform } = props

	const classes = useStyles()

	return (
		<Container
			disableGutters
			className={classes.cardContainer}
			maxWidth={false}
			style={{ width: (cards?.length * 25) + 75	}}
		>
			{player?.name && (
				<Chip
					label={player?.name}
					className={classes.cardChip}
					style={{ backgroundColor: player?.isCurrentRoundPlayer ? "#FFE600" : "#E0E0E0" }}
				/>
			)}

			<Container
			disableGutters
			className={classes.cardContainer}
			maxWidth={false}
			style={{ transform }}
		>
			
			{cards?.map((card, index) => (
				<img
					key={card.id}
					className={classes.card}
					alt="card-placeholder"
					src={cardPlaceholder}
					style={{
						zIndex: index,
						left: index * 25,
						filter: player?.isCurrentRoundPlayer ? "none" : "grayscale(1)"
					}}
				/>
			))}
		</Container>
		</Container>
	)
}

export default CardDeckPlaceholder
