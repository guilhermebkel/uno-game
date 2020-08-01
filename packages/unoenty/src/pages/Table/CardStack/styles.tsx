import { makeStyles } from "@material-ui/core"

import Device from "@/utils/device"

const useStyles = makeStyles(theme => {
	const cardContainerSize = Device.isMobile ? 75 : 150

	return {
		cardContainer: {
			width: cardContainerSize,
			height: cardContainerSize,
			position: "relative",
			border: "4px solid #000000",
			borderRadius: "100%",
			transition: theme.transitions.create("all", {
				duration: theme.transitions.duration.standard
			})
		},
		card: {
			height: cardContainerSize,
			width: "auto",
			position: "absolute",
			left: cardContainerSize * 0.2,
			transition: theme.transitions.create("all", {
				duration: theme.transitions.duration.standard
			})
		},
		cardStackStateMessage: {
			backgroundColor: "#FFFF00",
			color: "#000000",
			fontWeight: "bolder",
			fontSize: Device.isMobile ? `${theme.spacing(3)}px` : `${theme.spacing(2)}px`,
			padding: `${theme.spacing(1)}px ${theme.spacing(2)}px`
		},
		arrowCircle: {
			position: "absolute",
			width: Device.isMobile ? 150 : 300,
			height: Device.isMobile ? 130 : 260,
			opacity: 0.05,
			zIndex: -1,
			filter: "invert(100%) sepia(49%) saturate(2%) hue-rotate(207deg) brightness(111%) contrast(101%)",
			transition: theme.transitions.create("all", {
				duration: theme.transitions.duration.standard
			})
		}
	}
})

export default useStyles
