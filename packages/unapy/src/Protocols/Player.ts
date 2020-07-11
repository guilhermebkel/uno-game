import { CardData } from "@unapy/Protocols/Card"

export interface Player {
	id: number
	name: string
}

export interface PlayerData extends Player {
	handCards: CardData[]
	usedCards: CardData[]
}
