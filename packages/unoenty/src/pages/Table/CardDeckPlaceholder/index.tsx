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

import useSocket from "@/hooks/useSocket"
import useDidMount from "@/hooks/useDidMount"

import { useSocketStore } from "@/store/Socket"

import useStyles, { CARD_HEIGHT, CARD_WIDTH } from "@/pages/Table/CardDeckPlaceholder/styles"
import useCustomStyles from "@/styles/custom"

import { getCardPosition } from "@/utils/card"
import { buildPercentage } from "@/utils/number"

const MAX_CARDS = 7

type CardDeckPlaceholderProps = {
	player: PlayerData
	position: "left" | "top" | "right" | "bottom"
}

type CardDeckPlaceholderPositionStylesMap = {
	[key in CardDeckPlaceholderProps["position"]]: {
		cardCounterContainer?: React.CSSProperties
		cardContainer?: React.CSSProperties
		remainingCardsText?: React.CSSProperties
		container?: React.CSSProperties
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
		container: { flexDirection: "row-reverse" },
	},
}

const CardDeckPlaceholder: React.FC<CardDeckPlaceholderProps> = (props) => {
	const { player, position } = props

	const socketStore = useSocketStore()
	const socket = useSocket()

	const [playerStateMessage, setPlayerStateMessage] = useState<string>("")

	const limitedCards = player?.handCards?.slice(0, MAX_CARDS)
	const allCards = player?.handCards
	const positionStyles = cardDeckPlaceholderPositionStylesMap[position]

	const customClasses = useCustomStyles({
		limitedNameWidth: 50,
		avatarTimerRemainingPercentage: buildPercentage(
			socketStore.game?.roundRemainingTimeInSeconds as number,
			socketStore.game?.maxRoundDurationInSeconds as number,
		),
	})

	const classes = useStyles({
		isCurrentRoundPlayer: player?.isCurrentRoundPlayer,
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
		<Grid
			container
			alignItems="center"
			className={classes.container}
			style={positionStyles.container}
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
						align="center"
						className={classes.playerStateMessageText}
					>
						{playerStateMessage}
					</Typography>
				</Grid>
			</Zoom>

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
					className={player.isCurrentRoundPlayer ? customClasses.avatarTimer : ""}
				/>
			</Grid>

			<Divider orientation="vertical" size={2} />

			<Grid
				container
				className={classes.cardContainer}
				style={positionStyles.cardContainer}
			>
				{[...limitedCards, undefined].map((card, index) => {
					const { x, y, inclination } = getCardPosition({
						cardHeight: CARD_HEIGHT,
						cardWidth: CARD_WIDTH,
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
	)
}

export default CardDeckPlaceholder
