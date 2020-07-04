import { makeStyles } from "@material-ui/core"

const useStyles = makeStyles(() => {
	const cardContainerSize = 150

	return {
		cardContainer: {
			width: cardContainerSize,
			height: cardContainerSize,
			position: "relative",
			backgroundColor: "#ECECEC"
		},
		card: {
			height: cardContainerSize,
			width: "auto",
			position: "absolute",
			left: cardContainerSize * 0.2
		}
	}
})

export default useStyles
