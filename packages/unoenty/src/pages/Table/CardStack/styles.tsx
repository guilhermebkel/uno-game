import { makeStyles } from "@material-ui/core"

import cardConfig from "@/config/card"

import colors from "@/styles/colors"

import Device from "@/utils/device"

const useStyles = makeStyles(theme => {
	const cardHeight = Device.isMobile ? 75 : 120

	return {
		cardStackContainer: {
			position: "relative",
			padding: theme.spacing(4.5),
			backgroundColor: colors.grayScale[2],
			width: 215,
			height: 215,
			borderRadius: "100%",
			border: `${theme.spacing(1)}px solid ${colors.grayScale[5]}`,
			transition: theme.transitions.create("all", {
				duration: theme.transitions.duration.standard,
			}),
		},
		cardStackContent: {
			width: "100%",
			height: "100%",
			position: "relative",
			transition: theme.transitions.create("all", {
				duration: theme.transitions.duration.standard,
			}),
		},
		card: {
			height: cardHeight,
			width: cardHeight / cardConfig.cardProportion,
			position: "absolute",
			left: cardHeight * 0.2,
			transition: theme.transitions.create("all", {
				duration: theme.transitions.duration.standard,
			}),
			border: `${theme.spacing(0.5)}px solid ${colors.grayScale[13]}`,
			borderRadius: theme.spacing(2),
			boxShadow: `0 0 ${theme.spacing(1)}px ${colors.palette.black1}`,
			backgroundColor: colors.grayScale[10],
		},
		cardComboMessageContainer: {
			position: "absolute",
			top: -15,
			right: -15,
			width: 50,
			height: 50,
			backgroundColor: colors.grayScale[1],
			boxShadow: "0 0 9px #D34141",
			borderRadius: theme.spacing(2),
			padding: theme.spacing(1),
		},
		cardComboMessage: {
			color: colors.palette.red1,
			boxShadow: "5px 0 5px rgba(0, 0, 0, 0.25)",
		},
		cardComboTitle: {
			position: "absolute",
			bottom: -16,
		},
	}
})

export default useStyles
