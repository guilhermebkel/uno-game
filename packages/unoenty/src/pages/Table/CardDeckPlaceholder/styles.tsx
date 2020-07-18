import { makeStyles } from "@material-ui/core"

const useStyles = makeStyles((theme) => {
	const cardContainerSize = 150

	return {
		cardContent: {
			position: "relative",
			height: 150,
			pointerEvents: "none",
			transition: theme.transitions.create("all", {
				duration: theme.transitions.duration.standard
			})
		},
		cardContainer: {
			position: "relative",
			height: 150,
			transition: theme.transitions.create("all", {
				duration: theme.transitions.duration.standard
			})
		},
		cardChip: {
			position: "absolute",
			top: "50%",
			left: "50%",
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
		}
	}
})

export default useStyles
