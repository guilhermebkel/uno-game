import React, { useState } from "react"
import { useParams, useHistory } from "react-router-dom"
import { Grid, Button } from "@material-ui/core"

import { useSocketStore } from "@unoenty/store/Socket"

import useDidMount from "@unoenty/hooks/useDidMount"
import useSocket from "@unoenty/hooks/useSocket"

import { Divider } from "@unoenty/components"

import PlayerItem from "@unoenty/pages/Room/PlayerItem"

const Room = () => {
	const [loadingRoom, setLoadingRoom] = useState(true)

	const socketStore = useSocketStore()

	const history = useHistory()

	const socket = useSocket()

	const { gameId } = useParams()

	const toggleReady = () => {
		socketStore.io.emit("ToggleReady", gameId)
	}

	const joinGame = async () => {
		await socket.joinGame(gameId)

		setLoadingRoom(false)
	}

	const handleStartGame = () => {
		socket.startGame(gameId)
	}

	const onGameStart = () => {
		socket.onGameStart(() => {
			history.push(`/game/${gameId}/table`)
		})
	}

	useDidMount(() => {
		joinGame()
		onGameStart()
	})

	return (
		<>
			<Grid container spacing={2}>
				<Grid item sm={12} md={12} lg={12} xl={12}>
					<Divider size={4} />

					<Button
						color="primary"
						variant="contained"
						fullWidth
						onClick={toggleReady}
					>
						READY
					</Button>

					<Divider size={3} />

					<Button
						color="secondary"
						variant="contained"
						fullWidth
						onClick={handleStartGame}
					>
						START GAME
					</Button>

					<Divider size={3} />
				</Grid>
				<Grid item sm={12} md={12} lg={12} xl={12}>
					{loadingRoom ? (
						<h1>Loading Room...</h1>
					) : (
						<Grid item sm={12} md={12} lg={12} xl={12}>
							{socketStore?.game?.players?.map(player => (
								<>
									<PlayerItem
										key={player.id}
										player={player}
									/>

									<Divider size={2} />
								</>
							))}
						</Grid>
					)}
				</Grid>
			</Grid>
		</>
	)
}

export default Room
