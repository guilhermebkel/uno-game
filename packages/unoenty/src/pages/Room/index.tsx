import React, { useState } from "react"
import copy from "copy-to-clipboard"
import { useParams, useHistory } from "react-router-dom"
import { Grid, Button, ButtonGroup } from "@material-ui/core"
import {
	ThumbDownOutlined as ThumbDownOutlinedIcon,
	ThumbUpOutlined as ThumbUpOutlinedIcon,
	FileCopyOutlined as FileCopyOutlinedIcon
} from "@material-ui/icons"

import { useSocketStore } from "@/store/Socket"

import ShareUtil from "@/utils/share"

import useDidMount from "@/hooks/useDidMount"
import useSocket from "@/hooks/useSocket"

import { Divider, LoadingComponent } from "@/components"

import PlayerItem from "@/pages/Room/PlayerItem"

import PlayerListSkeleton from "@/skeletons/PlayerList"

const Room = () => {
	const [loadingRoom, setLoadingRoom] = useState(true)
	const [isLinkCopied, setIsLinkCopied] = useState(false)

	const socketStore = useSocketStore()

	const history = useHistory()

	const socket = useSocket()

	const { gameId } = useParams()

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

	const getRoomUrl = () => {
		return ShareUtil.mountGameShareUrl(gameId)
	}

	const handleCopyRoomUrl = (event: React.MouseEvent) => {
		event.preventDefault()

		const roomUrl = getRoomUrl()

		copy(roomUrl)

		setIsLinkCopied(true)

		setTimeout(() => {
			setIsLinkCopied(false)
		}, 1500)
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
		<LoadingComponent loading={loadingRoom} customLoadingElement={<PlayerListSkeleton />}>
			<Grid container spacing={2}>
				{socket.currentPlayer && (
					<Grid item sm={12} md={12} lg={12} xl={12} style={{ width: "100%" }}>
						<Divider size={4} />

						<ButtonGroup fullWidth>
							<Button
								color={socket.currentPlayer.ready ? "primary" : "secondary"}
								variant="contained"
								fullWidth
								onClick={toggleReady}
								endIcon={socket.currentPlayer.ready ? (<ThumbUpOutlinedIcon />) : (<ThumbDownOutlinedIcon />)}
							>
								{socket.currentPlayer.ready ? "READY" : "UNREADY"}
							</Button>
							<Button
								endIcon={(<FileCopyOutlinedIcon />)}
								style={{ maxWidth: "120px", minWidth: "120px" }}
								variant="contained"
								color="default"
								href={getRoomUrl()}
								onClick={handleCopyRoomUrl}
							>
								{isLinkCopied ? "Copied!" : "Copy Link"}
							</Button>
						</ButtonGroup>

						<Divider size={3} />
					</Grid>
				)}

				<Grid item sm={12} md={12} lg={12} xl={12} style={{ width: "100%" }}>
					{socketStore?.game?.players?.map(player => (
						<>
							<PlayerItem
								key={player.id}
								player={player}
							/>

							<Divider size={2} />
						</>
					))}
				</Grid>
			</Grid>
		</LoadingComponent>
	)
}

export default Room
