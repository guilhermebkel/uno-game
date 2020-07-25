import React from "react"
import { Container, Chip } from "@material-ui/core"

import { CardData, PlayerData } from "@uno-game/protocols"

import useStyles from "@/pages/Table/CardDeckPlaceholder/styles"

import cardPlaceholder from "@/assets/card_placeholder.png"

import Device from "@/utils/device"

const CARD_WIDTH = Device.isMobile ? 15 : 25

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
			style={{ width: (cards?.length * CARD_WIDTH) + CARD_WIDTH	}}
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
						left: index * CARD_WIDTH,
						filter: player?.isCurrentRoundPlayer ? "none" : "grayscale(1)"
					}}
				/>
			))}
		</Container>
		</Container>
	)
}

export default CardDeckPlaceholder
