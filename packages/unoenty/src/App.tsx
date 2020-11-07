import React from "react"
import { Grid, makeStyles } from "@material-ui/core"

import { NotificationBar, Menu } from "@/components"
import Routes from "@/routes"

import SocketProvider from "@/store/Socket"

import colors from "@/styles/colors"

const useStyles = makeStyles(theme => ({
	routesContainer: {
		flex: 1,
		width: "100%",
		height: "100%",
		backgroundColor: colors.palette.blue1,
	},
	routesContent: {
		width: "100%",
	},
	appContainer: {
		overflowX: "hidden",
		backgroundColor: colors.grayScale[1],
		height: "100%",
		flex: 1,
	},
	socketContainer: {
		height: "100%",
		flex: 1,
	},
}))

const App: React.FC = () => {
	const classes = useStyles()

	return (
		<SocketProvider>
			<Grid
				container
				direction="column"
				className={classes.socketContainer}
			>
				<NotificationBar />

				<Grid
					container
					className={classes.appContainer}
				>
					<Menu />

					<Grid
						container
						direction="column"
						className={classes.routesContainer}
					>
						<Routes />
					</Grid>
				</Grid>
			</Grid>
		</SocketProvider>
	)
}

export default App
