import React, { ReactElement } from "react"
import { Container } from "@material-ui/core"

import { Disconnected, Menu } from "@/components"
import Routes from "@/routes"

import SocketProvider from "@/store/Socket"

const App = (): ReactElement => (
	<SocketProvider>
		<Container
			maxWidth={false}
		>
			<Menu />
			<Routes />
			<Disconnected />
		</Container>
	</SocketProvider>
)

export default App
