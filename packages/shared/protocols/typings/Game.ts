import { CardData, CardColors, CurrentCardCombo } from "./Card"
import { PlayerData } from "./Player"

export type GameEvents =
"GameStateChanged" |
"GameStarted" |
"GameCreated" |
"GameEnded" |
"PlayerWon" |
"PlayerUno" |
"PlayerJoined" |
"PlayerLeft" |
"PlayerBlocked" |
"PlayerBuyCards" |
"CardStackBuyCardsCombo" |
"GameRoundRemainingTimeChanged" |
"GameHistoryConsolidated" |
"GameListUpdated" |
"PlayerToggledReady" |
"PlayerPutCard" |
"PlayerChoseCardColor" |
"PlayerBoughtCard" |
"PlayerCardUsabilityConsolidated" |
"PlayerStatusChanged" |
"GameAmountToBuyChanged"

export type GameStatus =
"waiting" |
"playing" |
"ended"

export type GameType =
"private" |
"public"

export type GameDirection =
"clockwise" |
"counterclockwise"

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
	currentCardCombo: CurrentCardCombo
	maxRoundDurationInSeconds: number
	createdAt: number
}
