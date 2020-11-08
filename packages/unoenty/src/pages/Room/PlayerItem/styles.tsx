import { makeStyles } from "@material-ui/core"

import colors from "@/styles/colors"

type UseStylesProps = {
	ready: boolean
}

const useStyles = makeStyles(theme => ({
	container: {
		backgroundColor: colors.grayScale[2],
		borderRadius: theme.spacing(2),
		padding: theme.spacing(3),
	},
	description: {
		color: colors.grayScale[12],
		fontWeight: "lighter",
	},
	title: {
		fontWeight: "bold",
		color: colors.grayScale[13],
		[theme.breakpoints.down("sm")]: {
			maxWidth: "100px",
		},
	},
	statusText: {
		color: (props: UseStylesProps) => `${props.ready ? colors.palette.green1 : colors.palette.yellow1}`,
	},
	starIcon: {
		color: colors.palette.yellow1,
		marginLeft: theme.spacing(1),
	},
}))

export default useStyles
