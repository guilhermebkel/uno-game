import { makeStyles } from "@material-ui/core"

import colors from "@/styles/colors"

const useStyles = makeStyles(theme => ({
	container: {
		backgroundSize: "cover !important",
		backgroundPosition: "center !important",
		borderRadius: theme.spacing(2),
		padding: theme.spacing(3),
		boxShadow: "0 5px 25px rgba(0, 0, 0, 0.1)",
	},
	gameTitle: {
		fontWeight: "bold",
		color: colors.grayScale[11],
	},
	gameSubTitle: {
		fontWeight: "normal",
		color: colors.grayScale[4],
	},
	remainingSlotText: {
		color: colors.grayScale[7],
		fontWeight: "normal",
	},
	button: {
		width: 90,
		borderRadius: theme.spacing(1),
		fontWeight: "bold",
	},
	avatar: {
		width: 35,
		height: 35,
	},
	infoText: {
		color: colors.grayScale[11],
	},
	infoIcon: {
		color: colors.palette.black4,
	},
	infoContainer: {
		flex: 1,
	},
}))

export default useStyles
