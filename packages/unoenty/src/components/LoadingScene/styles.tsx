import { makeStyles } from "@material-ui/core"

import colors from "@/styles/colors"

const useStyles = makeStyles((theme) => ({
	container: {
		position: "fixed",
		width: "100%",
		height: "100%",
		backgroundColor: colors.grayScale[1],
		top: 0,
		left: 0,
		zIndex: 99999,
	},
	logo: {
		maxWidth: 160,
		width: "100%",
		marginBottom: theme.spacing(2),
		animationName: "$pulseAnimation",
		animationDuration: "1.25s",
		animationIterationCount: "infinite",
		[theme.breakpoints.down("sm")]: {
			maxWidth: 120,
		},
	},
	"@keyframes pulseAnimation": {
		"0%": {
			transform: "scale(1)",
		},
		"50%": {
			transform: "scale(1.3)",
		},
		"100%": {
			transform: "scale(1)",
		},
	},
}))

export default useStyles
