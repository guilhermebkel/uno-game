import { GameStatus } from "./Game"

export type GameHistory = {
	createdAt: number
	name: string
	playersCount: number
	gameId: string
	status: GameStatus
}
