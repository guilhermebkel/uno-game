import { makeStyles } from "@material-ui/core"

import Device from "@/utils/device"

import colors from "@/styles/colors"

type UseStylesProps = {
	isCurrentRoundPlayer: boolean
}

const useStyles = makeStyles((theme) => {
	const cardContainerSize = Device.isMobile ? 50 : 120

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
			position: "relative",
			height: cardContainerSize,
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
			height: cardContainerSize,
			width: "auto",
			position: "absolute",
			transition: theme.transitions.create("all", {
				duration: theme.transitions.duration.standard,
			}),
			pointerEvents: "none",
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
			position: "relative",
			marginTop: theme.spacing(6),
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
			width: 300,
			height: 300,
		},
	}
})

export default useStyles
