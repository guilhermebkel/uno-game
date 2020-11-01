import { makeStyles } from "@material-ui/core"

const useStyles = makeStyles(theme => ({
	logo: {
		maxWidth: 160,
		width: "100%",
	},
	form: {
		display: "flex",
		width: "100%",
		flexDirection: "column",
		alignItems: "center",
	},
}))

export default useStyles
