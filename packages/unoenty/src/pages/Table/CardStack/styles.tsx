import { makeStyles } from "@material-ui/core"

import cardConfig from "@/config/card"

import colors from "@/styles/colors"

const useStyles = makeStyles(theme => ({
	cardStackContainer: {
		position: "relative",
		padding: theme.spacing(4.5),
		backgroundColor: colors.grayScale[2],
		width: 215,
		height: 215,
		borderRadius: "100%",
		border: `${theme.spacing(1)}px solid ${colors.grayScale[5]}`,
		transition: theme.transitions.create("all", {
			duration: theme.transitions.duration.standard,
		}),
		[theme.breakpoints.down("sm")]: {
			padding: theme.spacing(2.25),
			borderWidth: theme.spacing(0.5),
			width: 120,
			height: 120,
		},
	},
	cardStackContent: {
		width: "100%",
		height: "100%",
		position: "relative",
		transition: theme.transitions.create("all", {
			duration: theme.transitions.duration.standard,
		}),
	},
	card: {
		WebkitBackfaceVisibility: "hidden",
		height: 120,
		width: 120 / cardConfig.cardProportion,
		left: 120 * 0.2,
		position: "absolute",
		transition: theme.transitions.create("all", {
			duration: theme.transitions.duration.standard,
		}),
		borderRadius: theme.spacing(1),
		boxShadow: `0 0 ${theme.spacing(1)}px ${colors.palette.black1}`,
		backgroundColor: colors.grayScale[10],
		[theme.breakpoints.down("sm")]: {
			height: 75,
			width: 75 / cardConfig.cardProportion,
			left: 75 * 0.2,
			borderRadius: theme.spacing(1),
		},
	},
	cardComboMessageContainer: {
		position: "absolute",
		top: -15,
		right: -15,
		width: 50,
		height: 50,
		backgroundColor: colors.grayScale[1],
		boxShadow: "0 0 9px #D34141",
		borderRadius: theme.spacing(2),
		padding: theme.spacing(1),
		[theme.breakpoints.down("sm")]: {
			top: -30,
			right: -30,
		},
	},
	cardComboMessage: {
		color: colors.palette.red1,
		boxShadow: "5px 0 5px rgba(0, 0, 0, 0.25)",
	},
	cardComboTitle: {
		position: "absolute",
		bottom: -16,
	},
	buyCardContainer: {
		zIndex: 5,
		position: "absolute",
		bottom: -64,
		left: 0,
	},
	buyCardButton: {
		backgroundColor: colors.palette.yellow1,
		color: colors.palette.black1,
		boxShadow: "0 0 9px #FAFF00",
		transition: theme.transitions.create("all", {
			duration: theme.transitions.duration.standard,
		}),
		"&:hover": {
			backgroundColor: colors.palette.yellow1,
			color: colors.palette.black1,
			boxShadow: "0 0 9px #FAFF00",
			opacity: 0.9,
			transition: theme.transitions.create("all", {
				duration: theme.transitions.duration.standard,
			}),
		},
	},
}))

export default useStyles
