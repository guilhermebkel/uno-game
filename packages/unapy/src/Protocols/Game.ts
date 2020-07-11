import { CardData } from "@unapy/Protocols/Card"
import { PlayerData } from "@unapy/Protocols/Player"

export interface Game {
	/**
	 * Game name
	 */
	title: string
	/**
	 * Cards that can be used by players
	 */
	availableCards: CardData[]
	/**
	 * Cards used by players
	 */
	usedCards: CardData[]
	/**
	 * Initial cards (all above come from here)
	 */
	cards: CardData[]
	/**
	 * Current players
	 */
	players: PlayerData[]
}
