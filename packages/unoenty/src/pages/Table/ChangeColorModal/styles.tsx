import { makeStyles } from "@material-ui/core"

const useStyles = makeStyles({
	dialog: {
		zIndex: "9999 !important" as any
	},
	dialogPaper: {
		overflowX: "hidden"
	}
})

export default useStyles
