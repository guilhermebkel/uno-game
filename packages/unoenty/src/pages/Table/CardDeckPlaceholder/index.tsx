import React, { useRef, useState } from "react"
import { Container, Chip, Menu } from "@material-ui/core"

import { CardData, PlayerData, PlayerState } from "@uno-game/protocols"

import useStyles from "@/pages/Table/CardDeckPlaceholder/styles"

import useSocket from "@/hooks/useSocket"
import useDidMount from "@/hooks/useDidMount"

import cardPlaceholder from "@/assets/card_placeholder.png"

import RoundRemainingTime from "@/pages/Table/RoundRemainingTime"

import Device from "@/utils/device"

const CARD_WIDTH = Device.isMobile ? 7 : 20

type CardDeckPlaceholderProps = {
	cards: CardData[]
	player: PlayerData
	transform?: string
}

const CardDeckPlaceholder = (props: CardDeckPlaceholderProps) => {
	const cardDeckPlaceholderRef = useRef(null)
	
	const [playerStateMessage, setPlayerStateMessage] = useState<string>("")
	
	const { cards, player, transform } = props
	
	const socket = useSocket()
	const classes = useStyles()

	const handlePlayerStateChange = (playerState: PlayerState, playerId: string, amountToBuy?: number) => {
		if (playerId === player?.id) {
			if (playerState === "Uno") {
				setPlayerStateMessage("UNO")
			} else if (playerState === "Blocked") {
				setPlayerStateMessage("BLOCKED")
			} else if (playerState === "BuyCards") {
				setPlayerStateMessage(`+${amountToBuy}`)
			}

			setTimeout(() => {
				setPlayerStateMessage("")
			}, 1500)
		}
	}

	const onPlayerStateChange = () => {
		socket.onPlayerStateChange(handlePlayerStateChange)
	}

	useDidMount(() => {
		onPlayerStateChange()
	})

	return (
		<>
			<Menu
				anchorEl={cardDeckPlaceholderRef?.current}
				keepMounted
				open={!!playerStateMessage}
				anchorOrigin={{
					horizontal: "center",
					vertical: "bottom"
				}}
				PaperProps={{
					className: classes.playerStateMessage
				}}
				style={{ zIndex: 1 }}
			>
				{playerStateMessage}
			</Menu>

			<Container
				disableGutters
				className={classes.cardContainer}
				maxWidth={false}
				innerRef={cardDeckPlaceholderRef}
				style={{ width: (cards?.length * CARD_WIDTH) + CARD_WIDTH	}}
			>
				{player?.name && (
					<Chip
						label={player?.name}
						className={classes.cardChipPlayerName}
						style={{ backgroundColor: player?.isCurrentRoundPlayer ? "#FFE600" : "#E0E0E0" }}
					/>
				)}

				{player?.isCurrentRoundPlayer && (
					<RoundRemainingTime
						style={{
							top: Device.isMobile ? "120%" : "80%",
							left: 0
						}}
					/>
				)}

				<Container
					disableGutters
					className={classes.cardContainer}
					maxWidth={false}
					style={{ transform }}
				>
					{cards?.map((card, index) => (
						<img
							key={card.id}
							className={classes.card}
							alt="card-placeholder"
							src={cardPlaceholder}
							style={{
								zIndex: index,
								left: index * CARD_WIDTH,
								filter: player?.isCurrentRoundPlayer ? "none" : "grayscale(1)"
							}}
						/>
					))}
				</Container>
			</Container>
		</>
	)
}

export default CardDeckPlaceholder
