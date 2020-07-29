import React, { useRef } from "react"
import { Container } from "@material-ui/core"
import { useDrag, useDragLayer } from "react-dnd"
import { getEmptyImage } from "react-dnd-html5-backend"

import useDidMount from "@/hooks/useDidMount"
import { useCardStore } from "@/store/Card"

import { PlayerData, CardData, CardTypes } from "@uno-game/protocols"

import useStyles from "@/pages/Table/CardDeck/styles"

import Device from "@/utils/device"

export const CARD_TYPE = "DraggableCard"
const CARD_WIDTH = Device.isMobile ? 20 : 40

type CardProps = {
	card: CardData
	index: number
	style: object
	className: string
	onClick: () => void
	selected: boolean
	isDraggingAnyCard: boolean
	onDragEnd: () => void
	canBePartOfCurrentCombo: boolean
	isMoreThanOneCardBeingDragged: boolean
}

const DraggableCard = (props: CardProps) => {
	const {
		card,
		index,
		style,
		className,
		onClick,
		selected,
		isDraggingAnyCard,
		onDragEnd,
		canBePartOfCurrentCombo,
		isMoreThanOneCardBeingDragged
	} = props

	const draggableCardRef = useRef(null)

	const canCardBeUsed = canBePartOfCurrentCombo || card.canBeUsed

  const [{ isDragging }, drag, preview] = useDrag({
    item: {
			type: CARD_TYPE,
			id: card.id,
			index,
			src: card.src,
			name: card.name,
			cardType: card.type,
			selected,
			className
		},
    collect: monitor => ({
      isDragging: monitor.isDragging()
		}),
		canDrag: canCardBeUsed,
		end: onDragEnd
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
				opacity: (isDragging || (isDraggingAnyCard && isMoreThanOneCardBeingDragged && selected)) ? 0 : 1,
				filter: !canCardBeUsed ? "brightness(0.5)" : "saturate(1.5)",
				pointerEvents: canCardBeUsed ? "all" : "none",
				...(selected ? {
					border: "5px solid #EC0000",
					borderRadius: "16px"
				} : {})
			}}
			onClick={onClick}
		/>
  )
}

type CardDeckProps = {
	cards: CardData[]
	player: PlayerData
}

const CardDeck = (props: CardDeckProps) => {
	const { cards } = props

	const {
    isDraggingAnyCard
  } = useDragLayer((monitor) => ({
    isDraggingAnyCard: monitor.isDragging()
	}))
	
	const cardStore = useCardStore()

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

	const onDragEnd = () => {
		cardStore?.setSelectedCards([])
	}

	const isCardSelected = (cardId: string) => !!cardStore?.selectedCards?.some(card => card.id === cardId)

	const canBePartOfCurrentCombo = (cardType: CardTypes) => !!cardStore?.selectedCards?.some(card => card.type === cardType)

	const toggleSelectedCard = (cardId: string) => {
		cardStore?.setSelectedCards(lastState => {
			const selectedCard = cards.find(card => card.id === cardId)

			const selectedCardTypes = lastState?.map(card => card.type)
	
			const isAlreadySelected = isCardSelected(cardId)
	
			if (isAlreadySelected) {
				const cardsWithoutAlreadySelected = lastState?.filter(card => card.id !== cardId)
				cardStore.setSelectedCards(cardsWithoutAlreadySelected)
			} else if ((selectedCard && selectedCardTypes?.includes(selectedCard.type)) || !selectedCardTypes?.length) {
				cardStore.setSelectedCards([
					...(lastState || []) as any,
					selectedCard
				])
			} else {
				return (lastState || []) as any
			}
		})
	}

	return (
		<Container
			disableGutters
			className={classes.cardContainer}
			maxWidth={false}
			style={{
				width: (cards?.length * CARD_WIDTH) + CARD_WIDTH
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
						zIndex: (index + 2),
						left: index * CARD_WIDTH,
						bottom: getCardElevation(index)
					}}
					onClick={() => toggleSelectedCard(card.id)}
					selected={isCardSelected(card.id)}
					isDraggingAnyCard={isDraggingAnyCard}
					isMoreThanOneCardBeingDragged={cardStore?.selectedCards?.length > 1}
					onDragEnd={onDragEnd}
					canBePartOfCurrentCombo={canBePartOfCurrentCombo(card.type)}
				/>
			))}
		</Container>
	)
}

export default CardDeck
