import React, { useRef } from "react"
import { Container } from "@material-ui/core"
import { useDrag } from "react-dnd"

import { CardData } from "../../../protocols/Card"
import { Player } from "../../../protocols/Player"

import useStyles from "./styles"

import cardPlaceholder from "../../../assets/card_placeholder.png"

interface CardProps {
	card: CardData
	index: number
	style: object
	className: string
	hideCard?: boolean
}

const DraggableCard = (props: CardProps) => {
	const { card, index, style, className, hideCard } = props

	const draggableCardRef = useRef(null)

  const [{ isDragging }, drag] = useDrag({
    item: { type: "DraggableCard", id: card.id, index },
    collect: monitor => ({
      isDragging: monitor.isDragging()
		}),
		canDrag: card.canBeUsed
  })
 
  drag(draggableCardRef)

  return (
		<img
			ref={draggableCardRef}
			key={card.name}
			className={className}
			alt={card.name}
			src={hideCard ? cardPlaceholder : card.src}
			style={{
				...style,
				opacity: isDragging ? 0 : 1,
				filter: !card.canBeUsed ? "grayscale(1)" : ""
			}}
		/>
  )
}

interface CardDeckProps {
	cards: CardData[]
	player: Player
	hideCards?: boolean
}

const CardStack = (props: CardDeckProps) => {
	const { cards, hideCards } = props

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
			maxWidth={false}
		>
			{cards?.map((card, index) => (
				<DraggableCard
					key={card.id}
					card={card}
					className={classes.card}
					index={index}
					style={{
						transform: `rotate(${getCardInclination(index)}deg)`,
						zIndex: index,
						left: index * 50,
						bottom: getCardElevation(index)
					}}
					hideCard={hideCards}
				/>
			))}
		</Container>
	)
}

export default CardStack
