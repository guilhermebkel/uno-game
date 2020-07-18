import React from "react"
import {
	Card,
	Avatar,
	Grid,
	Typography,
	ButtonBase
} from "@material-ui/core"
import Chip from "@material-ui/core/Chip"

import useStyles from "@unoenty/pages/Room/PlayerItem/styles"
import { PlayerData } from "@shared/protocols/Player"

interface PlayerItem {
	player: PlayerData
}

const PlayerItem = (props: PlayerItem) => {
	const { player } = props

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
					color={player.ready ? "primary" : "secondary"}
				/>

				<Typography className={classes.cardTitle}>
					{player.name}
				</Typography>

				<Avatar>
					{player.name[0]}
				</Avatar>

				<Chip
					label={player.ready ? "READY" : "WAITING"}
					color={player.ready ? "primary" : "secondary"}
				/>
			</Grid>
		</Card>
	)
}

export default PlayerItem
