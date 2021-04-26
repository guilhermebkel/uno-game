import React, { useState } from "react"
import { Grid, Typography, Snackbar } from "@material-ui/core"
import Alert from "@material-ui/lab/Alert"

import useStyles from "@/components/NotificationBar/styles"

import SocketService from "@/services/socket"

import Device from "@/utils/device"

const NotificationBar: React.FC = () => {
	const [opened, setOpened] = useState(false)

	const classes = useStyles({ opened })

	SocketService.on("connect", () => {
		setOpened(false)
	})

	SocketService.on("disconnect", () => {
		setOpened(true)
	})

	const message = "Your disconnected. Reconnecting..."

	if (Device.isMobile) {
		return (
			<Snackbar
				open={opened}
				anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
			>
				<Alert severity="error">
					{message}
				</Alert>
			</Snackbar>
		)
	}

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
				{message}
			</Typography>
		</Grid>
	)
}

export default NotificationBar
