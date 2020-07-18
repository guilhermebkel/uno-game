import { makeStyles } from "@material-ui/core"

const useStyles = makeStyles(theme => {
	const cardContainerSize = 150

	return {
		cardContainer: {
			width: cardContainerSize,
			height: cardContainerSize,
			position: "relative",
			border: "1px solid rgba(0, 0, 0, 0.4)",
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
