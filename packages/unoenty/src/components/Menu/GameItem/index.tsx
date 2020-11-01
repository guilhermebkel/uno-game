import { GameStatus } from "@uno-game/protocols"
import React from "react"
import { Grid, Typography, Button } from "@material-ui/core"

import useStyles from "@/components/Menu/GameItem/styles"

import colors from "@/styles/colors"

type GameItemProps = {
	playersCount: number
	name: string
	status: GameStatus
}

const GameItem: React.FC<GameItemProps> = (props) => {
	const { playersCount, name, status } = props

	const classes = useStyles()

	const getColor = () => {
		let color: string | undefined

		if (status === "waiting") {
			color = colors.palette.yellow1
		}

		if (status === "playing") {
			color = colors.palette.green1
		}

		if (status === "ended") {
			color = colors.palette.orange1
		}

		return color
	}

	return (
		<Grid
			container
			justify="space-between"
			alignItems="center"
			className={classes.container}
			style={{
				border: `2px solid ${getColor()}`,
			}}
		>
			<Grid
				item
				style={{
					color: getColor(),
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
					color: getColor(),
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
						backgroundColor: getColor(),
					}}
				>
					JOIN
				</Button>
			</Grid>
		</Grid>
	)
}

export default GameItem
