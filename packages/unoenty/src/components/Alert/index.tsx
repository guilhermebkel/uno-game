import React, { useState } from "react"
import {
	Button,
	Dialog,
	DialogActions,
	DialogContent,
	DialogContentText,
	DialogTitle,
	ThemeProvider,
} from "@material-ui/core"

import Node from "@/utils/node"

import { Divider } from "@/components"

import theme from "@/styles/theme"

import "@/components/Alert/icons.scss"

import useStyles from "@/components/Alert/styles"

const icons = {
	success: (
		<div className="sa">
			<div className="sa-success">
				<div className="sa-success-tip"></div>
				<div className="sa-success-long"></div>
				<div className="sa-success-placeholder"></div>
				<div className="sa-success-fix"></div>
			</div>
		</div>
	),
	error: (
		<div className="sa">
			<div className="sa-error">
				<div className="sa-error-x">
					<div className="sa-error-left"></div>
					<div className="sa-error-right"></div>
				</div>
				<div className="sa-error-placeholder"></div>
				<div className="sa-error-fix"></div>
			</div>
		</div>
	),
	warning: (
		<div className="sa">
			<div className="sa-warning">
				<div className="sa-warning-body"></div>
				<div className="sa-warning-dot"></div>
			</div>
		</div>
	),
}

type AlertProps = {
	title: string
	message: string | React.ReactNode
	customButtons?: JSX.Element[]
	closeButtonText?: string
	onClose?: () => void
	closable?: boolean
}

type AlertType = {
	success: (props: AlertProps) => void
	warning: (props: AlertProps) => void
	error: (props: AlertProps) => void
	close: () => void
}

const Alert: AlertType & React.FC<AlertProps & { type: keyof Omit<AlertType, "close"> }> = (props) => {
	const {
		type,
		message,
		title,
		onClose,
		customButtons,
		closeButtonText,
		closable,
	} = props

	const [visible, setVisible] = useState(true)

	const classes = useStyles()

	const handleClose = () => {
		if (closable !== false) {
			if (onClose) {
				onClose()
			}

			setVisible(false)
		}
	}

	return (
		<ThemeProvider theme={theme}>
			<Dialog
				open={visible}
				onClose={handleClose}
				fullWidth={true}
				className={classes.dialog}
			>
				<DialogTitle className={classes.title}>{title}</DialogTitle>
				<DialogContent dividers className={classes.content}>
					{icons[type]}
					<DialogContentText color="textPrimary">
						{message}
					</DialogContentText>
				</DialogContent>
				{(customButtons?.length || closable !== false) && (
					<DialogActions className={classes.footer}>
						{customButtons?.map((customButton, index) => (
							<React.Fragment key={index}>
								{customButton}

								<Divider orientation="horizontal" size={1} />
							</React.Fragment>
						))}
						{closable !== false && (
							<Button onClick={handleClose} fullWidth={true}>
								{closeButtonText || "OK"}
							</Button>
						)}
					</DialogActions>
				)}
			</Dialog>
		</ThemeProvider>
	)
}

Alert.success = (props: AlertProps) => {
	return Node.renderComponent(
		"alert",
		<Alert type="success" {...props} />,
	)
}

Alert.error = (props: AlertProps) => {
	return Node.renderComponent(
		"alert",
		<Alert type="error" {...props} />,
	)
}

Alert.warning = (props: AlertProps) => {
	return Node.renderComponent(
		"alert",
		<Alert type="warning" {...props} />,
	)
}

Alert.close = () => Node.unmountComponent("alert")

export default Alert
