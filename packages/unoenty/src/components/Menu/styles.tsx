import { makeStyles } from "@material-ui/core"

import colors from "@/styles/colors"

export const PADDING = 4

const useStyles = makeStyles(theme => ({
	drawerPaper: {
		width: 422,
		backgroundColor: colors.grayScale[1],
		padding: theme.spacing(PADDING, 0),
		position: "relative",
	},
	avatarContainer: {
		padding: theme.spacing(0, PADDING),
	},
	avatarName: {
		fontWeight: "bold",
		marginLeft: theme.spacing(2),
		color: colors.grayScale[15],
	},
	menuTitle: {
		color: colors.grayScale[7],
		padding: theme.spacing(0, PADDING),
	},
	listItemIcon: {
		color: colors.palette.black4,
	},
	listItemText: {
		color: colors.palette.black3,
	},
	logoutButton: {
		backgroundColor: colors.palette.red1,
		borderRadius: theme.spacing(2),
		color: colors.grayScale[15],
		padding: theme.spacing(1, 2),
		"&:hover": {
			backgroundColor: colors.palette.red1,
		},
	},
	githubButton: {
		color: colors.grayScale[7],
	},
	content: {
		height: "100%",
	},
}))

export default useStyles
