import { makeStyles } from "@material-ui/core"

const useStyles = makeStyles((theme) => {
	const cardContainerSize = 150

	return {
		cardContainer: {
			width: cardContainerSize,
			height: cardContainerSize,
			position: "relative"
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
