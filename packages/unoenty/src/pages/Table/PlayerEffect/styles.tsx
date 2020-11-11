import { makeStyles } from "@material-ui/core"
import { fade } from "@material-ui/core/styles/colorManipulator"

import colors from "@/styles/colors"

const useStyles = makeStyles((theme) => ({
	playerEffectMessageContainer: {
		minWidth: 290,
		minHeight: 200,
		position: "absolute",
		top: 0,
		backgroundColor: fade(colors.palette.blue1, 0.9),
		zIndex: 9999,
		height: "100%",
		[theme.breakpoints.down("sm")]: {
			minWidth: 90,
			minHeight: 120,
		},
	},
	playerEffectMessageContent: {
		width: 160,
		height: 160,
		zIndex: 50,
		borderRadius: "100%",
		[theme.breakpoints.down("sm")]: {
			width: 90,
			height: 90,
		},
	},
	playerEffectMessageText: {
		color: colors.grayScale[15],
		textShadow: `1px  1px 0 ${colors.grayScale[1]}, 1px -1px 0 ${colors.grayScale[1]}, -1px  1px 0 ${colors.grayScale[1]}, -1px -1px 0 ${colors.grayScale[1]}`,
		fontWeight: "bold",
		backgroundColor: colors.palette.yellow1,
		padding: theme.spacing(1, 3),
		boxShadow: `0 0 50px ${colors.grayScale[1]}`,
		transform: "rotate(-15deg)",
		[theme.breakpoints.down("sm")]: {
			padding: theme.spacing(1, 1.5),
		},
	},
}))

export default useStyles
