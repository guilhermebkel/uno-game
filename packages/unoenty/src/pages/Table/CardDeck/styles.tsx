import { makeStyles } from "@material-ui/core"

import Device from "@/utils/device"

const useStyles = makeStyles((theme) => {
	const cardContainerSize = Device.isMobile ? 75 : 150

	return {
		cardContainer: {
			position: "relative",
			height: cardContainerSize,
			transition: theme.transitions.create("all", {
				duration: theme.transitions.duration.standard
			})
		},
		card: {
			height: cardContainerSize,
			width: "auto",
			position: "absolute",
			transition: theme.transitions.create("all", {
				duration: theme.transitions.duration.standard
			}),
			"&:hover": {
				transform: "translateY(-20px) !important",
				cursor: "pointer"
			}
		}
	}
})

export default useStyles
