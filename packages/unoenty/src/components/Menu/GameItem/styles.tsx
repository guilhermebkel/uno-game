import { makeStyles } from "@material-ui/core"

import colors from "@/styles/colors"

const useStyles = makeStyles(theme => ({
	container: {
		backgroundColor: colors.palette.black1,
		borderRadius: theme.spacing(2),
		padding: theme.spacing(2),
	},
	button: {
		fontSize: 14,
		fontWeight: "bold",
		color: colors.palette.black1,
		width: 60,
		borderRadius: theme.spacing(1),
	},
}))

export default useStyles
