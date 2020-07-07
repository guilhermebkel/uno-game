import React from "react"
import { Grid } from "@material-ui/core"

import Routes from "./routes"

import { Header } from "./components"

const App = () => (
	<Grid container direction="column">
		<Header />
		<Routes />
	</Grid>
)

export default App
