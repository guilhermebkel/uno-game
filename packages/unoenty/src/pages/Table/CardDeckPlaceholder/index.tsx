import React from "react"
import {
	Grid,
	Typography,
	Tooltip
} from "@material-ui/core"

import { PlayerData } from "@uno-game/protocols"

import {
	Avatar,
	Divider,
} from "@/components"

import { useSocketStore } from "@/store/Socket"

import useStyles from "@/pages/Table/CardDeckPlaceholder/styles"
import useCustomStyles from "@/styles/custom"

import PlayerEffect from "@/pages/Table/PlayerEffect"

import { getCardPosition } from "@/utils/card"
import { buildPercentage } from "@/utils/number"
import { GameDeckLayoutPosition } from "@/utils/game"

const MAX_CARDS = 7

type CardDeckPlaceholderProps = {
	player: PlayerData
	position: GameDeckLayoutPosition
}

type CardDeckPlaceholderPositionStylesMap = {
	[key in CardDeckPlaceholderProps["position"]]: {
		cardCounterContainer?: React.CSSProperties
		cardContainer?: React.CSSProperties
		remainingCardsText?: React.CSSProperties
		container?: React.CSSProperties
		avatarContainer?: React.CSSProperties
	}
}

const cardDeckPlaceholderPositionStylesMap: CardDeckPlaceholderPositionStylesMap = {
	left: {
		cardCounterContainer: { alignItems: "flex-end" },
		cardContainer: { top: 90, left: 50, transform: "rotate(60deg)" },
		remainingCardsText: { width: 55, height: 50, transform: "rotate(-90deg)" },
	},
	top: {
		cardCounterContainer: { alignItems: "flex-start" },
		cardContainer: { top: 110, left: -20, transform: "rotate(145deg)" },
		remainingCardsText: { width: 20, height: 40, transform: "rotate(90deg)" },
		container: { flexDirection: "row-reverse" },
	},
	topLeft: {
		cardCounterContainer: { alignItems: "flex-start" },
		cardContainer: { top: 180, left: -100, transform: "rotate(110deg)" },
		remainingCardsText: { width: 20, height: 40, transform: "rotate(90deg)" },
		container: { flexDirection: "row-reverse", width: 260, justifyContent: "flex-end" },
	},
	topRight: {
		cardCounterContainer: { alignItems: "flex-start" },
		cardContainer: { top: 100, left: -15, transform: "rotate(180deg)" },
		remainingCardsText: { width: 20, height: 40, transform: "rotate(90deg)" },
		container: { flexDirection: "row", width: "auto", justifyContent: "flex-end" },
	},
	right: {
		cardCounterContainer: { alignItems: "flex-end" },
		cardContainer: { top: 75, left: -50, transform: "rotate(235deg)" },
		remainingCardsText: { width: 20, height: 40, transform: "rotate(90deg)" },
		container: { flexDirection: "row-reverse" },
	},
	bottom: {
		cardCounterContainer: { alignItems: "flex-end" },
		cardContainer: { top: 50, left: -10, transform: "rotate(330deg)" },
		remainingCardsText: { width: 55, height: 50, transform: "rotate(-90deg)" },
		container: { flexDirection: "row-reverse", top: 40, left: 64 },
	},
	bottomLeft: {
		cardCounterContainer: { alignItems: "flex-end", position: "relative", bottom: -30 },
		cardContainer: { top: 80, left: 8, transform: "rotate(366deg)" },
		remainingCardsText: { width: 55, height: 50, transform: "rotate(-90deg)" },
		container: { flexDirection: "row-reverse" },
		avatarContainer: { flexDirection: "column-reverse", position: "relative", bottom: -60, height: 88, justifyContent: "space-between" }
	},
	bottomRight: {
		cardCounterContainer: { alignItems: "flex-end", position: "relative", bottom: -36 },
		cardContainer: { top: 36, left: 40, transform: "rotate(280deg)" },
		remainingCardsText: { width: 55, height: 50, transform: "rotate(-90deg)" },
		container: { flexDirection: "row", width: "auto", justifyContent: "flex-end" },
		avatarContainer: { flexDirection: "column-reverse", position: "relative", bottom: -60, height: 98, justifyContent: "space-between" }
	}
}

const CardDeckPlaceholder: React.FC<CardDeckPlaceholderProps> = (props) => {
	const { player, position } = props

	const socketStore = useSocketStore()

	const limitedCards = player?.handCards?.slice(0, MAX_CARDS)
	const allCards = player?.handCards
	const positionStyles = cardDeckPlaceholderPositionStylesMap[position]

	const customClasses = useCustomStyles({
		limitedNameWidth: 80,
		avatarTimerRemainingPercentage: buildPercentage(
			socketStore.gameRoundRemainingTimeInSeconds as number,
			socketStore.game?.maxRoundDurationInSeconds as number,
		),
	})

	const classes = useStyles({
		isCurrentRoundPlayer: player?.isCurrentRoundPlayer,
	})

	if (!player?.id) {
		return <div />
	}

	return (
		<>
			<PlayerEffect
				playerId={player?.id}
			/>

			<Grid
				container
				alignItems="center"
				justify="center"
				className={classes.container}
				style={positionStyles.container}
			>

				<Grid
					container
					className={classes.cardCounterContainer}
					style={positionStyles.cardCounterContainer}
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
							{allCards.length}
						</Typography>
					</Grid>
				</Grid>

				<Divider orientation="vertical" size={2} />

				<Tooltip title={player.name}>
					<Grid
						container
						direction="column"
						alignItems="center"
						className={classes.avatarContainer}
						style={positionStyles.avatarContainer}
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
							className={player.isCurrentRoundPlayer ? customClasses.avatarTimer : ""}
						/>
					</Grid>
				</Tooltip>

				<Divider orientation="vertical" size={2} />

				<Grid
					container
					className={classes.cardContainer}
					style={positionStyles.cardContainer}
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

						const remainingCards = allCards.length - MAX_CARDS
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
										style={positionStyles.remainingCardsText}
									>
										+{remainingCards}
									</Typography>
								)}
							</Grid>
						)
					})}
				</Grid>
			</Grid>
		</>
	)
}

export default CardDeckPlaceholder
