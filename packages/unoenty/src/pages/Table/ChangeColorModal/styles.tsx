import { makeStyles } from "@material-ui/core"

const useStyles = makeStyles({
	dialog: {
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		zIndex: "9999 !important" as any,
	},
	dialogPaper: {
		overflowX: "hidden",
	},
})

export default useStyles
