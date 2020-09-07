import { makeStyles } from "@material-ui/core"

const useStyles = makeStyles(theme => ({
	openChatButtonContainer: {
		position: "fixed",
		top: theme.spacing(2),
		right: theme.spacing(2),
		width: 56,
		height: 56,
		zIndex: 99999
	},
	drawer: {
		zIndex: "999999 !important" as any
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
		overflowY: "scroll",
		"&::-webkit-scrollbar": {
			width: "10px"
		},
		"&::-webkit-scrollbar-thumb": {
			backgroundColor: "rgba(255, 255, 255, 0)",
			borderRadius: "100px"
		},
		"&:hover::-webkit-scrollbar-thumb": {
			backgroundColor: "rgba(255, 255, 255, 0.25)"
		}
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
