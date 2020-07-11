import { CardData, CardColors } from "@unapy/Protocols/Card"
import { PlayerData } from "@unapy/Protocols/Player"

export type GameEvents =
"GameStateChanged" |
"GameStarted" |
"GameCreated"

export interface Game {
	/**
	 * Game ID
	 */
	id: string
	/**
	 * Player[] index
	 */
	currentPlayerIndex: number
	/**
	 * Card Color
	 */
	currentGameColor: CardColors
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
