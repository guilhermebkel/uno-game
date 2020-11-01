import { GameStatus } from "@uno-game/protocols"
import React from "react"
import { Grid, Typography, Button } from "@material-ui/core"

import useStyles from "@/components/Menu/GameItem/styles"

import { statusColorMap } from "@/utils/game"

type GameItemProps = {
	playersCount: number
	name: string
	status: GameStatus
}

const GameItem: React.FC<GameItemProps> = (props) => {
	const { playersCount, name, status } = props

	const classes = useStyles()

	const color = statusColorMap[status]

	return (
		<Grid
			container
			justify="space-between"
			alignItems="center"
			className={classes.container}
			style={{
				border: `2px solid ${color}`,
			}}
		>
			<Grid
				item
				style={{
					color,
				}}
			>
				<Typography variant="h2">
					{name}
				</Typography>

				<Typography variant="caption">
					{playersCount} {playersCount === 1 ? "PLAYER" : "PLAYERS"}
				</Typography>
			</Grid>

			<Grid
				item
				style={{
					color,
				}}
			>
				<Typography variant="caption">
					{status?.toUpperCase()}
				</Typography>
			</Grid>

			<Grid item>
				<Button
					className={classes.button}
					style={{
						backgroundColor: color,
					}}
				>
					JOIN
				</Button>
			</Grid>
		</Grid>
	)
}

export default GameItem
