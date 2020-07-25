import React, { useState } from "react"
import { useParams, useHistory } from "react-router-dom"
import { Grid, Button } from "@material-ui/core"

import { useSocketStore } from "@/store/Socket"

import useDidMount from "@/hooks/useDidMount"
import useSocket from "@/hooks/useSocket"

import { Divider, LoadingComponent } from "@/components"

import PlayerItem from "@/pages/Room/PlayerItem"

import PlayerListSkeleton from "@/skeletons/PlayerList"

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
		<LoadingComponent loading={loadingRoom} customLoadingElement={<PlayerListSkeleton />}>
			<Grid container spacing={2}>
				{socket.currentPlayer && (
					<Grid item sm={12} md={12} lg={12} xl={12} style={{ width: "100%" }}>
						<Divider size={4} />

						<Button
							color={socket.currentPlayer.ready ? "primary" : "secondary"}
							variant="contained"
							fullWidth
							onClick={toggleReady}
						>
							{socket.currentPlayer.ready ? "READY" : "UNREADY"}
						</Button>

						<Divider size={3} />
					</Grid>
				)}

				<Grid item sm={12} md={12} lg={12} xl={12} style={{ width: "100%" }}>
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
			</Grid>
		</LoadingComponent>
	)
}

export default Room
