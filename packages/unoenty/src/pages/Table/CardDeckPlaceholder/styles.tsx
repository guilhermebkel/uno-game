import { makeStyles } from "@material-ui/core"

import Device from "@/utils/device"

const useStyles = makeStyles((theme) => {
	const cardContainerSize = Device.isMobile ? 50 : 120

	return {
		cardContent: {
			position: "relative",
			height: cardContainerSize,
			pointerEvents: "none",
			transition: theme.transitions.create("all", {
				duration: theme.transitions.duration.standard
			})
		},
		cardContainer: {
			position: "relative",
			height: cardContainerSize,
			transition: theme.transitions.create("all", {
				duration: theme.transitions.duration.standard
			})
		},
		cardChip: {
			position: "absolute",
			top: "50%",
			left: 0,
			zIndex: 9999,
			color: "#000",
			fontWeight: "bolder"
		},
		card: {
			height: cardContainerSize,
			width: "auto",
			position: "absolute",
			transition: theme.transitions.create("all", {
				duration: theme.transitions.duration.standard
			}),
			pointerEvents: "none"
		},
		playerStateMessage: {
			backgroundColor: "#EC0000",
			color: "#FFFFFF",
			fontWeight: "bolder",
			fontSize: Device.isMobile ? `${theme.spacing(1.5)}px` : `${theme.spacing(2)}px`,
			padding: Device.isMobile ? `${theme.spacing(0.5)}px ${theme.spacing(1)}px` : `${theme.spacing(2)}px ${theme.spacing(4)}px`
		}
	}
})

export default useStyles
