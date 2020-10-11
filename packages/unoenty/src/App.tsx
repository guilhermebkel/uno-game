import React, { ReactElement } from "react"
import { Container } from "@material-ui/core"

import { Disconnected } from "@/components"
import Routes from "@/routes"

import SocketProvider from "@/store/Socket"

const App = (): ReactElement => {
	return (
		<SocketProvider>
			<Container maxWidth="xl">
				<Routes />
				<Disconnected />
			</Container>
		</SocketProvider>
	)
}

export default App
