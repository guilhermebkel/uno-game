import React, { useState, ReactElement } from "react"
import { Dialog, DialogTitle, Grid, ButtonBase } from "@material-ui/core"
import { Skeleton } from "@material-ui/lab"

import { Divider } from "@/components"

import NodeUtil from "@/utils/node"

import { CardColors } from "@uno-game/protocols"

import useStyles from "@/pages/Table/ChangeColorModal/styles"

const COLORS: Array<CardColors> = ["red", "blue", "green", "yellow"]

type ChangeColorModalProps = {
	callback: (color: CardColors) => void
}

const ChangeColorModal = (props: ChangeColorModalProps): ReactElement => {
	const classes = useStyles()

	const { callback } = props

	const [opened, setOpened] = useState(true)

	const handleClose = (color: CardColors) => {
		callback(color)
		setOpened(false)
	}

	return (
		<Dialog
			open={opened}
			className={classes.dialog}
			PaperProps={{
				className: classes.dialogPaper,
			}}
		>
			<DialogTitle>
				Select a color
			</DialogTitle>

			<Divider size={3} />

			<Grid container spacing={2}>
				{COLORS.map((color, index) => (
					<Grid key={index} item xs={6} sm={6} md={6} lg={6} xl={6}>
						<Grid container justify="center">
							<Skeleton
								component={ButtonBase}
								animation={false}
								variant="circle"
								width={36}
								height={36}
								style={{ backgroundColor: color }}
								onClick={() => handleClose(color)}
							/>
						</Grid>
					</Grid>
				))}
			</Grid>

			<Divider size={3} />
		</Dialog>
	)
}

ChangeColorModal.open = (): Promise<CardColors> => new Promise((resolve) => NodeUtil.renderComponent(
	"change-color-modal",
	<ChangeColorModal
		callback={resolve}
	/>,
))

export default ChangeColorModal
