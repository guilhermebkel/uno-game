import React, { useRef, useState } from "react"
import { Container, Menu } from "@material-ui/core"
import { useDrop } from "react-dnd"

import { CardData } from "@uno-game/protocols"

import useSocket from "@/hooks/useSocket"
import useDidMount from "@/hooks/useDidMount"

import { CARD_TYPE } from "@/pages/Table/CardDeck"

import useStyles from "@/pages/Table/CardStack/styles"

import { useCardStore } from "@/store/Card"

type Props = {
	cards: CardData[]
	onDrop: (cardIds: string[]) => void
}

const CardStack = (props: Props) => {
	const [cardStackStateMessage, setCardStackStateMessage] = useState<string>("")

	const socket = useSocket()

	const cardStore = useCardStore()

	const { cards, onDrop } = props

	const classes = useStyles()
	const cardStackRef = useRef()

	const handleDrop = (cardId: string) => {
		const cardComboIds = cardStore?.selectedCards?.map(card => card.id)

		if (cardComboIds?.length && cards?.length) {
			onDrop(cardComboIds)
		} else {
			onDrop([cardId])
		}
	}

	const [{ isHovering }, drop] = useDrop({
    accept: CARD_TYPE,
		drop: (item: any) => handleDrop(item.id),
		collect: monitor => ({
			isHovering: monitor.isOver()
		})
	})
	
	drop(cardStackRef)

	const handleCardStackBuyCardsCombo = (amountToBuy: number) => {
		setCardStackStateMessage(`+${amountToBuy}`)

		setTimeout(() => {
			setCardStackStateMessage("")
		}, 1500)
	}

	useDidMount(() => {
		socket.onCardStackBuyCardsCombo(handleCardStackBuyCardsCombo)
	})

	return (
		<>
			<Menu
				anchorEl={cardStackRef?.current}
				keepMounted
				open={!!cardStackStateMessage}
				anchorOrigin={{
					horizontal: "right",
					vertical: "bottom"
				}}
				PaperProps={{
					className: classes.cardStackStateMessage
				}}
				style={{ zIndex: -1 }}
			>
				{cardStackStateMessage}
			</Menu>
			<Container
				disableGutters
				className={classes.cardContainer}
				maxWidth={false}
				innerRef={cardStackRef}
				style={{
					backgroundColor: isHovering ? "rgba(255, 255, 255, 0.7)" : "rgba(255, 255, 255, 0.1)"
				}}
			>
				{(cards || [])
					.slice(0, 5)
					.map((card, index) => (
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
					))
				}
			</Container>
		</>
	)
}

export default CardStack
