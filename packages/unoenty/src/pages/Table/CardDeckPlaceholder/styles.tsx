import { makeStyles } from "@material-ui/core"

import Device from "@/utils/device"

import colors from "@/styles/colors"

type UseStylesProps = {
	isCurrentRoundPlayer: boolean
}

const cardProportion = 1.55

const useStyles = makeStyles((theme) => {
	const cardContainerSize = Device.isMobile ? 50 : 120

	const cardWidth = 40
	const cardHeight = cardWidth * cardProportion

	return {
		cardContent: {
			position: "relative",
			height: cardContainerSize,
			pointerEvents: "none",
			transition: theme.transitions.create("all", {
				duration: theme.transitions.duration.standard,
			}),
		},
		cardContainer: {
			position: "absolute",
			top: 90,
			left: 50,
			transform: "rotate(60deg)",
			transition: theme.transitions.create("all", {
				duration: theme.transitions.duration.standard,
			}),
		},
		card: {
			height: cardHeight,
			width: cardWidth,
			position: "absolute",
			pointerEvents: "none",
			backgroundSize: "cover",
			backgroundColor: (props: UseStylesProps) => `${props.isCurrentRoundPlayer ? colors.palette.yellow1 : colors.palette.red1}`,
			borderRadius: theme.spacing(1),
			border: `${theme.spacing(0.5)}px solid ${colors.palette.blue1}`,
			transition: theme.transitions.create("all", {
				duration: theme.transitions.duration.standard,
			}),
		},
		cardCounterText: {
			position: "absolute",
			top: theme.spacing(0.5),
			left: theme.spacing(0.5),
			fontWeight: "bold",
			padding: theme.spacing(0.5),
			backgroundColor: (props: UseStylesProps) => `${props.isCurrentRoundPlayer ? colors.palette.yellow1 : colors.grayScale[12]}`,
			border: `${theme.spacing(0.5)}px solid ${colors.palette.blue1}`,
			borderRadius: theme.spacing(1),
			color: colors.grayScale[1],
		},
		cardCounterContainer: {
			width: 25,
			height: "100%",
		},
		cardCounterContent: {
			position: "relative",
			width: 20,
			height: 30,
			backgroundColor: (props: UseStylesProps) => `${props.isCurrentRoundPlayer ? colors.palette.yellow1 : colors.grayScale[12]}`,
			borderRadius: theme.spacing(0.5),
		},
		container: {
			position: "relative",
			width: 100,
			height: 125,
		},
		avatarContainer: {
			width: 50,
		},
		playerName: {
			fontWeight: "bold",
			color: (props: UseStylesProps) => `${props.isCurrentRoundPlayer ? colors.palette.yellow1 : colors.grayScale[12]}`,
			marginBottom: theme.spacing(1),
		},
		remainingCardsContainer: {
			zIndex: 1,
			"&::before": {
				content: "close-quote",
				position: "absolute",
				width: "100%",
				height: "100%",
				backgroundColor: colors.grayScale[6],
				zIndex: -1,
				bottom: 0,
				left: 0,
			},
		},
		remainingCardsText: {
			fontWeight: "bold",
			color: colors.palette.black1,
			transform: "rotate(-90deg)",
			height: 50,
			width: 55,
			textAlign: "center",
		},
		playerStateMessageContainer: {
			position: "absolute",
			top: 0,
			left: 0,
			width: "160px",
			height: "160px",
			zIndex: 50,
			borderRadius: "100%",
		},
		playerStateMessageText: {
			color: colors.grayScale[15],
			textShadow: `1px  1px 0 ${colors.grayScale[1]}, 1px -1px 0 ${colors.grayScale[1]}, -1px  1px 0 ${colors.grayScale[1]}, -1px -1px 0 ${colors.grayScale[1]}`,
			fontWeight: "bold",
			backgroundColor: colors.palette.yellow1,
			padding: theme.spacing(1, 3),
			boxShadow: `0 0 50px ${colors.grayScale[1]}`,
			transform: "rotate(-15deg)",
		},
	}
})

export default useStyles
