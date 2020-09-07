import { makeStyles } from "@material-ui/core"

const useStyles = makeStyles(theme => ({
	cardChipRoundCounter: {
		position: "absolute",
		zIndex: 9999,
		right: -50,
		top: -50,
		color: "#000000",
		backgroundColor: "red",
		fontWeight: "bolder"
	},
}))

export default useStyles
