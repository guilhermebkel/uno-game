import React, { useState } from "react"
import { Grid, Button, Typography } from "@material-ui/core"
import { useParams, useHistory } from "react-router-dom"
import { DndProvider } from "react-dnd"
import { HTML5Backend } from "react-dnd-html5-backend"
import { TouchBackend } from "react-dnd-touch-backend"

import { useSocketStore } from "@/store/Socket"

import useDidMount from "@/hooks/useDidMount"
import useSocket from "@/hooks/useSocket"

import { LoadingComponent, Alert } from "@/components"

import Device from "@/utils/device"

import CardStack from "@/pages/Table/CardStack"
import CardDeck from "@/pages/Table/CardDeck"
import CardDeckPlaceholder from "@/pages/Table/CardDeckPlaceholder"
import CustomCardDragPreview from "@/pages/Table/CustomCardDragPreview"

import CardProvider from "@/store/Card"

import TableSkeleton from "@/skeletons/Table"

const Table = () => {
	const { gameId } = useParams()
	const history = useHistory()

	const socketStore = useSocketStore()
	const socket = useSocket()

	const [loadingTable, setLoadingTable] = useState(true)

	const buyCard = () => {
		socket.buyCard(gameId)
	}

	const onDrop = (cardIds: string[]) => {
		socket.putCard(gameId, cardIds)
	}

	const toggleRetry = () => {
		socket.toggleReady(gameId)

		Alert.warning({
			title: "Waiting",
			message: "Waiting for other players to click on retry button...",
			closable: false
		})

		socket.onGameStart(() => {
			Alert.close()
		})
	}

	const joinGame = async () => {
		const game = await socket.joinGame(gameId)

		if (game.status === "ended") {
			history.push("/")
		}

		setLoadingTable(false)
	}

	const onPlayerWon = () => {
		socket.onPlayerWon((_, playerName: string) => {
			Alert.success({
				message: `${playerName} won the game!`,
				title: `${playerName} won!`,
				closeButtonText: "QUIT",
				onClose: () => {
					window.location.href = "/"
				},
				customButtons: [
					<Button
						fullWidth
						color="primary"
						variant="contained"
						onClick={toggleRetry}
						disabled={!socket?.currentPlayer}
					>
						{(!socket?.currentPlayer) ? (
							"READY (Waiting for other players)"
						) : (
							"READY?"
						)}
					</Button>
				]
			})
		})
	}

	useDidMount(() => {
		joinGame()
		onPlayerWon()
	})

	return (
		<LoadingComponent loading={loadingTable} customLoadingElement={<TableSkeleton />}>
			<CardProvider>
				<DndProvider
					backend={Device.isTouchDevice ? (
						TouchBackend
					) : (
						HTML5Backend
					)}
				>
					<Grid container style={{ height: "100%", overflow: "hidden", padding: "16px" }}>
						<Grid container>
							<Grid item xs={2}>
								{socket?.currentPlayer?.canBuyCard && (
									<Button
										color="primary"
										variant="contained"
										onClick={buyCard}
										fullWidth
									>
										BUY CARD
									</Button>
								)}
							</Grid>
							<Grid item xs={8}>
								<Grid container justify="center" alignItems="center">
									<CardDeckPlaceholder
										cards={socket.otherPlayers?.[1]?.handCards as any}
										player={socket.otherPlayers?.[1] as any}
										transform="rotate(180deg)"
									/>
								</Grid>
							</Grid>
							<Grid item xs={2}>
								<Typography
									variant="h1"
									align="center"
									style={{ color: socketStore?.game?.currentGameColor }}
								>
									{!Device.isMobile && "Round"} {socketStore?.game?.round}
								</Typography>
							</Grid>
						</Grid>
						<Grid container alignItems="center">
							<Grid item xs={2}>
								<Grid container justify="flex-start">
									<CardDeckPlaceholder
										cards={socket.otherPlayers?.[0]?.handCards as any}
										player={socket.otherPlayers?.[0] as any}
										transform="rotate(90deg)"
									/>
								</Grid>
							</Grid>
							<Grid item xs={8}>
								<Grid container justify="center" alignItems="center">
									<CardStack
										cards={socketStore?.game?.usedCards as any}
										onDrop={onDrop}
									/>
								</Grid>
							</Grid>
							<Grid item xs={2}>
								<Grid container justify="flex-end">
									<CardDeckPlaceholder
										cards={socket.otherPlayers?.[2]?.handCards as any}
										player={socket.otherPlayers?.[2] as any}
										transform="rotate3d(1, 1, 0, 180deg)"
									/>
								</Grid>
							</Grid>
						</Grid>
						<Grid container alignItems="center">
							<Grid item xs={1}></Grid>
							<Grid item xs={10}>
								<Grid container justify="center">
									{socket?.currentPlayer ? (
										<>
											<CustomCardDragPreview />
											<CardDeck
												cards={socket.currentPlayer?.handCards as any}
												player={socket.currentPlayer as any}
											/>
										</>
									) : (
										<CardDeckPlaceholder
											cards={socket.otherPlayers?.[3]?.handCards as any}
											player={socket.otherPlayers?.[3] as any}
										/>
									)}
								</Grid>
							</Grid>
							<Grid item xs={1}></Grid>
						</Grid>
					</Grid>
				</DndProvider>
			</CardProvider>
		</LoadingComponent>
	)
}

export default Table
