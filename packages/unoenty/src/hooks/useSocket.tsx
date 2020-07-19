import { useSocketStore } from "@unoenty/store/Socket"

import { PlayerData } from "@shared/protocols/Player"
import { Game } from "@shared/protocols/Game"

const useSocket = () => {
	const socketStore = useSocketStore()

	const getCurrentPlayer = (): PlayerData => {
		const playerId = socketStore.playerId

		const player = socketStore?.game?.players?.find(player => player.id === playerId)

		return player as PlayerData
	}

	const getOtherPlayers = (): PlayerData[] => {
		const playerId = socketStore.playerId

		const currentPlayerIndex = socketStore?.game?.players?.
			findIndex(player => player.id === playerId) || 0

		const otherPlayersBeforeCurrentPlayer = socketStore?.game?.players?.
			slice(0, currentPlayerIndex)

		const otherPlayersAfterCurrentPlayer = socketStore?.game?.players?.
			slice(currentPlayerIndex + 1, socketStore?.game?.players?.length)

		const otherPlayers = [
			...otherPlayersAfterCurrentPlayer || [],
			...otherPlayersBeforeCurrentPlayer || []
		]

		return (otherPlayers || []) as PlayerData[]
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

		const game = await new Promise<Game>((resolve) => {
			socketStore.io.on("PlayerJoined", resolve)
		})

		socketStore.set({ game })

		return game
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

	const onPlayerWon = (fn: (playerId: string) => void) => {
		socketStore.io.on("PlayerWon", fn)
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
		onPlayerWon,
		buyCard,
		putCard
	}
}

export default useSocket
