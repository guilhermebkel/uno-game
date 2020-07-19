import React, { useRef } from "react"
import { Container } from "@material-ui/core"
import { useDrop } from "react-dnd"

import { CardData } from "@shared/protocols/Card"

import { CARD_TYPE } from "@unoenty/pages/Table/CardDeck"

import useStyles from "@unoenty/pages/Table/CardStack/styles"

type Props = {
	cards: CardData[]
	onDrop: (cardId: string) => void
}

const CardStack = (props: Props) => {
	const { cards, onDrop } = props

	const classes = useStyles()
	const cardStackRef = useRef()

	const [{ isHovering }, drop] = useDrop({
    accept: CARD_TYPE,
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
				backgroundColor: isHovering ? "rgba(255, 255, 255, 0.7)" : "rgba(255, 255, 255, 0.1)"
			}}
		>
			{cards?.map((card, index) => (
				<img
					key={card.id}
					className={classes.card}
					alt={card.name}
					src={card.src}
					style={{
						transform: `rotate(${cards.length - index}rad)`,
						zIndex: cards.length - index,
						boxShadow: `0 0 25px ${(index === 0) ? "#000000" : "transparent"}`,
						filter: (index === 0) ? "saturate(1.5)" : "contrast(0.5)"
					}}
				/>
			))}
		</Container>
	)
}

export default CardStack
