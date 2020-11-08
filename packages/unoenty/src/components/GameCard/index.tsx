import React, { useState } from "react"
import copy from "copy-to-clipboard"
import {
	Grid,
	Typography,
	Button,
	Avatar as MaterialAvatar,
} from "@material-ui/core"
import { AvatarGroup } from "@material-ui/lab"
import {
	InfoOutlined as InfoIcon,
} from "@material-ui/icons"

import { Divider, Avatar } from "@/components"

import useStyles from "@/components/GameCard/styles"
import useCustomStyles from "@/styles/custom"

import { GameStatus, PlayerData } from "@uno-game/protocols"

import { StatusMap, statusColorMap } from "@/utils/game"
import ShareUtil from "@/utils/share"

import unoWallpaperImage from "@/assets/uno-wallpaper.png"

const statusButtonTextMap: StatusMap<string> = {
	playing: "SPECTATE",
	ended: "",
	waiting: "JOIN",
}

type GameCardProps = {
	name: string
	status: GameStatus
	players: PlayerData[]
	gameId: string
	maxPlayers: number
	mode: "info" | "preview"
}

const GameCard: React.FC<GameCardProps> = (props) => {
	const { name, status, players, gameId, maxPlayers, mode } = props

	const classes = useStyles()
	const customClasses = useCustomStyles({})

	const [linkCopied, setLinkCopied] = useState(false)

	const buttonText = statusButtonTextMap[status]
	const buttonColor = statusColorMap[status]
	const remainingSlots = maxPlayers - (players?.length ?? 0)

	const handleCopyRoomUrl = (event: React.MouseEvent) => {
		event.preventDefault()

		const roomUrl = ShareUtil.mountGameShareUrl(gameId)

		copy(roomUrl)

		setLinkCopied(true)

		setTimeout(() => {
			setLinkCopied(false)
		}, 1500)
	}

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
					className={`${classes.gameTitle} ${customClasses.limitedName}`}
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

			{mode === "info" && (
				<>
					<Grid container>
						<InfoIcon
							className={classes.infoIcon}
						/>

						<Divider orientation="vertical" size={1} />

						<Grid
							container
							direction="column"
							className={classes.infoContainer}
						>
							<Typography
								variant="caption"
								className={classes.infoText}
							>
								At least 2 players are needed to start a game.
							</Typography>

							<Typography
								variant="caption"
								className={classes.infoText}
							>
								The game automatically starts when all players are ready.
							</Typography>
						</Grid>
					</Grid>

					<Divider orientation="horizontal" size={2} />
				</>
			)}

			<Grid
				container
				alignItems="flex-end"
				justify="space-between"
			>
				<Button
					className={classes.button}
					{...(mode === "info" ? { onClick: handleCopyRoomUrl } : {})}
					style={{
						backgroundColor: buttonColor,
					}}
				>
					{mode === "info" ? (
						linkCopied ? "COPIED!" : "COPY LINK"
					) : (
						buttonText
					)}
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
						{players?.map(player => (
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
						{[...new Array(remainingSlots || 0)].map((_, index) => (
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

export default GameCard
