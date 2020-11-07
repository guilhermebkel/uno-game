import { makeStyles } from "@material-ui/core"
import { fade } from "@material-ui/core/styles/colorManipulator"

import colors from "@/styles/colors"

import Device from "@/utils/device"

const useStyles = makeStyles((theme) => {
	const cardContainerSize = Device.isMobile ? 75 : 150

	return {
		cardContainer: {
			position: "relative",
			height: "100%",
		},
		cardContent: {
			position: "relative",
			height: cardContainerSize,
			transition: theme.transitions.create("all", {
				duration: theme.transitions.duration.standard,
			}),
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
			minWidth: 420,
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
	}
})

export default useStyles
