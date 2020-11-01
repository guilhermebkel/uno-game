import React, { ReactElement } from "react"
import {
	Grid,
	Typography,
	Button,
	Avatar as MaterialAvatar,
} from "@material-ui/core"
import { AvatarGroup } from "@material-ui/lab"

import { Divider, Avatar } from "@/components"

import useStyles from "@/pages/Dashboard/GameItem/styles"

import { GameStatus, PlayerData } from "@uno-game/protocols"

import { StatusMap, statusColorMap } from "@/utils/game"

import unoWallpaperImage from "@/assets/uno-wallpaper.png"

const statusButtonTextMap: StatusMap<string> = {
	playing: "SPECTATE",
	ended: "",
	waiting: "JOIN",
}

type GameItemProps = {
	name: string
	status: GameStatus
	players: PlayerData[]
	gameId: string
	maxPlayers: number
}

const GameItem: React.FC<GameItemProps> = (props): ReactElement => {
	const { name, status, players, gameId, maxPlayers } = props

	const classes = useStyles()

	const buttonText = statusButtonTextMap[status]
	const buttonColor = statusColorMap[status]
	const remainingSlots = maxPlayers - players.length

	return (
		<Grid
			container
			className={classes.container}
			style={{
				background: `linear-gradient(26.73deg, #252525 46.63%, rgba(37, 37, 37, 0.85) 98.21%), url(${unoWallpaperImage})`,
			}}
		>
			<Grid
				container
				direction="column"
			>
				<Typography
					variant="h3"
					className={classes.gameTitle}
				>
					{name}
				</Typography>

				<Typography
					variant="h2"
					className={classes.gameSubTitle}
				>
					#{gameId}
				</Typography>
			</Grid>

			<Divider orientation="horizontal" size={4} />

			<Grid
				container
				alignItems="flex-end"
				justify="space-between"
			>
				<Button
					className={classes.button}
					style={{
						backgroundColor: buttonColor,
					}}
				>
					{buttonText}
				</Button>

				<Grid item>
					<Typography
						variant="h2"
						className={classes.remainingSlotText}
					>
						{remainingSlots} {remainingSlots === 1 ? "SLOT" : "SLOTS"} LEFT
					</Typography>

					<Divider orientation="horizontal" size={1} />

					<AvatarGroup max={maxPlayers}>
						{players.map(player => (
							<MaterialAvatar
								variant="circle"
								key={player.id}
								className={classes.avatar}
							>
								<Avatar
									name={player.name}
									size="small"
								/>
							</MaterialAvatar>
						))}
						{[...new Array(remainingSlots)].map((_, index) => (
							<MaterialAvatar
								key={index}
								className={classes.avatar}
							/>
						))}
					</AvatarGroup>
				</Grid>
			</Grid>
		</Grid>
	)
}

export default GameItem
