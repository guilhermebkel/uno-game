import React, { useState, ReactElement } from "react"
import { Typography } from "@material-ui/core"

import useSocket from "@/hooks/useSocket"
import useDidMount from "@/hooks/useDidMount"

import useStyles from "@/pages/Table/Latency/styles"

const Latency = (): ReactElement => {
	const classes = useStyles()
	const socket = useSocket()

	const [latency, setLatency] = useState(0)

	const handlePong = (latencyResponse: number) => {
		setLatency(latencyResponse)
	}

	const onPong = () => {
		socket.onPong(handlePong)
	}

	useDidMount(() => {
		onPong()
	})

	return (
		<Typography className={classes.latencyText}>
			{latency}ms
		</Typography>
	)
}

export default Latency
