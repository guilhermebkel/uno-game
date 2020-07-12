import React, { useState } from "react"
import { useHistory, Link } from "react-router-dom"
import { Grid, Container, Button, CircularProgress } from "@material-ui/core"

import { Game } from "../../protocols/Game"

import useDidMount from "../../hooks/useDidMount"

import api from "../../services/api"

import { useSocketStore } from "../../store/Socket"

import RoomCard from "./RoomCard"

const Dashboard = () => {
	const [games, setGames] = useState<Game[]>([])

	const [loadingCreateGame, setLoadingCreateGame] = useState(false)
	const [loadingGetGames, setLoadingGetGames] = useState(true)

	const history = useHistory()
	const socketStore = useSocketStore()

	const handleCreateNewGame = async () => {
		setLoadingCreateGame(true)

		socketStore.io.emit("CreateGame")

		const game = await new Promise<Game>(resolve => {
			socketStore.io.on("GameCreated", (game: Game) => {
				resolve(game)
			})
		})

		socketStore.set({ game })

		setLoadingCreateGame(false)

		// history.push(`/room/${game.id}`)
		history.push(`/table/${game.id}`)
	}

	const getGameList = async () => {
		const { data } = await api.get("/games")

		setGames(data.games)

		setLoadingGetGames(false)
	}

	useDidMount(() => {
		getGameList()
	})

	return (
		<Container>
			<Grid container spacing={2}>
				<Grid item sm={12} md={12} lg={12} xl={12}>
					<Button
						color="primary"
						variant="contained"
						fullWidth
						onClick={handleCreateNewGame}
						endIcon={loadingCreateGame && (<CircularProgress />)}
						disabled={loadingCreateGame}
					>
						New game
					</Button>
				</Grid>
				<Grid item sm={12} md={12} lg={12} xl={12}>
					{loadingGetGames ? (
						<h1>Loading Game List...</h1>
					) : (
						<Grid container spacing={2}>
							{games.map(game => (
								<Grid
									key={game.id}
									component={Link}
									to={`/room/${game.id}`}
									item 
									sm={5}
									md={4}
									lg={3}
									xl={3}
								>
									<RoomCard title={game.title} />
								</Grid>
							))}
						</Grid>
					)}
				</Grid>
			</Grid>
			
		</Container>
	)
}

export default Dashboard
