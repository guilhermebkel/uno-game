import { makeStyles } from "@material-ui/core"

import colors from "@/styles/colors"

type UseStylesProps = {
	opened: boolean
}

const useStyles = makeStyles(theme => ({
	container: {
		backgroundColor: colors.palette.red1,
		opacity: (props: UseStylesProps) => `${props.opened ? 1 : 0}`,
		width: "100%",
		height: (props: UseStylesProps) => `${props.opened ? `${theme.spacing(4)}px` : 0}`,
		transition: theme.transitions.create("all", {
			duration: theme.transitions.duration.standard,
		}),
	},
	text: {
		fontWeight: "normal",
	},
}))

export default useStyles
