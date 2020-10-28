import React from "react"
import { Prompt, useParams } from "react-router-dom"

import useSocket from "@/hooks/useSocket"

const CloseGamePrompt: React.FC = () => {
	const socket = useSocket()

	const { gameId } = useParams<{ gameId: string }>()

	const handleGoOutRoom = (newPathname: string): boolean => {
		const isGoingOutRoom = !newPathname.includes(gameId)

		if (isGoingOutRoom) {
			socket.forceSelfDisconnect()
		}

		return true
	}

	return (
		<Prompt message={(props) => handleGoOutRoom(props.pathname)} />
	)
}

export default CloseGamePrompt
