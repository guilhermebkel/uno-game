import { makeStyles } from "@material-ui/core"

const useStyles = makeStyles(theme => ({
	dialog: {
		// eslint-disable-next-line
		zIndex: "9999 !important" as any,
	},
	dialogPaper: {
		overflowX: "hidden",
		background: "radial-gradient(56.42% 56.42% at 50% 43.58%, #FFFFFF 0%, #D9D9D9 100%)",
		maxWidth: 500,
		maxHeight: 500,
		width: "100%",
		height: "100%",
		borderRadius: theme.spacing(2),
		[theme.breakpoints.down("sm")]: {
			height: "auto",
			maxWidth: "100%",
			padding: theme.spacing(2, 0),
		},
	},
	dialogContainer: {
		height: "100%",
	},
	colorSelectorContainer: {
		width: 225,
		height: 225,
		[theme.breakpoints.down("sm")]: {
			width: 158,
			height: 158,
		},
	},
	colorSelectorButton: {
		width: 80,
		height: 80,
		borderRadius: theme.spacing(2),
		margin: theme.spacing(2),
		[theme.breakpoints.down("sm")]: {
			width: 60,
			height: 60,
			margin: theme.spacing(1),
		},
	},
	chooseColorImg: {
		[theme.breakpoints.down("sm")]: {
			width: 172,
		},
	},
}))

export default useStyles
