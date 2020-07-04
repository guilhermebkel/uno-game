import React, { useRef } from "react"
import { Container } from "@material-ui/core"
import { useDrop } from "react-dnd"

import { CardData } from "../../../hooks/useCards"

import useStyles from "./styles"

interface Props {
	cards: CardData[]
	onDrop: (cardId: number) => void
}

const CardStack = (props: Props) => {
	const { cards, onDrop } = props

	const classes = useStyles()
	const cardStackRef = useRef()

	const [, drop] = useDrop({
    accept: "DraggableCard",
		drop: (item: any) => onDrop(item.id)
	})
	
	drop(cardStackRef)

	return (
		<Container
			disableGutters
			className={classes.cardContainer}
			maxWidth={false}
			innerRef={cardStackRef}
		>
			{cards.map((card, index) => (
				<img
					key={card.name}
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
