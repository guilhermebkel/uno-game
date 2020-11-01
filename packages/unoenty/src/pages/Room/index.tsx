import React, { useState, ReactElement } from "react"
import { useParams, useHistory } from "react-router-dom"
import { Grid, Button, Typography } from "@material-ui/core"
import {
	Check as ReadyIcon,
	Close as CancelIcon,
} from "@material-ui/icons"

import { useSocketStore } from "@/store/Socket"

import useDidMount from "@/hooks/useDidMount"
import useSocket from "@/hooks/useSocket"

import DeviceUtil from "@/utils/device"

import {
	Divider,
	LoadingComponent,
	CloseGamePrompt,
	GameCard,
} from "@/components"

import useStyles from "@/pages/Room/styles"
import useCustomStyles from "@/styles/custom"

import PlayerItem from "@/pages/Room/PlayerItem"

const Room = (): ReactElement => {
	const [loadingRoom, setLoadingRoom] = useState(true)

	const socketStore = useSocketStore()

	const history = useHistory()

	const classes = useStyles()
	const customClasses = useCustomStyles({ limitedNameWidth: 500 })

	const socket = useSocket()

	const { gameId } = useParams<{ gameId: string }>()

	const toggleReady = () => {
		socket.toggleReady(gameId)
	}

	const joinGame = async () => {
		const game = await socket.joinGame(gameId)

		if (game.status === "playing") {
			history.push(`/${gameId}/table`)
		} else {
			setLoadingRoom(false)
		}
	}

	const onGameStart = () => {
		socket.onGameStart(() => {
			history.push(`/${gameId}/table`)
		})
	}

	const setupRoom = () => {
		joinGame()
		onGameStart()
	}

	const onReconnect = () => {
		socket.onReconnect(() => setupRoom())
	}

	useDidMount(() => {
		setupRoom()
		onReconnect()
	})

	return (
		<>
			<CloseGamePrompt />
			<LoadingComponent loading={loadingRoom}>
				<Grid
					container
					className={classes.container}
				>
					<Grid
						container
						alignItems="center"
						justify="flex-start"
						className={classes.pageTitleContainer}
					>
						<Typography
							variant="h1"
							color="textSecondary"
							className={`${classes.pageTitle} ${customClasses.limitedName}`}
						>
							Room
							<b
								className={classes.pageTitleSpotlight}
							>
								/{socketStore?.game?.title}
							</b>
						</Typography>

						{DeviceUtil.isMobile ? (
							<Divider orientation="horizontal" size={3} />
						) : (
							<Divider orientation="vertical" size={5} />
						)}

						<Button
							variant="contained"
							color="primary"
							onClick={toggleReady}
							startIcon={socket?.currentPlayer?.ready ? <CancelIcon /> : <ReadyIcon />}
						>
							{socket?.currentPlayer?.ready ? "CANCEL" : "GET READY"}
						</Button>
					</Grid>

					<Divider orientation="horizontal" size={4} />

					<Grid
						container
						direction="column"
						className={classes.content}
					>
						<Typography
							variant="h2"
							className={classes.itemTitle}
						>
							INFO
						</Typography>

						<Divider orientation="horizontal" size={1} />

						{socketStore?.game && (
							<GameCard
								gameId={socketStore.game.id}
								maxPlayers={socketStore.game.maxPlayers}
								name={socketStore.game.title}
								players={socketStore.game.players}
								status={socketStore.game.status}
								mode="info"
							/>
						)}

						<Divider orientation="horizontal" size={4} />

						<Typography
							variant="h2"
							className={classes.itemTitle}
						>
							PLAYERS
						</Typography>

						<Divider orientation="horizontal" size={1} />

						<Grid
							container
							direction="column"
							spacing={2}
						>
							{socketStore?.game?.players?.map(player => (
								<Grid item>
									<PlayerItem
										name={player.name}
										ready={player.ready}
										playerId={player.id}
									/>
								</Grid>
							))}
						</Grid>
					</Grid>
				</Grid>
			</LoadingComponent>
		</>
	)
}

export default Room
