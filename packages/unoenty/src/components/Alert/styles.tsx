import { makeStyles } from "@material-ui/core"

const useStyles = makeStyles({
	content: {
		display: "flex",
		flexDirection: "column",
		alignItems: "center",
		textAlign: "center"
	},
	title: {
		fontWeight: "bolder",
		textAlign: "center"
	},
	footer: {
		justifyContent: "center",
		flexDirection: "column"
	},
	dialog: {
		zIndex: "9999 !important" as any
	}
})

export default useStyles