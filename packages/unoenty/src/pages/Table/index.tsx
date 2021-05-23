import React, { useState } from "react"
import { Grid } from "@material-ui/core"
import { useParams, useHistory } from "react-router-dom"
import { DndProvider } from "react-dnd"
import { HTML5Backend } from "react-dnd-html5-backend"
import { TouchBackend } from "react-dnd-touch-backend"

import { useSocketStore } from "@/store/Socket"

import useStyles from "@/pages/Table/styles"

import { dispatchEvent } from "@/services/event"

import useDidMount from "@/hooks/useDidMount"
import useSocket from "@/hooks/useSocket"

import {
	LoadingComponent,
	CloseGamePrompt,
} from "@/components"

import Device from "@/utils/device"

import CardStack from "@/pages/Table/CardStack"
import CardDeck from "@/pages/Table/CardDeck"
import CardDeckPlaceholder from "@/pages/Table/CardDeckPlaceholder"
import CustomCardDragPreview from "@/pages/Table/CustomCardDragPreview"
import TableChat from "@/pages/Table/TableChat"
import GameEndedModal from "@/pages/Table/GameEndedModal"

import CardProvider from "@/store/Card"

import { CardData, Game, PlayerWonEventData } from "@uno-game/protocols"
import SocketService from "@/services/socket"

const Table: React.FC = () => {
	const { gameId } = useParams<{ gameId: string }>()
	const history = useHistory()

	const socketStore = useSocketStore()
	const socket = useSocket()
	const classes = useStyles()

	const [loadingTable, setLoadingTable] = useState(true)

	const toggleRetry = () => {
		socket.toggleReady(gameId)
		socket.toggleOnlineStatus(gameId)
	}

	const openGameEndedModal = (
		winnerPlayerName: string,
		isCurrentPlayer: boolean,
		isWaitingForNewGame: boolean,
	) => {
		GameEndedModal.open({
			winnerPlayerName,
			isCurrentPlayer,
			isWaitingForNewGame,
			onPlayAgain: () => {
				toggleRetry()
			},
			onQuit: () => {
				window.location.href = "/"
			},
		})
	}

	const joinGame = async () => {
		const game = await socket.joinGame(gameId)

		const currentPlayer = socket.getCurrentPlayer(game.players)
		const winnerPlayer = socket.getWinner(game)

		const playerWinnerName = winnerPlayer?.name as string
		const isCurrentPlayer = winnerPlayer?.id === currentPlayer?.id

		if (game.status === "ended") {
			if (!currentPlayer || currentPlayer?.ready === true) {
				openGameEndedModal(
					playerWinnerName,
					isCurrentPlayer,
					true,
				)
			} else if (currentPlayer?.ready === false) {
				openGameEndedModal(
					playerWinnerName,
					isCurrentPlayer,
					false,
				)
			} else {
				history.push("/")
			}
		}

		setLoadingTable(false)
	}

	const onPlayerWon = () => {
		SocketService.on<PlayerWonEventData>("PlayerWon", ({ player }) => {
			openGameEndedModal(
				player.name,
				player.id === socket?.currentPlayer?.id,
				false,
			)
		})
	}

	const onGameStart = () => {
		socket.onGameStart(() => {
			/**
			 * Workaround to make sure the game is reloaded correctly since sometimes it
			 * happens to the global game state to be broken after starting the game while
			 * interacting with 'LoadingScene' and 'GameEndedModal'
			 */
			window.location.reload()
		})
	}

	const setupTable = async () => {
		dispatchEvent("GameTableOpened")

		await joinGame()
		onPlayerWon()
		onGameStart()
	}

	const onReconnect = () => {
		socket.onReconnect(() => setupTable())
	}

	useDidMount(() => {
		setupTable()
		onReconnect()
	})

	return (
		<LoadingComponent loading={loadingTable}>
			<>
				<CloseGamePrompt />

				<TableChat />

				<CardProvider>
					<DndProvider
						backend={Device.isTouchDevice ? (
							TouchBackend
						) : (
							HTML5Backend
						)}
					>
						<Grid
							container
							className={classes.tableContainer}
						>
							<Grid
								container
								justify="space-between"
								className={classes.topCardStackContainer}
							>
								<Grid
									item
									xs={2}
									className={classes.cardDeckPlaceholder}
								>
									<CardDeckPlaceholder
										position="topLeft"
										player={socket.otherPlayers?.[1]}
									/>
								</Grid>
								<Grid
									item
									xs={8}
									className={classes.cardDeckPlaceholder}
								>
									<Grid container justify="center" alignItems="center">
										<CardDeckPlaceholder
											position="top"
											player={socket.otherPlayers?.[2]}
										/>
									</Grid>
								</Grid>
								<Grid
									item
									xs={2}
									className={classes.cardDeckPlaceholder}
								>
									<CardDeckPlaceholder
										position="topRight"
										player={socket.otherPlayers?.[3]}
									/>
								</Grid>
							</Grid>
							<Grid
								container
								alignItems="flex-start"
								justify="space-between"
							>
								<Grid
									item
									xs={2}
									className={classes.cardDeckPlaceholder}
								>
									<Grid container justify="flex-start">
										<CardDeckPlaceholder
											position="left"
											player={socket.otherPlayers?.[0]}
										/>
									</Grid>
								</Grid>
								<Grid item xs={8}>
									<Grid container justify="center" alignItems="center">
										<CardStack
											cards={socketStore?.game?.usedCards as CardData[]}
											game={socketStore.game as Game}
										/>
									</Grid>
								</Grid>
								<Grid
									item
									xs={2}
									className={classes.cardDeckPlaceholder}
								>
									<Grid container justify="flex-end">
										<CardDeckPlaceholder
											position="right"
											player={socket.otherPlayers?.[4]}
										/>
									</Grid>
								</Grid>
							</Grid>
							<Grid container alignItems="center">
								<Grid container justify="center" style={{ height: "100%" }}>
									{socket?.currentPlayer ? (
										<>
											<CustomCardDragPreview />

											<CardDeck
												cards={socket.currentPlayer?.handCards}
												player={socket.currentPlayer}
											/>
										</>
									) : (
										<CardDeckPlaceholder
											position="bottom"
											player={socket.otherPlayers?.[5]}
										/>
									)}
								</Grid>
							</Grid>
						</Grid>
					</DndProvider>
				</CardProvider>
			</>
		</LoadingComponent>
	)
}

export default Table
