import { makeStyles } from "@material-ui/core"

const useStyles = makeStyles({
	cardContainer: {
		paddingBottom: "100%",
		width: "100%",
		height: 0,
		display: "flex"
	},
	cardContent: {
		width: "100%",
		height: "100%",
		paddingBottom: "100% !important",
		display: "flex",
		alignItems: "center",
		justifyContent: "center"
	}
})

export default useStyles
