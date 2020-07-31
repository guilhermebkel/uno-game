import React, { useState } from "react"
import { Grid, Button, Typography } from "@material-ui/core"
import { useParams, useHistory } from "react-router-dom"
import { DndProvider } from "react-dnd"
import { HTML5Backend } from "react-dnd-html5-backend"
import { TouchBackend } from "react-dnd-touch-backend"

import { useSocketStore } from "@/store/Socket"

import useDidMount from "@/hooks/useDidMount"
import useSocket from "@/hooks/useSocket"
import useStyles from "./styles"

import { LoadingComponent, Alert, Divider } from "@/components"

import Device from "@/utils/device"

import CardStack from "@/pages/Table/CardStack"
import CardDeck from "@/pages/Table/CardDeck"
import CardDeckPlaceholder from "@/pages/Table/CardDeckPlaceholder"
import CustomCardDragPreview from "@/pages/Table/CustomCardDragPreview"

import CardProvider from "@/store/Card"

import TableSkeleton from "@/skeletons/Table"

import { CardColors } from "@uno-game/protocols"

const Table = () => {
	const classes = useStyles()

	const { gameId } = useParams()
	const history = useHistory()

	const socketStore = useSocketStore()
	const socket = useSocket()

	const [loadingTable, setLoadingTable] = useState(true)
	const [ping, setPing] = useState(0)

	const buyCard = () => {
		socket.buyCard(gameId)
	}

	const onDrop = (cardIds: string[], selectedColor: CardColors) => {
		socket.putCard(gameId, cardIds, selectedColor)
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
					>
						READY?
					</Button>
				]
			})
		})
	}

	const handlePong = (latency: number) => {
		setPing(latency)
	}

	useDidMount(() => {
		joinGame()
		onPlayerWon()
		socket.onPong(handlePong)
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
								<CardDeckPlaceholder
									cards={socket.otherPlayers?.[1]?.handCards as any}
									player={socket.otherPlayers?.[1] as any}
									transform="rotate(135deg)"
								/>
							</Grid>
							<Grid item xs={8}>
								<Grid container justify="center" alignItems="center">
									<CardDeckPlaceholder
										cards={socket.otherPlayers?.[2]?.handCards as any}
										player={socket.otherPlayers?.[2] as any}
										transform="rotate(180deg)"
									/>
								</Grid>
							</Grid>
							<Grid item xs={2}>
								<CardDeckPlaceholder
									cards={socket.otherPlayers?.[3]?.handCards as any}
									player={socket.otherPlayers?.[3] as any}
									transform="rotate3d(2.5, 1, 0, 180deg)"
								/>
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

									<Divider size={5} />

									{socket?.currentPlayer?.canBuyCard && (
										<Button
											color="primary"
											variant="contained"
											onClick={buyCard}
										>
											BUY CARD
										</Button>
									)}
								</Grid>
							</Grid>
							<Grid item xs={2}>
								<Grid container justify="flex-end">
									<CardDeckPlaceholder
										cards={socket.otherPlayers?.[4]?.handCards as any}
										player={socket.otherPlayers?.[4] as any}
										transform="rotate3d(1, 1, 0, 180deg)"
									/>
								</Grid>
							</Grid>
						</Grid>
						<Grid container alignItems="center">
							<Grid item xs={1}>
								<Typography className={classes.pingText}>
									{ping}ms
								</Typography>
							</Grid>
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
											cards={socket.otherPlayers?.[5]?.handCards as any}
											player={socket.otherPlayers?.[5] as any}
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
