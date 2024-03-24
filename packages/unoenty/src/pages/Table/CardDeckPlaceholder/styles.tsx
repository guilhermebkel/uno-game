import { makeStyles } from "@material-ui/core"

import cardConfig from "@/config/card"

import colors from "@/styles/colors"

type UseStylesProps = {
	isCurrentRoundPlayer: boolean
}

const useStyles = makeStyles((theme) => ({
	cardContent: {
		position: "relative",
		height: 120,
		pointerEvents: "none",
		transition: theme.transitions.create("all", {
			duration: theme.transitions.duration.standard,
		}),
		[theme.breakpoints.down("sm")]: {
			height: 50,
		},
	},
	cardContainer: {
		position: "absolute",
		top: 90,
		left: 50,
		transform: "rotate(60deg)",
		transition: theme.transitions.create("all", {
			duration: theme.transitions.duration.standard,
		}),
		opacity: (props: UseStylesProps) => `${props.isCurrentRoundPlayer ? 1 : 0.5}`,
		[theme.breakpoints.down("sm")]: {
			display: "none",
		},
	},
	card: {
		width: 40,
		height: 40 * cardConfig.cardProportion,
		position: "absolute",
		pointerEvents: "none",
		backgroundSize: "cover",
		backgroundColor: (props: UseStylesProps) => `${props.isCurrentRoundPlayer ? colors.palette.yellow1 : colors.palette.red1}`,
		borderRadius: theme.spacing(1),
		border: `${theme.spacing(0.5)}px solid ${colors.palette.blue1}`,
		transition: theme.transitions.create("all", {
			duration: theme.transitions.duration.standard,
		}),
		[theme.breakpoints.down("sm")]: {
			width: 25,
			height: 25 * cardConfig.cardProportion,
		},
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
		opacity: (props: UseStylesProps) => `${props.isCurrentRoundPlayer ? 1 : 0.5}`,
		[theme.breakpoints.down("sm")]: {
			alignItems: "normal !important",
		},
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
		[theme.breakpoints.down("sm")]: {
			width: "50px !important",
			height: "50px !important",
			// eslint-disable-next-line
			flexDirection: "row !important" as any,
		},
	},
	avatarContainer: {
		width: 50,
		opacity: (props: UseStylesProps) => `${props.isCurrentRoundPlayer ? 1 : 0.5}`,
	},
	playerName: {
		fontSize: 14,
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
}))

export default useStyles
