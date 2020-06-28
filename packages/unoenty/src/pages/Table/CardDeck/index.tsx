import React from "react"
import { Container } from "@material-ui/core"

import { CardData, Player } from "../../../hooks/useCards"

import useStyles from "./styles"

interface Props {
	cards: CardData[]
	player: Player
	position: "bottom"
}

const CardStack = (props: Props) => {
	const { cards } = props

	const getCardInclination = (index: number) => {
		const isMiddleCard = Math.round(cards.length / 2) === index
		const isBeforeMiddleCard = index < Math.round(cards.length / 2)

		let inclination: number

		if (isMiddleCard) {
			inclination = 0
		} else if (isBeforeMiddleCard) {
			inclination = - Math.abs(index - Math.round(cards.length / 2))
		} else {
			inclination = Math.abs(Math.round(cards.length / 2) - index)
		}

		return inclination * 4
	}

	const getCardElevation = (index: number) => {
		const isMiddleCard = Math.round(cards.length / 2) === index

		let elevation: number

		if (isMiddleCard) {
			elevation = 0
		} else {
			elevation = - Math.abs(index - Math.round(cards.length / 2))
		}

		return elevation * 7
	}

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
					draggable="true"
					style={{
						transform: `rotate(${getCardInclination(index)}deg)`,
						zIndex: index,
						left: index * 50,
						bottom: getCardElevation(index)
					}}
				/>
			))}
		</Container>
	)
}

export default CardStack
