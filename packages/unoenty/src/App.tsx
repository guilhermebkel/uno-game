import React, { ReactElement } from "react"
import { Grid, makeStyles } from "@material-ui/core"

import { Disconnected, Menu } from "@/components"
import Routes from "@/routes"

import SocketProvider from "@/store/Socket"

const useStyles = makeStyles({
	routesContainer: {
		flex: 1,
		width: "100%",
		height: "100%",
	},
	appContainer: {
		overflowX: "hidden",
	},
})

const App = (): ReactElement => {
	const classes = useStyles()

	return (
		<SocketProvider>
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

				<Disconnected />
			</Grid>
		</SocketProvider>
	)
}

export default App
