import { makeStyles } from "@material-ui/core"

import Device from "@/utils/device"

import colors from "@/styles/colors"

type UseStylesProps = {
	isCurrentRoundPlayer: boolean
	timerRemainingPercentage: number
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
			top: "50px",
			left: "125px",
			// transform: "rotate(90deg)",
			transition: theme.transitions.create("all", {
				duration: theme.transitions.duration.standard,
			}),
		},
		cardChipPlayerName: {
			position: "absolute",
			top: "50%",
			left: 0,
			zIndex: 9999,
			color: "#000000",
			fontWeight: "bolder",
			maxWidth: 200,
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
		playerStateMessage: {
			backgroundColor: "#EC0000",
			color: "#FFFFFF",
			fontWeight: "bolder",
			fontSize: Device.isMobile ? `${theme.spacing(1.5)}px` : `${theme.spacing(2)}px`,
			padding: Device.isMobile ? `${theme.spacing(0.5)}px ${theme.spacing(1)}px` : `${theme.spacing(2)}px ${theme.spacing(4)}px`,
		},
		cardCounterText: {
			position: "absolute",
			top: theme.spacing(1.2),
			left: theme.spacing(1.5),
			fontWeight: "bold",
			color: colors.grayScale[1],
		},
		cardCounterContainer: {
			flex: 1,
			height: "100%",
		},
		cardCounterContent: {
			position: "relative",
			width: 20,
			height: 30,
			backgroundColor: (props: UseStylesProps) => `${props.isCurrentRoundPlayer ? colors.palette.yellow1 : colors.grayScale[12]}`,
			borderRadius: theme.spacing(0.5),
			zIndex: 1,
			"&::before": {
				content: "close-quote",
				position: "absolute",
				width: "100%",
				height: "100%",
				backgroundColor: (props: UseStylesProps) => `${props.isCurrentRoundPlayer ? colors.palette.yellow1 : colors.grayScale[12]}`,
				top: theme.spacing(0.5),
				left: theme.spacing(0.5),
				borderRadius: theme.spacing(1),
				border: `${theme.spacing(0.5)}px solid ${colors.palette.blue1}`,
			},
		},
		container: {
			position: "relative",
			width: 100,
			height: 125,
		},
		timer: {
			position: "relative",
			zIndex: 1,
			"&::before": {
				content: "close-quote",
				position: "absolute",
				width: "100%",
				height: (props: UseStylesProps) => `${props.timerRemainingPercentage}%`,
				opacity: 1,
				backgroundColor: colors.palette.yellow1,
				borderRadius: theme.spacing(1),
				zIndex: -1,
				bottom: 0,
				left: 0,
				boxShadow: `0 0 9px ${colors.palette.yellow1}`,
				transition: theme.transitions.create("all", {
					duration: theme.transitions.duration.standard,
				}),
			},
		},
		avatarContainer: {
			flex: 1,
		},
		playerName: {
			fontWeight: "bold",
			color: (props: UseStylesProps) => `${props.isCurrentRoundPlayer ? colors.palette.yellow1 : colors.grayScale[12]}`,
			marginBottom: theme.spacing(1),
		},
	}
})

export default useStyles
