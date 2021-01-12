import { makeStyles } from "@material-ui/core"
import { fade } from "@material-ui/core/styles/colorManipulator"

import colors from "@/styles/colors"

const useStyles = makeStyles((theme) => ({
	cardContainer: {
		position: "relative",
		height: "100%",
	},
	cardContent: {
		position: "relative",
		transition: theme.transitions.create("all", {
			duration: theme.transitions.duration.standard,
		}),
		transform: `translateY(${theme.spacing(6)}px)`,
		[theme.breakpoints.down("sm")]: {
			transform: `translateY(${theme.spacing(5)}px)`,
		},
	},
	card: {
		WebkitBackfaceVisibility: "hidden",
		height: 120,
		width: "auto",
		position: "absolute",
		borderRadius: theme.spacing(1),
		transition: theme.transitions.create("all", {
			duration: theme.transitions.duration.standard,
		}),
		"&:hover": {
			transform: "translateY(-20px) !important",
			cursor: "pointer",
		},
		[theme.breakpoints.down("sm")]: {
			height: 75,
		},
		boxShadow: "-2px 2px 10px rgba(0, 0, 0, 0.5)",
	},
	afkContainer: {
		position: "absolute",
		left: 0,
		top: 0,
		backgroundColor: fade(colors.palette.blue1, 0.9),
		zIndex: 9999,
		height: "100%",
	},
	afkContent: {
		flex: 1,
	},
	afkButton: {
		backgroundColor: colors.palette.green1,
		transition: theme.transitions.create("all", {
			duration: theme.transitions.duration.standard,
		}),
		"&:hover": {
			backgroundColor: colors.palette.green1,
			opacity: 0.9,
			transition: theme.transitions.create("all", {
				duration: theme.transitions.duration.standard,
			}),
		},
	},
	afkInfo: {
		color: colors.grayScale[14],
		textAlign: "center",
		maxWidth: 420,
	},
	description: {
		color: colors.grayScale[12],
		fontWeight: "lighter",
	},
	title: {
		fontWeight: "bold",
		color: colors.grayScale[13],
	},
	avatarContainer: {
		marginBottom: theme.spacing(2),
		[theme.breakpoints.down("sm")]: {
			marginBottom: 0,
		},
	},
}))

export default useStyles
