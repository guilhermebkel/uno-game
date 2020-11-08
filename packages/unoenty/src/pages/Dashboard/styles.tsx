import { makeStyles } from "@material-ui/core"

const useStyles = makeStyles(theme => ({
	gameCardButton: {
		maxWidth: 400,
		[theme.breakpoints.down("sm")]: {
			padding: theme.spacing(0, 0, 2, 0),
			width: "100vw",
		},
	},
	pageTitleContainer: {
		[theme.breakpoints.down("sm")]: {
			justifyContent: "center",
		},
	},
}))

export default useStyles
