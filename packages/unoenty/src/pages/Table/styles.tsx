import { makeStyles } from "@material-ui/core"

const useStyles = makeStyles(theme => ({
	tableContainer: {
		height: "100%",
		overflow: "hidden",
		padding: "16px",
		userSelect: "none",
		maxWidth: 1366,
		alignSelf: "center",
	},
	topCardStackContainer: {
		paddingTop: theme.spacing(3),
		[theme.breakpoints.down("sm")]: {
			paddingTop: theme.spacing(6),
		},
	},
	cardDeckPlaceholder: {
		position: "relative",
		maxHeight: 200,
		maxWidth: 200,
		height: "100%",
		width: "100%",
		[theme.breakpoints.down("sm")]: {
			maxHeight: 160,
			maxWidth: 100,
		},
	},
}))

export default useStyles
