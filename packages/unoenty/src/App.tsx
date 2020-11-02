import React, { ReactElement } from "react"
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
	appContainer: {
		overflowX: "hidden",
		backgroundColor: colors.grayScale[1],
		height: "100%",
	},
	socketContainer: {
		height: "100%",
		flex: 1,
	},
}))

const App = (): ReactElement => {
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
						className={classes.routesContainer}
					>
						<Grid item sm={12} md={12} lg={12} xl={12}>
							<Routes />
						</Grid>
					</Grid>
				</Grid>
			</Grid>
		</SocketProvider>
	)
}

export default App
