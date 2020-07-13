import { makeStyles } from "@material-ui/core"

const useStyles = makeStyles(theme => ({
	cardContainer: {
		width: "100%",
		backgroundColor: "#262B2E",
		height: theme.spacing() * 10,
		paddingTop: theme.spacing() * 3,
		paddingRight: theme.spacing() * 3,
		paddingBottom: theme.spacing() * 3,
		display: "flex"
	},
	cardContent: {
		position: "relative"
	},
	cardTitle: {
		color: "#FFFFFF",
		marginLeft: theme.spacing() * 3
	},
	cardStatus: {
		position: "absolute",
		width: theme.spacing(),
		height: "100%"
	}
}))

export default useStyles
