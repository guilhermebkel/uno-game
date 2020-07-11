import React, { useState } from "react"
import { Grid } from "@material-ui/core"

import useDidMount from "./hooks/useDidMount"

import Routes from "./routes"

import client, { connectSocket } from "./services/socket"
import { SocketState } from "./store/socket"

import { Header, Loading } from "./components"

const App = () => {
	const [loading, setLoading] = useState(true)

	const connect = async () => {
		await connectSocket()

		setLoading(false)
	}

	useDidMount(() => {
		connect()
	})

	return (
		<SocketState.Provider value={{ io: client }}>
			<Grid container direction="column">
				<Loading loading={loading}>
					<Header />
					<Routes />
				</Loading>
			</Grid>
		</SocketState.Provider>
	)
}

export default App
