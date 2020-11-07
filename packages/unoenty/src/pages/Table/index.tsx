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
	LoadingScene,
} from "@/components"

import Device from "@/utils/device"

import CardStack from "@/pages/Table/CardStack"
import CardDeck from "@/pages/Table/CardDeck"
import CardDeckPlaceholder from "@/pages/Table/CardDeckPlaceholder"
import CustomCardDragPreview from "@/pages/Table/CustomCardDragPreview"
import TableChat from "@/pages/Table/TableChat"
import GameEndedModal from "@/pages/Table/GameEndedModal"

import CardProvider from "@/store/Card"

import { CardColors, CardData, Game } from "@uno-game/protocols"

const Table: React.FC = () => {
	const { gameId } = useParams<{ gameId: string }>()
	const history = useHistory()

	const socketStore = useSocketStore()
	const socket = useSocket()
	const classes = useStyles()

	const [loadingTable, setLoadingTable] = useState(true)

	const onDrop = (cardIds: string[], selectedColor: CardColors) => {
		socket.putCard(gameId, cardIds, selectedColor)
	}

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

		const playerWinnerName = socket?.winner?.name as string
		const isCurrentPlayer = socket?.winner?.id === socket?.currentPlayer?.id

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
		socket.onPlayerWon((playerId, playerName: string) => {
			openGameEndedModal(
				playerName,
				playerId === socket?.currentPlayer?.id,
				false,
			)
		})
	}

	const onGameStart = () => {
		socket.onGameStart(() => {
			LoadingScene.run({
				onStart: () => {
					GameEndedModal.close()
				},
				duration: 2000,
			})
		})
	}

	const setupTable = () => {
		joinGame()
		onPlayerWon()
		onGameStart()

		dispatchEvent("GameTableOpened")
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
							<Grid container>
								<Grid item xs={2} className={classes.topCardStackContainer}>
									<CardDeckPlaceholder
										position="top"
										player={socket.otherPlayers?.[1]}
									/>
								</Grid>
								<Grid item xs={8} className={classes.topCardStackContainer}>
									<Grid container justify="center" alignItems="center">
										<CardDeckPlaceholder
											position="top"
											player={socket.otherPlayers?.[2]}
										/>
									</Grid>
								</Grid>
								<Grid item xs={2} className={classes.topCardStackContainer}>
									<CardDeckPlaceholder
										position="top"
										player={socket.otherPlayers?.[3]}
									/>
								</Grid>
							</Grid>
							<Grid container alignItems="center">
								<Grid item xs={2}>
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
											onDrop={onDrop}
										/>
									</Grid>
								</Grid>
								<Grid item xs={2}>
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
