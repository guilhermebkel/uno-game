import { makeStyles } from "@material-ui/core"
import { fade } from "@material-ui/core/styles/colorManipulator"

import colors from "@/styles/colors"

import Device from "@/utils/device"

const useStyles = makeStyles((theme) => {
	const cardContainerSize = Device.isMobile ? 75 : 120

	return {
		cardContainer: {
			position: "relative",
			height: "100%",
		},
		cardContent: {
			position: "relative",
			transition: theme.transitions.create("all", {
				duration: theme.transitions.duration.standard,
			}),
			transform: `translateY(${theme.spacing(Device.isMobile ? 7 : 8)}px)`,
		},
		card: {
			height: cardContainerSize,
			width: "auto",
			position: "absolute",
			transition: theme.transitions.create("all", {
				duration: theme.transitions.duration.standard,
			}),
			"&:hover": {
				transform: "translateY(-20px) !important",
				cursor: "pointer",
			},
		},
		afkContainer: {
			position: "absolute",
			left: 0,
			top: 0,
			backgroundColor: fade(colors.palette.blue1, 0.9),
			zIndex: 9999,
			height: "100%",
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
			marginBottom: theme.spacing(Device.isMobile ? 0 : 2),
		},
	}
})

export default useStyles
