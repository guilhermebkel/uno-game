import { CardData } from "./Card"

export type PlayerEvents =
"PlayerDataSet" |
"SelfDisconnected" |
"PlayerConnected"

export type Player = {
	id: string
	name: string
}

export type PlayerState =
"Uno" |
"Blocked" |
"BuyCards"

export type PlayerStatus = "online" | "offline" | "afk"

export type PlayerData = Player & {
	handCards: CardData[]
	status: PlayerStatus
	ready: boolean
	isCurrentRoundPlayer: boolean
	canBuyCard: boolean
}

export type CurrentPlayerGameStatus = "uno" | "winner" | "afk"

export type CurrentPlayerInfo = {
	id: string
	gameStatus: CurrentPlayerGameStatus
	playerStatus: PlayerStatus
	name: string
}
