import { makeStyles } from "@material-ui/core"

import colors from "@/styles/colors"

type UseCustomStylesProps = {
	limitedNameWidth?: number | null
	avatarTimerRemainingPercentage?: number | null
}

const useCustomStyles = makeStyles(theme => ({
	avatarTimer: {
		position: "relative",
		zIndex: 1,
		"&::before": {
			content: "close-quote",
			position: "absolute",
			width: "100%",
			height: (props: UseCustomStylesProps) => `${props.avatarTimerRemainingPercentage}%`,
			opacity: 1,
			backgroundColor: colors.palette.yellow1,
			borderRadius: theme.spacing(1),
			zIndex: -1,
			bottom: 0,
			left: 0,
			boxShadow: `0 0 9px ${colors.palette.yellow1}`,
			transition: theme.transitions.create("all", {
				duration: theme.transitions.duration.standard,
			}),
		},
	},
	pageContainer: {
		padding: theme.spacing(4),
		overflowY: "auto",
		[theme.breakpoints.down("sm")]: {
			padding: theme.spacing(1),
			width: "100vw",
			marginTop: theme.spacing(8),
		},
	},
	limitedName: {
		textOverflow: "ellipsis",
		whiteSpace: "nowrap",
		overflow: "hidden",
		maxWidth: (props: UseCustomStylesProps) => `${props.limitedNameWidth || 200}px`,
	},
}))

export default useCustomStyles
