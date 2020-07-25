import { CardData } from "./Card"

export type Player = {
	id: string
	name: string
}

export type PlayerStatus = "online" | "offline"

export type PlayerData = Player & {
	handCards: CardData[]
	usedCards: CardData[]
	status: PlayerStatus
	ready: boolean
	isCurrentRoundPlayer: boolean
	canBuyCard: boolean
}

export type CurrentPlayerStatus = "uno" | "winner"

export type CurrentPlayerInfo = {
	id: string
	status: CurrentPlayerStatus
}
