import React, { useRef } from "react"
import { useParams } from "react-router-dom"
import { Container, ClickAwayListener, Button } from "@material-ui/core"
import { useDrag, useDragLayer } from "react-dnd"
import { getEmptyImage } from "react-dnd-html5-backend"

import useDidMount from "@/hooks/useDidMount"
import { useCardStore } from "@/store/Card"
import { useSocketStore } from "@/store/Socket"
import useSocket from "@/hooks/useSocket"

import { Alert } from "@/components"

import { PlayerData, CardData, CardTypes } from "@uno-game/protocols"

import useStyles from "@/pages/Table/CardDeck/styles"

import Device from "@/utils/device"

export const CARD_TYPE = "DraggableCard"
const CARD_WIDTH = Device.isMobile ? 20 : 40

export type DraggedCardItem = {
	type: "DraggableCard"
	id: string
	index: number
	src: string
	name: string
	cardType: CardTypes
	selected: boolean
	className: string
}

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
		} as DraggedCardItem,
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
					border: `${Device.isMobile ? "3px" : "5px"} solid #EC0000`,
					borderRadius: Device.isMobile ? "8px" : "16px"
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

	const { gameId } = useParams()

	const {
		isDraggingAnyCard
	} = useDragLayer((monitor) => ({
		isDraggingAnyCard: monitor.isDragging()
	}))

	const cardStore = useCardStore()
	const socketStore = useSocketStore()
	const socket = useSocket()

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

		const delta = 4

		return inclination * delta
	}

	const getCardElevation = (index: number) => {
		const isMiddleCard = Math.round(cards.length / 2) === index

		let elevation: number

		if (isMiddleCard) {
			elevation = 0
		} else {
			elevation = - Math.abs(index - Math.round(cards.length / 2))
		}

		const delta = Device.isMobile ? 3 : 7

		return elevation * delta
	}

	const classes = useStyles()

	const onDragEnd = () => {
		cardStore?.setSelectedCards([])
	}

	const isCardSelected = (cardId: string) => !!cardStore?.selectedCards?.some(card => card.id === cardId)

	const canBePartOfCurrentCombo = (cardType: CardTypes) => !!cardStore?.selectedCards?.some(card => card.type === cardType)

	const toggleSelectedCard = (cardId: string) => {
		const lastSelectedCards = cardStore.selectedCards
		const selectedCard = cards.find(card => card.id === cardId)
		const cardOnTopOfCardStack = socketStore?.game!.usedCards[0]
		const selectedCardTypes = lastSelectedCards?.map(card => card.type)

		const isAlreadySelected = isCardSelected(cardId)

		if (isAlreadySelected) {
			const cardsWithoutAlreadySelected = lastSelectedCards?.filter(card => card.id !== cardId)

			if (cardOnTopOfCardStack.color === selectedCard?.color) {
				if (cardsWithoutAlreadySelected.find(card => card.type === cardOnTopOfCardStack.type || card.color === cardOnTopOfCardStack.color)) {
					cardStore.setSelectedCards(cardsWithoutAlreadySelected)
				} else {
					cardStore.setSelectedCards([])
				}
			} else {
				cardStore.setSelectedCards(cardsWithoutAlreadySelected)
			}
			
		} else if ((selectedCard && selectedCardTypes?.includes(selectedCard.type)) || !selectedCardTypes?.length) {
			cardStore.setSelectedCards([
				...(lastSelectedCards || []) as any,
				selectedCard
			])
		}
	}

	const unselectAllCards = () => {
		cardStore?.setSelectedCards([])
	}

	const handleClickOutsideCardDeck = () => {
		if (cardStore.selectedCards.length > 0) {
			unselectAllCards()
		}
	}

	const toggleOnlineStatus = () => {
		socket.toggleOnlineStatus(gameId)

		Alert.close()
	}

	const handlePlayerGotAwayFromKeyboard = (playerId: string) => {
		if (socket?.currentPlayer?.id === playerId) {
			Alert.warning({
				message: "Are you still playing this game? We'll make auto plays for you till you click on the button below.",
				title: "Are you there?",
				onClose: toggleOnlineStatus,
				closable: false,
				customButtons: [
					<Button
						fullWidth
						color="primary"
						variant="contained"
						onClick={toggleOnlineStatus}
					>
						I'M HERE
					</Button>
				]
			})
		}
	}

	const onPlayerGotAwayFromKeyboard = () => {
		socket.onPlayerGotAwayFromKeyboard(playerId => handlePlayerGotAwayFromKeyboard(playerId))
	}

	const setupDeck = () => {
		onPlayerGotAwayFromKeyboard()
	}

	const onReconnect = () => {
		socket.onReconnect(() => setupDeck())
	}

	useDidMount(() => {
		setupDeck()
		onReconnect()
	})

	return (
		<ClickAwayListener
			onClickAway={handleClickOutsideCardDeck}
		>
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
							bottom: getCardElevation(index),
							zIndex: (index + 2),
							left: index * CARD_WIDTH
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
		</ClickAwayListener>
	)
}

export default CardDeck
