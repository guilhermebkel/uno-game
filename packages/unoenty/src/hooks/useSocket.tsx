import { useSocketStore } from "../store/Socket"

import { PlayerData } from "../protocols/Player"
import { Game } from "../protocols/Game"

const useSocket = () => {
	const socketStore = useSocketStore()

	const getCurrentPlayer = (): PlayerData => {
		const playerId = socketStore.playerId

		const player = socketStore?.game?.players?.find(player => player.id === playerId)

		return (player || {}) as PlayerData
	}

	const getOtherPlayers = (): PlayerData[] => {
		const playerId = socketStore.playerId

		const players = socketStore?.game?.players?.filter(player => player.id !== playerId)

		return (players || []) as PlayerData[]
	}

	const createGame = async (): Promise<Game> => {
		socketStore.io.emit("CreateGame")

		const game = await new Promise<Game>(resolve => {
			socketStore.io.on("GameCreated", (game: Game) => {
				resolve(game)
			})
		})

		return game
	}

	const joinGame = async (gameId: string): Promise<Game> => {
		socketStore.io.emit("JoinGame", gameId)

		return  new Promise((resolve, reject) => {
			socketStore.io.on("PlayerJoined", resolve)
			socketStore.io.on("PlayerJoinFailed", reject)
		})
	}

	const startGame = (gameId: string) => {
		socketStore.io.emit("StartGame", gameId)
	}

	const buyCard = (gameId: string) => {
		socketStore.io.emit("BuyCard", gameId)
	}

	const putCard = (gameId: string, cardId: string) => {
		socketStore.io.emit("PutCard", gameId, cardId)
	}

	const onGameStart = (fn: Function) => {
		socketStore.io.on("GameStarted", fn)
	}

	return {
		get currentPlayer (): PlayerData {
			return getCurrentPlayer()
		},
		get otherPlayers (): PlayerData[] {
			return getOtherPlayers()
		},
		createGame,
		joinGame,
		startGame,
		onGameStart,
		buyCard,
		putCard
	}
}

export default useSocket
