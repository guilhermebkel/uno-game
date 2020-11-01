import { makeStyles } from "@material-ui/core"

import colors from "@/styles/colors"

const useStyles = makeStyles(theme => ({
	container: {
		padding: theme.spacing(4),
	},
	pageTitleSpotlight: {
		color: colors.grayScale[10],
	},
	itemTitle: {
		color: colors.grayScale[9],
	},
	content: {
		maxWidth: 800,
	},
}))

export default useStyles
