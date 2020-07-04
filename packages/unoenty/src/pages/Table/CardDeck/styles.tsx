import { makeStyles } from "@material-ui/core"

const useStyles = makeStyles((theme) => {
	const cardContainerSize = 150

	return {
		cardContainer: {
			position: "absolute",
			bottom: 50
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
