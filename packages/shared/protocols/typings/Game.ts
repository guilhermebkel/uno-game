import { CardData, CardColors, CardTypes } from "./Card"
import { PlayerData } from "./Player"

export type GameEvents =
"GameStateChanged" |
"GameStarted" |
"GameCreated" |
"GameEnded" |
"PlayerWon" |
"PlayerUno" |
"PlayerJoined" |
"PlayerBlocked" |
"PlayerBuyCards" |
"CardStackBuyCardsCombo" |
"GameRoundRemainingTimeChanged" |
"PlayerGotAwayFromKeyboard"

export type GameStatus =
"waiting" |
"playing" |
"ended"

export type GameType =
"private" |
"public"

export type GameDirection=
"clockwise" |
"counterclockwise"

export type GameHistory = {
	createdAt: number
	name: string
	playersCount: number
	gameId: string
}

export type Game = {
	direction: GameDirection
	type: GameType
	maxPlayers: number
	status: GameStatus
	round: number
	id: string
	chatId: string
	currentPlayerIndex: number
	nextPlayerIndex: number
	currentGameColor: CardColors
	title: string
	availableCards: CardData[]
	usedCards: CardData[]
	cards: CardData[]
	players: PlayerData[]
	currentCardCombo: Array<CardTypes>
	maxRoundDurationInSeconds: number
	roundRemainingTimeInSeconds?: number
	createdAt: number
}
