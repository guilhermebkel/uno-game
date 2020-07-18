import { CardData } from "@shared/protocols/Card"

export interface Player {
	id: string
	name: string
}

export type PlayerStatus = "online" | "offline"

export interface PlayerData extends Player {
	handCards: CardData[]
	usedCards: CardData[]
	status: PlayerStatus
	ready: boolean
}

export type CurrentPlayerStatus = "uno" | "winner"

export interface CurrentPlayerInfo {
	id: string
	status: CurrentPlayerStatus
}
