import { makeStyles } from "@material-ui/core"

import colors from "@/styles/colors"

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
	colorSelectorContainer: {
		width: 225,
		height: 225,
	},
	colorSelectorButton: {
		width: 80,
		height: 80,
		borderRadius: theme.spacing(2),
		margin: theme.spacing(2),
	},
}))

export default useStyles
