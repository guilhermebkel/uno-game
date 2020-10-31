import React, { ReactElement } from "react"
import { Container } from "@material-ui/core"

import { Disconnected, Menu } from "@/components"
import Routes from "@/routes"

import SocketProvider from "@/store/Socket"

const App = (): ReactElement => (
	<SocketProvider>
		<Container maxWidth="xl">
			<Menu />
			<Routes />
			<Disconnected />
		</Container>
	</SocketProvider>
)

export default App
