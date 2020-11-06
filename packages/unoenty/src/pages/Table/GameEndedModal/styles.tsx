import { makeStyles } from "@material-ui/core"

import colors from "@/styles/colors"

const useStyles = makeStyles(theme => ({
	dialog: {
		// eslint-disable-next-line
		zIndex: "9999 !important" as any,
	},
	dialogPaper: {
		overflowX: "hidden",
		background: "linear-gradient(180deg, #353535 0%, #0D0D0D 100%)",
		maxWidth: 600,
		maxHeight: 650,
		width: "100%",
		height: "100%",
		borderRadius: theme.spacing(2),
	},
	dialogTitle: {
		textAlign: "center",
		fontWeight: "bold",
		fontSize: 60,
		color: colors.grayScale[3],
		border: "4px solid #F3F3F3",
		textShadow: "0px 5px 5px rgba(0, 0, 0, 0.25)",
	},
	dialogContainer: {
		height: "100%",
	},
	description: {
		color: colors.grayScale[12],
		fontWeight: "lighter",
	},
	title: {
		fontWeight: "bold",
		color: colors.grayScale[13],
		[theme.breakpoints.down("md")]: {
			maxWidth: "100px",
		},
	},
	winnerInfoContainer: {
		padding: theme.spacing(3, 4),
		backgroundColor: colors.grayScale[1],
		boxShadow: "9px 0 12px rgba(0, 0, 0, 0.5)",
		borderRadius: theme.spacing(2),
		maxWidth: "80%",
	},
	playAgainButton: {
		backgroundColor: "#E0CE2D",
		padding: theme.spacing(1.5, 6),
		transition: theme.transitions.create("all", {
			duration: theme.transitions.duration.standard,
		}),
		"&:hover": {
			backgroundColor: "#E0CE2D",
			opacity: 0.9,
		},
	},
	quitButton: {
		color: colors.grayScale[15],
	},
}))

export default useStyles
