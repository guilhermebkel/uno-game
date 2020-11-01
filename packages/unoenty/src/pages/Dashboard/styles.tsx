import { makeStyles } from "@material-ui/core"

const useStyles = makeStyles(theme => ({
	container: {
		padding: theme.spacing(4),
		[theme.breakpoints.down("md")]: {
			padding: theme.spacing(1),
			width: "100vw",
		},
	},
	gameCardButton: {
		maxWidth: 400,
		[theme.breakpoints.down("md")]: {
			padding: theme.spacing(0, 0, 2, 0),
			width: "100vw",
		},
	},
	pageTitleContainer: {
		[theme.breakpoints.down("md")]: {
			justifyContent: "center",
		},
	},
}))

export default useStyles
