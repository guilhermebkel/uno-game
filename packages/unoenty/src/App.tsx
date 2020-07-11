import React, { useState } from "react"
import { Grid } from "@material-ui/core"

import useDidMount from "./hooks/useDidMount"

import Routes from "./routes"

import client, { connectSocket } from "./services/socket"
import { SocketStore, ContextData } from "./store/socket"

import { Header, Loading } from "./components"

const App = () => {
	const [loading, setLoading] = useState(true)
	const [socketData, setSocketData] = useState<ContextData>({} as ContextData)

	const connect = async () => {
		const playerId = await connectSocket()

		setSocketData({
			io: client,
			playerId
		})

		setLoading(false)
	}

	useDidMount(() => {
		connect()
	})

	return (
		<SocketStore.Provider value={socketData}>
			<Loading loading={loading}>
				<Grid container direction="column">
					<Header />
					<Routes />
				</Grid>
			</Loading>
		</SocketStore.Provider>
	)
}

export default App
