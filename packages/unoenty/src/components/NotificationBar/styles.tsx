import { makeStyles } from "@material-ui/core"

import colors from "@/styles/colors"

const BAR_HEIGHT = 24

type UseStylesProps = {
	opened: boolean
}

const useStyles = makeStyles(theme => ({
	container: {
		backgroundColor: colors.palette.red1,
		position: "fixed",
		top: (props: UseStylesProps) => `${props.opened ? 0 : `-${BAR_HEIGHT}px`}`,
		left: 0,
		width: "100%",
		zIndex: 999999,
		height: `${BAR_HEIGHT}px`,
		transition: theme.transitions.create("all", {
			duration: theme.transitions.duration.standard,
		}),
	},
	text: {
		fontWeight: "normal",
	},
}))

export default useStyles
