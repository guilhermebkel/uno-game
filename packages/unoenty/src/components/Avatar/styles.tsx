import { makeStyles } from "@material-ui/core"

import colors from "@/styles/colors"

const useStyles = makeStyles(theme => ({
	avatarContainer: {
		borderRadius: theme.spacing(2),
		margin: 0,
	},
	avatarContent: {
		borderRadius: "100%",
		display: "flex",
		alignItems: "center",
		justifyContent: "center",
		margin: 0,
	},
	avatarTypography: {
		color: colors.grayScale[3],
	},
}))

export default useStyles
