import React, { useState } from "react"
import { Grid, Button } from "@material-ui/core"
import { DndProvider } from "react-dnd"
import { HTML5Backend } from "react-dnd-html5-backend"
import { TouchBackend } from "react-dnd-touch-backend"

import { useSocketStore } from "../../store/Socket"

import useDidMount from "../../hooks/useDidMount"

import { DeviceUtil } from "../../utils/Device"

import CardStack from "./CardStack"
import CardDeck from "./CardDeck"

import { Game } from "../../protocols/Game"
import { PlayerData } from "../../protocols/Player"

const Table = () => {
	const socketStore = useSocketStore()

	const [loadingStartGame, setLoadingStartGame] = useState(true)

	const getCurrentPlayer = () => {
		const playerId = socketStore.playerId

		const player = socketStore?.game?.players?.find(player => player.id === playerId)

		return (player || {}) as PlayerData
	}

	const buyCard = () => {
		socketStore.io.emit("BuyCard", socketStore?.game?.id)
	}

	const onDrop = (cardId: number) => {
		socketStore.io.emit("PutCard", socketStore?.game?.id, cardId)
	}

	const startGame = async () => {
		if (socketStore?.game && socketStore?.game?.availableCards?.length === 0) {
			socketStore.io.emit("StartGame", socketStore?.game?.id)

			const game = await new Promise<Game>(resolve => {
				socketStore.io.on("GameStarted", (game: Game) => {
					resolve(game)
				})
			})

			socketStore.set({ game })
		}

		setLoadingStartGame(false)
	}

	useDidMount(() => {
		startGame()
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
				<Grid container>
					<Grid container>
						<Grid item xs={1}></Grid>
						<Grid item xs={10}>
							<Grid container justify="center" alignItems="center" style={{ backgroundColor: "blue" }}>
								
							</Grid>
						</Grid>
						<Grid item xs={1}></Grid>
					</Grid>
					<Grid container>
						<Grid item xs={1}>
							<Grid container justify="center" alignItems="center" style={{ backgroundColor: "red" }}>
	
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
							<Grid container justify="center" alignItems="center" style={{ backgroundColor: "yellow" }}>
								<Button color="primary" variant="contained" onClick={buyCard}>BUY CARD</Button>
							</Grid>
						</Grid>
					</Grid>
					<Grid container>
						<Grid item xs={1}></Grid>
						<Grid item xs={10}>
							<Grid container justify="center" alignItems="center" style={{ backgroundColor: "black" }}>
								<CardDeck
									cards={getCurrentPlayer()?.handCards as any}
									player={getCurrentPlayer() as any}
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
