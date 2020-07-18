import React from "react"
import { Container } from "@material-ui/core"

import Routes from "@unoenty/routes"

import SocketProvider from "@unoenty/store/Socket"

const App = () => {
	return (
		<SocketProvider>
			<Container maxWidth={false}>
				<Routes />
			</Container>
		</SocketProvider>
	)
}

export default App
