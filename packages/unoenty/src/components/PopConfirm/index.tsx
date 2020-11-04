import React, { useState } from "react"
import {
	Button,
	Dialog,
	DialogTitle,
	DialogContent,
	DialogContentText,
	DialogActions,
	ThemeProvider,
} from "@material-ui/core"

import Node from "@/utils/node"

import theme from "@/styles/theme"

import useStyles from "@/components/PopConfirm/styles"

type PopConfirmProps = {
	title: string
	message: string
	onConfirm: () => void | (() => Promise<void>)
}

type PopConfirmType = {
	open: (props: PopConfirmProps) => void
}

const PopConfirm: PopConfirmType & React.FC<PopConfirmProps> = (props) => {
	const { title, message, onConfirm } = props

	const [visible, setVisible] = useState(true)

	const classes = useStyles()

	const handleClose = () => {
		setVisible(false)
	}

	const handleConfirm = () => {
		handleClose()

		onConfirm()
	}

	return (
		<ThemeProvider theme={theme}>
			<Dialog
				open={visible}
				onClose={handleClose}
				className={classes.dialog}
			>
				<DialogTitle>{title}</DialogTitle>

				<DialogContent>
					<DialogContentText color="textPrimary">
						{message}
					</DialogContentText>
				</DialogContent>

				<DialogActions>
					<Button
						onClick={handleClose}
						variant="text"
						color="primary"
						type="submit"
					>
						Cancel
					</Button>

					<Button
						onClick={handleConfirm}
						variant="contained"
						color="primary"
						type="submit"
					>
						Confirm
					</Button>
				</DialogActions>
			</Dialog>
		</ThemeProvider>
	)
}

PopConfirm.open = (props) => {
	Node.renderComponent(
		"pop-confirm",
		<PopConfirm {...props} />,
	)
}

export default PopConfirm
