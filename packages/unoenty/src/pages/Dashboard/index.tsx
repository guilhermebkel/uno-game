import React, { useState } from "react"
import { useHistory, Link } from "react-router-dom"
import { Grid, Button, CircularProgress } from "@material-ui/core"

import { Game } from "../../protocols/Game"

import useDidMount from "../../hooks/useDidMount"

import api from "../../services/api"

import { useSocketStore } from "../../store/Socket"

import { Divider } from "../../components"

import GameItem from "./GameItem"

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

		history.push(`/room/${game.id}`)
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
		<>
			<Grid container spacing={2}>
				<Grid item sm={12} md={12} lg={12} xl={12}>
					<Divider size={4} />

					<Button
						color="primary"
						variant="contained"
						fullWidth
						onClick={handleCreateNewGame}
						endIcon={loadingCreateGame && (<CircularProgress />)}
						disabled={loadingCreateGame}
					>
						CREATE NEW GAME
					</Button>

					<Divider size={3} />
				</Grid>
				{loadingGetGames ? (
					<h1>Loading Get Games...</h1>
				) : (
					<Grid item sm={12} md={12} lg={12} xl={12}>
						{games.map(game => (
							<>
								<Grid container component={Link} to={`/room/${game.id}`}>
									<GameItem
										key={game.id}
										title={game.title}
										players={game.players}
										status={game.status}
									/>
								</Grid>
								
								<Divider size={2} />
							</>
						))}
					</Grid>
				)}
			</Grid>
		</>
	)
}

export default Dashboard
