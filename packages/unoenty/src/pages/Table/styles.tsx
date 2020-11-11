import { makeStyles } from "@material-ui/core"

const useStyles = makeStyles(theme => ({
	tableContainer: {
		height: "100%",
		overflow: "hidden",
		padding: "16px",
		userSelect: "none",
	},
	topCardStackContainer: {
		paddingTop: theme.spacing(3),
	},
	topCardStackContent: {
		[theme.breakpoints.down("sm")]: {
			justifyContent: "center",
			alignItems: "center",
			display: "flex",
		},
	},
}))

export default useStyles
