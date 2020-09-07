export type GameRoundEvents =
"GameRoundRemainingTimeChanged"

export type GameRoundCounter = {
	timeoutId?: NodeJS.Timeout
	intervalId?: NodeJS.Timeout
	gameId: string
	timeoutAction: (gameId: string) => void
	intervalAction: (gameId: string) => void
	timeInSeconds: number
	initializedAtMilliseconds?: number
}
