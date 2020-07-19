import React from "react"
import {
	Card,
	Avatar,
	Grid,
	Typography,
	ButtonBase
} from "@material-ui/core"
import AvatarGroup from "@material-ui/lab/AvatarGroup"
import Chip from "@material-ui/core/Chip"

import useStyles from "@unoenty/pages/Dashboard/GameItem/styles"

import { GameStatus } from "@shared/protocols/Game"
import { PlayerData } from "@shared/protocols/Player"

type ChipProps = {
	label: "PLAYING" | "WAITING" | "ENDED"
	color: "primary" | "secondary" | "default"
}

type ChipPropsMap = {
	[status in GameStatus]: ChipProps
}

const chipStatusMap: ChipPropsMap = {
	playing: {
		label: "PLAYING",
		color: "primary"
	},
	waiting: {
		label: "WAITING",
		color: "secondary"
	},
	ended: {
		label: "ENDED",
		color: "default"
	}
}

type GameItemProps = {
	title: string
	status: GameStatus
	players: PlayerData[]
}

const GameItem = (props: GameItemProps) => {
	const { title, status, players } = props

	const classes = useStyles()

	return (
		<Card
			component={ButtonBase}
			className={classes.cardContainer}
		>
			<Grid
				container
				alignItems="center"
				justify="space-between"
				className={classes.cardContent}
			>
				<Chip
					className={classes.cardStatus}
					color={chipStatusMap[status].color}
				/>

				<Typography className={classes.cardTitle}>
					{title}
				</Typography>

				<AvatarGroup>
					{players.map(player => (
						<Avatar>
							{player.name[0]}
						</Avatar>
					))}
				</AvatarGroup>

				<Chip
					label={chipStatusMap[status].label}
					color={chipStatusMap[status].color}
				/>
			</Grid>
		</Card>
	)
}

export default GameItem
