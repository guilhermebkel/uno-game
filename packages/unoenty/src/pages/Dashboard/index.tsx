import React, { useState } from "react"
import { useHistory, Link } from "react-router-dom"
import { Grid, Button, CircularProgress } from "@material-ui/core"
import {
	AddCircleOutlineOutlined as AddCircleOutlineOutlinedIcon
} from "@material-ui/icons"

import { Game } from "@uno-game/protocols"

import useDidMount from "@/hooks/useDidMount"
import useSocket from "@/hooks/useSocket"

import api from "@/services/api"

import { Divider, LoadingComponent } from "@/components"

import GameItem from "@/pages/Dashboard/GameItem"

import useStyles from "@/pages/Dashboard/styles"

import GameListSkeleton from "@/skeletons/GameList"

const Dashboard = () => {
	const [games, setGames] = useState<Game[]>([])

	const [loadingCreateGame, setLoadingCreateGame] = useState(false)
	const [loadingGetGames, setLoadingGetGames] = useState(true)

	const history = useHistory()
	const classes = useStyles()

	const socket = useSocket()

	const handleCreateNewGame = async () => {
		setLoadingCreateGame(true)

		const game = await socket.createGame()

		setLoadingCreateGame(false)

		history.push(`/${game.id}`)
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
		<LoadingComponent loading={loadingGetGames} customLoadingElement={<GameListSkeleton />}>
			<Grid container spacing={2}>
				<Grid item sm={12} md={12} lg={12} xl={12} style={{ width: "100%" }}>
					<Divider size={4} />

					<Button
						color="primary"
						variant="contained"
						fullWidth
						onClick={handleCreateNewGame}
						endIcon={loadingCreateGame ? (<CircularProgress />) : (<AddCircleOutlineOutlinedIcon />)}
						disabled={loadingCreateGame}
					>
						CREATE NEW GAME
					</Button>

					<Divider size={3} />
				</Grid>

				<Grid item sm={12} md={12} lg={12} xl={12} style={{ width: "100%" }}>
					{games
						.filter(game => game.status === "waiting")
						.map(game => (
							<>
								<Grid
									container
									component={Link}
									to={`/${game.id}`}
									className={classes.gameItemGrid}
								>
									<GameItem
										key={game.id}
										title={game.title}
										players={game.players}
										status={game.status}
									/>
								</Grid>
								
								<Divider size={2} />
							</>
						))
					}
				</Grid>
			</Grid>
		</LoadingComponent>
	)
}

export default Dashboard
