import React from "react"
import { Prompt, useParams } from "react-router-dom"
import { Game } from "@uno-game/protocols"

import useSocket from "@/hooks/useSocket"
import { useSocketStore } from "@/store/Socket"

const CloseGamePrompt: React.FC = () => {
	const socket = useSocket()
	const socketStore = useSocketStore()

	const { gameId } = useParams<{ gameId: string }>()

	const handleGoOutRoom = (newPathname: string): boolean => {
		const isGoingOutRoom = !newPathname.includes(gameId)

		if (isGoingOutRoom) {
			socket.forceSelfDisconnect()

			socketStore.setGameData({} as Game)
		}

		return true
	}

	return (
		<Prompt message={(props) => handleGoOutRoom(props.pathname)} />
	)
}

export default CloseGamePrompt
