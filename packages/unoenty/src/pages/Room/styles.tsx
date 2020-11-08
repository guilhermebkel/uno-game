import { makeStyles } from "@material-ui/core"

import colors from "@/styles/colors"

const useStyles = makeStyles(theme => ({
	pageTitleSpotlight: {
		color: colors.grayScale[10],
	},
	itemTitle: {
		color: colors.grayScale[9],
	},
	content: {
		maxWidth: 800,
	},
	pageTitle: {
		[theme.breakpoints.down("sm")]: {
			maxWidth: "100vw",
		},
	},
	pageTitleContainer: {
		[theme.breakpoints.down("sm")]: {
			justifyContent: "center",
		},
	},
}))

export default useStyles
