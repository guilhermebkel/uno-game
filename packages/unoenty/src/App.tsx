import React from "react"
import { Grid } from "@material-ui/core"

import Routes from "./routes"

import SocketProvider from "./store/Socket"

import { Header } from "./components"

const App = () => {
	return (
		<SocketProvider>
			<Grid container direction="column">
				<Header />
				<Routes />
			</Grid>
		</SocketProvider>
	)
}

export default App
