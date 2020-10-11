import React, { useState, ReactElement } from "react"

import { Snackbar, IconButton } from "@material-ui/core"
import { Alert } from "@material-ui/lab"
import { Close } from "@material-ui/icons"

import { useSocketStore } from "@/store/Socket"

const Disconnected = (): ReactElement => {
	const { io } = useSocketStore()

	const [open, setOpen] = useState(false)

	io.on("connect", () => {
		setOpen(false)
	})

	io.on("disconnect", () => {
		setOpen(true)
	})

	const actions = (
		<IconButton aria-label="close" color="inherit" onClick={() => setOpen(false)}>
			<Close />
		</IconButton>
	)

	return (
		<Snackbar
			anchorOrigin={{
				vertical: "bottom",
				horizontal: "left",
			}}
			open={open}
			onClose={() => setOpen(false)}
			action={actions}
		>
			<Alert severity="error">Disconnected</Alert>
		</Snackbar>
	)
}

export default Disconnected
