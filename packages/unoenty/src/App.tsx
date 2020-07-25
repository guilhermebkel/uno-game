import React from "react"
import { Container } from "@material-ui/core"

import Routes from "@/routes"

import SocketProvider from "@/store/Socket"

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
