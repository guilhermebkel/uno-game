import { makeStyles } from "@material-ui/core"

import Device from "@unoenty/utils/device"

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
			}),
		},
		card: {
			height: cardContainerSize,
			width: "auto",
			position: "absolute",
			left: cardContainerSize * 0.2,
			transition: theme.transitions.create("all", {
				duration: theme.transitions.duration.standard
			})
		}
	}
})

export default useStyles
