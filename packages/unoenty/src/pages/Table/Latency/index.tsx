import React, { useState } from "react"
import { Typography } from "@material-ui/core"

import useSocket from "@/hooks/useSocket"
import useDidMount from "@/hooks/useDidMount"

import useStyles from "./styles"

const Latency = () => {
	const classes = useStyles()
	const socket = useSocket()

	const [latency, setLatency] = useState(0)

	const handlePong = (latencyResult: number) => {
		setLatency(latencyResult)
	}

	useDidMount(() => {
		socket.onPong(handlePong)
	})

	return (
		<Typography className={classes.latencyText}>
			{latency}ms
		</Typography>
	)
}

export default Latency
