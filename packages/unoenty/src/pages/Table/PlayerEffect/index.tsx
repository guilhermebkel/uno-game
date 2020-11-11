import React, { useState } from "react"
import {
	Grid,
	Typography,
	Zoom,
} from "@material-ui/core"

import { PlayerState } from "@uno-game/protocols"

import useStyles from "@/pages/Table/PlayerEffect/styles"

import useDidMount from "@/hooks/useDidMount"
import useSocket from "@/hooks/useSocket"

type PlayerEffectProps = {
	playerId: string
}

const PlayerEffect: React.FC<PlayerEffectProps> = (props) => {
	const { playerId } = props

	const [playerEffectMessage, setPlayerEffectMessage] = useState<string>("")

	const classes = useStyles()
	const socket = useSocket()

	const handlePlayerStateChange = (
		playerState: PlayerState,
		affectedPlayerId: string,
		amountToBuy?: number,
	) => {
		if (affectedPlayerId === playerId) {
			if (playerState === "Uno") {
				setPlayerEffectMessage("UNO!")
			} else if (playerState === "Blocked") {
				setPlayerEffectMessage("BLOCKED!")
			} else if (playerState === "BuyCards") {
				setPlayerEffectMessage(`BUY ${amountToBuy}!`)
			}

			setTimeout(() => {
				setPlayerEffectMessage("")
			}, 2000)
		}
	}

	const onPlayerStateChange = () => {
		socket.onPlayerStateChange(handlePlayerStateChange)
	}

	useDidMount(() => {
		onPlayerStateChange()
	})

	return (
		<Zoom in={!!playerEffectMessage}>
			<Grid
				container
				justify="center"
				alignItems="center"
				className={classes.playerEffectMessageContainer}
			>
				<Grid
					container
					justify="center"
					alignItems="center"
					className={classes.playerEffectMessageContent}
				>
					<Typography
						variant="h3"
						align="center"
						className={classes.playerEffectMessageText}
					>
						{playerEffectMessage}
					</Typography>
				</Grid>
			</Grid>
		</Zoom>
	)
}

export default PlayerEffect
