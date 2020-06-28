import React from "react"
import { Container } from "@material-ui/core"

import { CardData } from "../../../hooks/useCards"

import useStyles from "./styles"

interface Props {
	cards: CardData[]
}

const CardStack = (props: Props) => {
	const { cards } = props

	console.log(cards)

	const classes = useStyles()

	return (
		<Container
			disableGutters
			className={classes.cardContainer}
		>
			{cards.map((card, index) => (
				<img
					className={classes.card}
					alt={card.name}
					src={card.src}
					style={{
						transform: `rotate(${card.id}rad)`,
						zIndex: cards.length - index
					}}
				/>
			))}
		</Container>
	)
}

export default CardStack
