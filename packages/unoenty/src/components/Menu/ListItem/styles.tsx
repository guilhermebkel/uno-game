import { makeStyles } from "@material-ui/core"

import { PADDING } from "@/components/Menu/styles"

const useStyles = makeStyles(theme => ({
	listItem: {
		padding: theme.spacing(1, PADDING),
	},
}))

export default useStyles
