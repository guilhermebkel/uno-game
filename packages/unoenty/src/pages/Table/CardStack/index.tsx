import React, { useRef } from "react"
import { Grid, Typography, Zoom, Button } from "@material-ui/core"
import { useDrop } from "react-dnd"

import { CardData, CardTypes, CardColors, Game } from "@uno-game/protocols"

import { CARD_TYPE, DraggedCardItem } from "@/pages/Table/CardDeck"

import useStyles from "@/pages/Table/CardStack/styles"

import { useCardStore } from "@/store/Card"

import ChooseColorModal from "@/pages/Table/ChooseColorModal"

import currentComboTextImg from "@/assets/texts/current-combo.png"

import useSocket from "@/hooks/useSocket"

type CardStackProps = {
	cards: CardData[]
	game: Game
}

let lastAmountToBuy = 0

const CardStack: React.FC<CardStackProps> = (props) => {
	const cardStore = useCardStore()
	const socket = useSocket()

	const { cards, game } = props

	const classes = useStyles()
	const cardStackRef = useRef()

	const buyCard = () => {
		socket.buyCard(game.id)
	}

	const putCard = (cardIds: string[], selectedColor: CardColors) => {
		socket.putCard(game.id, cardIds, selectedColor)
	}

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
			putCard(cardComboIds, selectedColor)
		} else {
			putCard([card.id], selectedColor)
		}
	}

	if (game?.currentCardCombo?.amountToBuy > 0) {
		lastAmountToBuy = game?.currentCardCombo?.amountToBuy
	}

	const [{ isHovering }, drop] = useDrop({
		accept: CARD_TYPE,
		drop: (item: DraggedCardItem) => handleDrop(item),
		collect: monitor => ({
			isHovering: monitor.isOver(),
		}),
	})

	drop(cardStackRef)

	return (
		<>
			<Grid
				container
				className={classes.cardStackContainer}
				innerRef={cardStackRef}
				style={{
					backgroundColor: isHovering ? "rgba(255, 255, 255, 0.1)" : "",
				}}
			>
				<Zoom
					in={!!game?.currentCardCombo?.amountToBuy}
				>
					<Grid
						container
						className={classes.cardComboMessageContainer}
						justify="center"
					>
						<Typography
							variant="h2"
							className={classes.cardComboMessage}
						>
							+{game?.currentCardCombo?.amountToBuy || lastAmountToBuy}
						</Typography>

						<img
							src={currentComboTextImg}
							alt="Current combo"
							className={classes.cardComboTitle}
						/>
					</Grid>
				</Zoom>

				{socket?.currentPlayer?.canBuyCard && (
					<Grid
						container
						justify="center"
						className={classes.buyCardContainer}
					>
						<Button
							variant="contained"
							onClick={buyCard}
							className={classes.buyCardButton}
						>
							BUY CARD
						</Button>
					</Grid>
				)}

				<Grid
					container
					className={classes.cardStackContent}
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
				</Grid>
			</Grid>
		</>
	)
}

export default CardStack
