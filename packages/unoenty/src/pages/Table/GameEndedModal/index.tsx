import React, { useState } from "react"
import {
	Dialog,
	Grid,
	Typography,
	ThemeProvider,
	Button,
} from "@material-ui/core"

import {
	Divider,
	Avatar,
} from "@/components"

import NodeUtil from "@/utils/node"

import useStyles from "@/pages/Table/GameEndedModal/styles"
import useCustomStyles from "@/styles/custom"

import trophyImg from "@/assets/trophy.png"
import wonTextImg from "@/assets/texts/won.png"

import theme from "@/styles/theme"

type GameEndedModalType = {
	open: (props: GameEndedModalProps) => void
	close: () => void
}

type GameEndedModalProps = {
	winnerPlayerName: string
	isCurrentPlayer?: boolean
	onPlayAgain?: (() => void) | (() => Promise<void>)
	onQuit?: (() => void) | (() => Promise<void>)
	isWaitingForNewGame?: boolean
}

const GameEndedModal: GameEndedModalType & React.FC<GameEndedModalProps> = (props) => {
	const classes = useStyles()
	const customClasses = useCustomStyles({})

	const {
		winnerPlayerName,
		isCurrentPlayer,
		onPlayAgain,
		onQuit,
		isWaitingForNewGame,
	} = props

	const [loadingPlayAgain, setLoadingPlayAgain] = useState(isWaitingForNewGame)

	const handlePlayAgain = () => {
		if (onPlayAgain) {
			onPlayAgain()
		}

		setLoadingPlayAgain(true)
	}

	const handleQuit = () => {
		if (onQuit) {
			onQuit()
		}
	}

	return (
		<ThemeProvider theme={theme}>
			<Dialog
				open
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
							src={trophyImg}
							alt="Trophy"
							className={classes.trophyImage}
						/>
					</Grid>

					<Divider orientation="horizontal" size={5} />

					<Grid
						container
						alignItems="center"
						justify="space-between"
						className={classes.winnerInfoContainer}
					>
						<Grid
							container
							style={{ flex: 1 }}
						>
							<Avatar
								name={winnerPlayerName}
								size="small"
							/>

							<Divider orientation="vertical" size={2} />

							<Grid
								container
								direction="column"
								justify="center"
								style={{ flex: 1 }}
							>
								<Grid
									container
									alignItems="center"
								>
									<Typography
										variant="h3"
										className={`${classes.title} ${customClasses.limitedName}`}
									>
										{winnerPlayerName}
									</Typography>
								</Grid>

								{isCurrentPlayer && (
									<Typography
										variant="h2"
										className={classes.description}
									>
										(You)
									</Typography>
								)}
							</Grid>
						</Grid>

						<img
							src={wonTextImg}
							alt="Won!"
							className={classes.wonImage}
						/>
					</Grid>

					<Divider orientation="horizontal" size={5} />

					<Button
						variant="contained"
						onClick={() => !loadingPlayAgain && handlePlayAgain()}
						disabled={loadingPlayAgain}
						className={classes.playAgainButton}
					>
						{loadingPlayAgain ? "WAITING..." : "PLAY AGAIN"}
					</Button>

					<Divider orientation="horizontal" size={1} />

					<Button
						variant="text"
						onClick={handleQuit}
						className={classes.quitButton}
					>
						QUIT
					</Button>
				</Grid>
			</Dialog>
		</ThemeProvider>
	)
}

GameEndedModal.open = (props): void => {
	NodeUtil.renderComponent(
		"game-ended-modal",
		<GameEndedModal
			{...props}
		/>,
	)
}

GameEndedModal.close = () => {
	NodeUtil.unmountComponent("game-ended-modal")
}

export default GameEndedModal
