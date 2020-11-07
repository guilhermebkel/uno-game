import React, { useState } from "react"
import { Dialog, Grid, ButtonBase, ThemeProvider } from "@material-ui/core"

import { Divider } from "@/components"

import NodeUtil from "@/utils/node"

import { CardColors } from "@uno-game/protocols"

import useStyles from "@/pages/Table/ChooseColorModal/styles"

import chooseColorTextImg from "@/assets/texts/choose-a-color.png"

import theme from "@/styles/theme"

type ColoredButtonMap = {
	[key in CardColors]?: {
		color: string
		borderColor: string
	}
}

const coloredButtonMap: ColoredButtonMap = {
	yellow: {
		color: "#FFE600",
		borderColor: "#FFEE51",
	},
	red: {
		color: "#FF0000",
		borderColor: "#FF2C2C",
	},
	blue: {
		color: "#009DF5",
		borderColor: "#1AACFF",
	},
	green: {
		color: "#33ED00",
		borderColor: "#55FF26",
	},
}

type ChooseColorModalType = {
	open: () => Promise<CardColors>
}

type ChooseColorModalProps = {
	callback: (color: CardColors) => void
}

const ChooseColorModal: ChooseColorModalType & React.FC<ChooseColorModalProps> = (props) => {
	const classes = useStyles()

	const { callback } = props

	const [opened, setOpened] = useState(true)

	const handleClose = (color: CardColors) => {
		callback(color)
		setOpened(false)
	}

	return (
		<ThemeProvider theme={theme}>
			<Dialog
				open={opened}
				className={classes.dialog}
				PaperProps={{
					className: classes.dialogPaper,
				}}
			>
				<Grid
					container
					alignItems="center"
					justify="center"
					direction="column"
					className={classes.dialogContainer}
				>
					<Grid
						container
						justify="center"
					>
						<img
							src={chooseColorTextImg}
							alt="Choose a color!"
							className={classes.chooseColorImg}
						/>
					</Grid>

					<Divider orientation="horizontal" size={5} />

					<Grid
						container
						alignItems="center"
						justify="center"
						wrap="wrap"
						className={classes.colorSelectorContainer}
					>
						{Object.entries(coloredButtonMap)
							.map(([colorName, info]) => (
								<Grid
									className={classes.colorSelectorButton}
									component={ButtonBase}
									style={{
										backgroundColor: info?.color,
										border: `8px solid ${info?.borderColor}`,
										boxShadow: `0 0 16px ${info?.color}`,
									}}
									onClick={() => handleClose(colorName as CardColors)}
								/>
							))}
					</Grid>
				</Grid>
			</Dialog>
		</ThemeProvider>
	)
}

ChooseColorModal.open = (): Promise<CardColors> => new Promise((resolve) => NodeUtil.renderComponent(
	"choose-color-modal",
	<ChooseColorModal
		callback={resolve}
	/>,
))

export default ChooseColorModal
