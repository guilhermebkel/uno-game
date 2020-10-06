import { makeStyles } from "@material-ui/core"

const useStyles = makeStyles(theme => ({
	container: {
		position: "fixed",
		pointerEvents: "none",
		zIndex: 100,
		left: 0,
		top: 0,
		width: "100%",
		height: "100%",
	},
}))

export default useStyles
