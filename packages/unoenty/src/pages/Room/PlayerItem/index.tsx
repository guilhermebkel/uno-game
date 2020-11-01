import React, { ReactElement } from "react"
import {
	Grid,
	Typography,
} from "@material-ui/core"
import {
	Star as StarIcon,
} from "@material-ui/icons"

import {
	Avatar,
	Divider,
} from "@/components"

import useSocket from "@/hooks/useSocket"

import useStyles from "@/pages/Room/PlayerItem/styles"

type PlayerItem = {
	name: string
	ready: boolean
	playerId: string
}

const PlayerItem = (props: PlayerItem): ReactElement => {
	const { name, ready, playerId } = props

	const socket = useSocket()

	const classes = useStyles({ ready })

	return (
		<Grid
			container
			alignItems="center"
			justify="space-between"
			className={classes.container}
		>
			<Grid item>
				<Grid container>
					<Avatar
						name={name}
						size="small"
					/>

					<Divider orientation="vertical" size={2} />

					<Grid
						container
						direction="column"
						style={{ flex: 1 }}
					>
						<Typography
							variant="h3"
							className={classes.title}
						>
							{name}

							{socket.currentRoundPlayer?.id === playerId && (
								<StarIcon
									fontSize="small"
									className={classes.starIcon}
								/>
							)}
						</Typography>

						{socket?.currentPlayer?.id === playerId && (
							<Typography
								variant="h2"
								className={classes.description}
							>
								(You)
							</Typography>
						)}
					</Grid>
				</Grid>
			</Grid>

			<Typography
				variant="h2"
				className={classes.statusText}
			>
				{ready ? "READY" : "UNREADY"}
			</Typography>
		</Grid>
	)
}

export default PlayerItem
