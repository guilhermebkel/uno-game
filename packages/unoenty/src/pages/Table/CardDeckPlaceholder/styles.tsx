import { makeStyles } from "@material-ui/core"

const useStyles = makeStyles((theme) => {
	const cardContainerSize = 150

	return {
		cardContainer: {
			position: "relative",
			height: 150,
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
			})
		}
	}
})

export default useStyles
