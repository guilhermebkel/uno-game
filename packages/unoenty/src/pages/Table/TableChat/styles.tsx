import { makeStyles } from "@material-ui/core"

const useStyles = makeStyles(theme => ({
	openChatButton: {
		position: "fixed",
		top: theme.spacing(2),
		right: theme.spacing(2)
	},
	drawerPaper: {
		maxWidth: 400,
		width: "100%",
		backgroundColor: "#252d33"
	},
	drawerHeaderContainer: {
		backgroundColor: "#FFFFFF",
		height: theme.spacing(8)
	},
	drawerBodyContainer: {
		color: "#FFFFFF",
		padding: theme.spacing(2),
		height: `calc(100% - ${theme.spacing(18)}px)`,
		overflowY: "scroll"
	},
	drawerFooterContainer: {
		padding: theme.spacing(2),
		backgroundColor: "#FFFFFF",
		position: "absolute",
		bottom: 0,
		height: theme.spacing(10)
	},
	messageInput: {
		flex: 1
	}
}))

export default useStyles
