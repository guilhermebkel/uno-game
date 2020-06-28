import { makeStyles } from "@material-ui/core"

const useStyles = makeStyles(() => {
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
			position: "absolute"
		}
	}
})

export default useStyles
