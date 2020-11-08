import React from "react"
import { Prompt, useParams } from "react-router-dom"
import { Game } from "@uno-game/protocols"

import GameEndedModal from "@/pages/Table/GameEndedModal"

import useSocket from "@/hooks/useSocket"
import { useSocketStore } from "@/store/Socket"

const CloseGamePrompt: React.FC = () => {
	const socket = useSocket()
	const socketStore = useSocketStore()

	const { gameId } = useParams<{ gameId: string }>()

	const handleGoOutRoom = (newPathname: string): boolean => {
		const isGoingOutGame = !newPathname.includes(gameId)
		const isGoingOutTable = !newPathname.includes("table")

		if (isGoingOutGame) {
			socket.forceSelfDisconnect(gameId)

			socketStore.setGameData({} as Game)
		}

		if (isGoingOutTable) {
			GameEndedModal.close()
		}

		return true
	}

	return (
		<Prompt message={(props) => handleGoOutRoom(props.pathname)} />
	)
}

export default CloseGamePrompt
