import React, { useRef } from "react"
import { Container } from "@material-ui/core"
import { useDrop } from "react-dnd"

import { CardData } from "../../../protocols/Card"

import useStyles from "./styles"

interface Props {
	cards: CardData[]
	onDrop: (cardId: number) => void
}

const CardStack = (props: Props) => {
	const { cards, onDrop } = props

	const classes = useStyles()
	const cardStackRef = useRef()

	const [{ isHovering }, drop] = useDrop({
    accept: "DraggableCard",
		drop: (item: any) => onDrop(item.id),
		collect: monitor => ({
			isHovering: monitor.isOver()
		})
	})
	
	drop(cardStackRef)

	return (
		<Container
			disableGutters
			className={classes.cardContainer}
			maxWidth={false}
			innerRef={cardStackRef}
			style={{
				backgroundColor: isHovering ? "rgba(0, 0, 0, 0.2)" : "rgba(0, 0, 0, 0)"
			}}
		>
			{cards?.map((card, index) => (
				<img
					key={card.id}
					className={classes.card}
					alt={card.name}
					src={card.src}
					style={{
						transform: `rotate(${index}rad)`,
						zIndex: cards.length - index
					}}
				/>
			))}
		</Container>
	)
}

export default CardStack
