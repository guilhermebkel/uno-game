import React, { useState, ReactElement } from "react"
import { Grid, Typography } from "@material-ui/core"

import useStyles from "@/components/NotificationBar/styles"

import { useSocketStore } from "@/store/Socket"

const Notificationbar = (): ReactElement => {
	const { io } = useSocketStore()

	const [opened, setOpened] = useState(false)

	const classes = useStyles({ opened })

	io.on("connect", () => {
		setOpened(false)
	})

	io.on("disconnect", () => {
		setOpened(true)
	})

	return (
		<Grid
			container
			alignItems="center"
			justify="center"
			className={classes.container}
		>
			<Typography
				variant="h2"
				color="textSecondary"
				className={classes.text}
			>
				Your disconnected. Reconnecting...
			</Typography>
		</Grid>
	)
}

export default Notificationbar
