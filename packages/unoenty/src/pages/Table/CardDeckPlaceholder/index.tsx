import React, { useState } from "react"
import {
	Grid,
	Typography,
	Zoom,
} from "@material-ui/core"

import { PlayerData, PlayerState } from "@uno-game/protocols"

import {
	Avatar,
	Divider,
} from "@/components"

import useStyles from "@/pages/Table/CardDeckPlaceholder/styles"

import useSocket from "@/hooks/useSocket"
import useDidMount from "@/hooks/useDidMount"
import { useSocketStore } from "@/store/Socket"

import useCustomStyles from "@/styles/custom"

import { getCardPosition } from "@/utils/card"

const MAX_CARDS = 7

type CardDeckPlaceholderProps = {
	player: PlayerData
	position?: "left" | "top" | "right"
}

const CardDeckPlaceholder: React.FC<CardDeckPlaceholderProps> = (props) => {
	const { player } = props

	const socketStore = useSocketStore()
	const socket = useSocket()

	const [playerStateMessage, setPlayerStateMessage] = useState<string>("")

	const limitedCards = player?.handCards?.slice(0, MAX_CARDS)

	const buildTimerRemainingTimePercentage = () => {
		const roundRemainingTimeInSeconds = socketStore.game?.roundRemainingTimeInSeconds as number
		const maxRoundDurationInSeconds = socketStore.game?.maxRoundDurationInSeconds as number

		const roundRemainingTimePercentage = parseInt(((roundRemainingTimeInSeconds / maxRoundDurationInSeconds) * 100).toString(), 10)

		return roundRemainingTimePercentage
	}

	const customClasses = useCustomStyles({
		limitedNameWidth: 40,
	})

	const classes = useStyles({
		isCurrentRoundPlayer: player?.isCurrentRoundPlayer,
		timerRemainingPercentage: buildTimerRemainingTimePercentage(),
	})

	const handlePlayerStateChange = (playerState: PlayerState, playerId: string, amountToBuy?: number) => {
		if (playerId === player?.id) {
			if (playerState === "Uno") {
				setPlayerStateMessage("UNO!")
			} else if (playerState === "Blocked") {
				setPlayerStateMessage("BLOCKED!")
			} else if (playerState === "BuyCards") {
				setPlayerStateMessage(`BUY ${amountToBuy}!`)
			}

			setTimeout(() => {
				setPlayerStateMessage("")
			}, 2000)
		}
	}

	const onPlayerStateChange = () => {
		socket.onPlayerStateChange(handlePlayerStateChange)
	}

	useDidMount(() => {
		onPlayerStateChange()
	})

	if (!player?.id) {
		return <div />
	}

	return (
		<>
			<Grid
				container
				alignItems="center"
				className={classes.container}
			>
				<Zoom in={!!playerStateMessage}>
					<Grid
						container
						justify="center"
						alignItems="center"
						className={classes.playerStateMessageContainer}
					>
						<Typography
							variant="h3"
							className={classes.playerStateMessageText}
						>
							{playerStateMessage}
						</Typography>
					</Grid>
				</Zoom>

				<Grid
					container
					className={classes.cardCounterContainer}
					alignItems="flex-end"
				>
					<Grid
						container
						className={classes.cardCounterContent}
						alignItems="center"
						justify="center"
					>
						<Typography
							variant="h3"
							className={classes.cardCounterText}
						>
							{player.handCards.length}
						</Typography>
					</Grid>
				</Grid>

				<Divider orientation="vertical" size={2} />

				<Grid
					container
					direction="column"
					alignItems="center"
					className={classes.avatarContainer}
				>
					<Typography
						variant="h3"
						className={`${classes.playerName} ${customClasses.limitedName}`}
					>
						{player.name}
					</Typography>

					<Avatar
						name={player.name}
						size="small"
						className={player.isCurrentRoundPlayer ? classes.timer : ""}
					/>
				</Grid>

				<Divider orientation="vertical" size={2} />

				<Grid
					container
					className={classes.cardContainer}
				>
					{[...limitedCards, undefined].map((card, index) => {
						const { x, y, inclination } = getCardPosition({
							cardHeight: 62,
							cardWidth: 40,
							cardIndex: index,
							cardsCount: limitedCards.length,
							expectedCardsCount: limitedCards.length,
							maxAngle: 90,
							radius: 100,
						})

						const remainingCards = player.handCards.length - MAX_CARDS
						const isPlaceholder = !card?.id
						const showPlaceholder = isPlaceholder && remainingCards > 0

						if (isPlaceholder && !showPlaceholder) {
							return null
						}

						return (
							<Grid
								item
								key={card?.id || index}
								className={`${classes.card} ${showPlaceholder ? classes.remainingCardsContainer : ""}`}
								style={{
									transform: `rotate(${inclination}deg)`,
									top: -y,
									zIndex: index,
									left: x,
								}}
							>
								{showPlaceholder && (
									<Typography
										variant="h3"
										className={classes.remainingCardsText}
									>
										+{remainingCards}
									</Typography>
								)}
							</Grid>
						)
					})}
				</Grid>
			</Grid>
			{/* <Menu
				anchorEl={cardDeckPlaceholderRef?.current}
				keepMounted
				open={!!playerStateMessage}
				anchorOrigin={{
					horizontal: "center",
					vertical: "bottom",
				}}
				PaperProps={{
					className: classes.playerStateMessage,
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
							left: 0,
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
								filter: player?.isCurrentRoundPlayer ? "none" : "grayscale(1)",
							}}
						/>
					))}
				</Container>
			</Container> */}
		</>
	)
}

export default CardDeckPlaceholder
