import { makeStyles } from "@material-ui/core"

const useStyles = makeStyles(theme => ({
	gameItemGrid: {
		textDecoration: "none",
		cursor: "pointer",
	},
	container: {
		padding: theme.spacing(4),
	},
}))

export default useStyles
