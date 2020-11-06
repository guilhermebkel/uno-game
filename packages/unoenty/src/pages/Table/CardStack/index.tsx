import React, { useRef, useState } from "react"
import { Container, Menu, Grid } from "@material-ui/core"
import { useDrop } from "react-dnd"

import { CardData, CardTypes, CardColors, Game } from "@uno-game/protocols"

import useSocket from "@/hooks/useSocket"
import useDidMount from "@/hooks/useDidMount"

import { CARD_TYPE, DraggedCardItem } from "@/pages/Table/CardDeck"

import useStyles from "@/pages/Table/CardStack/styles"

import { useCardStore } from "@/store/Card"

import ChooseColorModal from "@/pages/Table/ChooseColorModal"

import arrowCircle from "@/assets/arrow_circle.png"

type CardStackProps = {
	cards: CardData[]
	game: Game
	onDrop: (cardIds: string[], selectedColor: CardColors) => void
}

const CardStack: React.FC<CardStackProps> = (props) => {
	const [cardStackStateMessage, setCardStackStateMessage] = useState<string>("")

	const socket = useSocket()

	const cardStore = useCardStore()

	const { cards, onDrop, game } = props

	const classes = useStyles()
	const cardStackRef = useRef()

	const handleDrop = async (card: DraggedCardItem) => {
		let selectedColor = "" as CardColors

		const isColorEffectCard = (cardType: CardTypes) => cardType === "buy-4" || cardType === "change-color"

		const cardComboIds = cardStore?.selectedCards?.reverse().map(card => card.id)

		const isSingleColorEffect = isColorEffectCard(card.cardType)
		const isComboColorEffect = cardComboIds?.length > 1 && cardStore?.selectedCards?.every(card => isColorEffectCard(card.type))

		if (isSingleColorEffect || isComboColorEffect) {
			selectedColor = await ChooseColorModal.open()

			if (!selectedColor) {
				return
			}
		}

		if (cardComboIds?.length > 1) {
			onDrop(cardComboIds, selectedColor)
		} else {
			onDrop([card.id], selectedColor)
		}
	}

	const [, drop] = useDrop({
		accept: CARD_TYPE,
		drop: (item: DraggedCardItem) => handleDrop(item),
		collect: monitor => ({
			isHovering: monitor.isOver(),
		}),
	})

	drop(cardStackRef)

	const handleCardStackBuyCardsCombo = (amountToBuy: number) => {
		setCardStackStateMessage(`+${amountToBuy}`)

		setTimeout(() => {
			setCardStackStateMessage("")
		}, 1500)
	}

	const onCardStackBuyCardsCombo = () => {
		socket.onCardStackBuyCardsCombo(handleCardStackBuyCardsCombo)
	}

	useDidMount(() => {
		onCardStackBuyCardsCombo()
	})

	return (
		<>
			<Menu
				anchorEl={cardStackRef?.current}
				keepMounted
				open={!!cardStackStateMessage}
				anchorOrigin={{
					horizontal: "right",
					vertical: "bottom",
				}}
				PaperProps={{
					className: classes.cardStackStateMessage,
				}}
				style={{ zIndex: -1 }}
			>
				{cardStackStateMessage}
			</Menu>

			<Grid
				container
				className={classes.cardStackContainer}
			>
				<Container
					disableGutters
					className={classes.cardStackContent}
					maxWidth={false}
					innerRef={cardStackRef}
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
								filter: (index === 0) ? "saturate(1.5)" : "contrast(0.5)",
							}}
						/>
					))}
				</Container>
			</Grid>

			<img
				className={classes.arrowCircle}
				alt="arrow circle"
				style={{
					transform: `rotate3d(${game?.direction === "clockwise" ? 180 : 0}, -0, 0, 180deg)`,
				}}
				src={arrowCircle}
			/>
		</>
	)
}

export default CardStack
