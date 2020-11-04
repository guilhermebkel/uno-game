import { makeStyles } from "@material-ui/core"

import cardConfig from "@/config/card"

import colors from "@/styles/colors"

import Device from "@/utils/device"

const useStyles = makeStyles(theme => {
	const cardContainerSize = Device.isMobile ? 75 : 120

	return {
		cardStackContainer: {
			padding: theme.spacing(4.5),
			backgroundColor: colors.grayScale[2],
			width: 215,
			height: 215,
			borderRadius: "100%",
			border: `${theme.spacing(1)}px solid ${colors.grayScale[5]}`,
		},
		cardContainer: {
			width: "100%",
			height: "100%",
			position: "relative",
			transition: theme.transitions.create("all", {
				duration: theme.transitions.duration.standard,
			}),
		},
		card: {
			height: cardContainerSize,
			width: cardContainerSize / cardConfig.cardProportion,
			position: "absolute",
			left: cardContainerSize * 0.2,
			transition: theme.transitions.create("all", {
				duration: theme.transitions.duration.standard,
			}),
			border: `${theme.spacing(0.5)}px solid ${colors.grayScale[13]}`,
			borderRadius: theme.spacing(2),
			boxShadow: `0 0 ${theme.spacing(1)}px ${colors.palette.black1}`,
			backgroundColor: colors.grayScale[10],
		},
		cardStackStateMessage: {
			backgroundColor: "#FFFF00",
			color: "#000000",
			fontWeight: "bolder",
			fontSize: Device.isMobile ? `${theme.spacing(3)}px` : `${theme.spacing(2)}px`,
			padding: `${theme.spacing(1)}px ${theme.spacing(2)}px`,
		},
		arrowCircle: {
			position: "absolute",
			width: Device.isMobile ? 150 : 300,
			height: Device.isMobile ? 130 : 260,
			opacity: 0.05,
			zIndex: -1,
			filter: "invert(100%) sepia(49%) saturate(2%) hue-rotate(207deg) brightness(111%) contrast(101%)",
			transition: theme.transitions.create("all", {
				duration: theme.transitions.duration.standard,
			}),
		},
	}
})

export default useStyles
