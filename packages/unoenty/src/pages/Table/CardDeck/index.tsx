import React, { useRef } from "react"
import { Container } from "@material-ui/core"
import { useDrag } from "react-dnd"
import { getEmptyImage } from "react-dnd-html5-backend"

import useDidMount from "@unoenty/hooks/useDidMount"

import { CardData } from "@shared/protocols/Card"
import { PlayerData } from "@shared/protocols/Player"

import useStyles from "@unoenty/pages/Table/CardDeck/styles"

export const CARD_TYPE = "DraggableCard"

type CardProps = {
	card: CardData
	index: number
	style: object
	className: string
}

const DraggableCard = (props: CardProps) => {
	const { card, index, style, className } = props

	const draggableCardRef = useRef(null)

  const [{ isDragging }, drag, preview] = useDrag({
    item: {
			type: CARD_TYPE,
			id: card.id,
			index,
			src: card.src,
			name: card.name,
			className
		},
    collect: monitor => ({
      isDragging: monitor.isDragging()
		}),
		canDrag: card.canBeUsed
  })

	drag(draggableCardRef)

	useDidMount(() => {
		preview(getEmptyImage(), { captureDraggingState: true })
	})

  return (
		<img
			ref={draggableCardRef}
			key={card.name}
			className={className}
			alt={card.name}
			src={card.src}
			style={{
				...style,
				opacity: isDragging ? 0 : 1,
				filter: !card.canBeUsed ? "grayscale(1)" : "",
				pointerEvents: card.canBeUsed ? "all" : "none"
			}}
		/>
  )
}

type CardDeckProps = {
	cards: CardData[]
	player: PlayerData
}

const CardDeck = (props: CardDeckProps) => {
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
			maxWidth={false}
			style={{
				width: (cards?.length * 50) + 50
			}}
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
				/>
			))}
		</Container>
	)
}

export default CardDeck
