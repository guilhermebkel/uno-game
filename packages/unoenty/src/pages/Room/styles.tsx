import { makeStyles } from "@material-ui/core"

import colors from "@/styles/colors"

const useStyles = makeStyles(theme => ({
	container: {
		padding: theme.spacing(4),
		[theme.breakpoints.down("md")]: {
			padding: theme.spacing(1),
			width: "100vw",
		},
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
	pageTitle: {
		[theme.breakpoints.down("md")]: {
			maxWidth: "100vw",
		},
	},
	pageTitleContainer: {
		[theme.breakpoints.down("md")]: {
			justifyContent: "center",
		},
	},
}))

export default useStyles
