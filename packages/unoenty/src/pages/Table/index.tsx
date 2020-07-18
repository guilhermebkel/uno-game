import React, { useState } from "react"
import { Grid, Button } from "@material-ui/core"
import { useParams } from "react-router-dom"
import { DndProvider } from "react-dnd"
import { HTML5Backend } from "react-dnd-html5-backend"
import { TouchBackend } from "react-dnd-touch-backend"

import { useSocketStore } from "@unoenty/store/Socket"

import useDidMount from "@unoenty/hooks/useDidMount"
import useSocket from "@unoenty/hooks/useSocket"

import { DeviceUtil } from "@unoenty/utils/Device"

import CardStack from "@unoenty/pages/Table/CardStack"
import CardDeck from "@unoenty/pages/Table/CardDeck"

const Table = () => {
	const { gameId } = useParams()

	const socketStore = useSocketStore()
	const socket = useSocket()

	const [loadingStartGame, setLoadingStartGame] = useState(true)

	const buyCard = () => {
		socket.buyCard(gameId)
	}

	const onDrop = (cardId: string) => {
		socket.putCard(gameId, cardId)
	}

	const joinGame = async () => {
		await socket.joinGame(gameId)

		setLoadingStartGame(false)
	}

	useDidMount(() => {
		joinGame()
	})

	if (loadingStartGame) {
		return <h1>Loading Start Game...</h1>
	} else {
		return (
			<DndProvider
				backend={DeviceUtil.isTouchDevice ? (
					TouchBackend
				) : (
					HTML5Backend
				)}
			>
				<Grid container style={{ height: "100%" }}>
					<Grid container>
						<Grid item xs={1}>
							<Button color="primary" variant="contained" onClick={buyCard}>BUY CARD</Button>
						</Grid>
						<Grid item xs={10}>
							<Grid container justify="center" alignItems="center" style={{ transform: "rotate(180deg)" }}>
								<CardDeck
									cards={socket.otherPlayers?.[1]?.handCards as any}
									player={socket.otherPlayers?.[1] as any}
									hideCards
								/>
							</Grid>
						</Grid>
						<Grid item xs={1}></Grid>
					</Grid>
					<Grid container alignItems="center">
						<Grid item xs={1}>
							<Grid container justify="center" alignItems="center" style={{ transform: "rotate(90deg)" }}>
								<CardDeck
									cards={socket.otherPlayers?.[0]?.handCards as any}
									player={socket.otherPlayers?.[0] as any}
									hideCards
								/>
							</Grid>
						</Grid>
						<Grid item xs={10}>
							<Grid container justify="center" alignItems="center" style={{ height: "100%" }}>
								<CardStack
									cards={socketStore?.game?.usedCards as any}
									onDrop={onDrop}
								/>
							</Grid>
						</Grid>
						<Grid item xs={1}>
							<Grid container justify="center" alignItems="center" style={{ transform: "rotate3d(1, 1, 0, 180deg)" }}>
								<CardDeck
									cards={socket.otherPlayers?.[2]?.handCards as any}
									player={socket.otherPlayers?.[2] as any}
									hideCards
								/>
							</Grid>
						</Grid>
					</Grid>
					<Grid container alignItems="center">
						<Grid item xs={1}></Grid>
						<Grid item xs={10}>
							<Grid container justify="center" alignItems="center">
								<CardDeck
									cards={socket.currentPlayer?.handCards as any}
									player={socket.currentPlayer as any}
								/>
							</Grid>
						</Grid>
						<Grid item xs={1}></Grid>
					</Grid>
				</Grid>
			</DndProvider>
		)
	}
}

export default Table
