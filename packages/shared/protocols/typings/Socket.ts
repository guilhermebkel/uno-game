import { CardColors, CardData } from "./Card"
import { Chat, ChatEvents, ChatMessage } from "./Chat"
import { GameEvents, Game } from "./Game"
import { GameHistory } from "./GameHistory"
import { GameRoundEvents } from "./GameRound"
import { Player, PlayerData, PlayerEvents, PlayerStatus } from "./Player"

export type SocketServerEvents =
"SetPlayerData" |
"CreateGame" |
"JoinGame" |
"BuyCard" |
"PutCard" |
"SendChatMessage" |
"ChangePlayerStatus" |
"ToggleReady" |
"ForceSelfDisconnect" |
"disconnect"

export type SocketClientEvents =
GameEvents |
ChatEvents |
GameRoundEvents |
PlayerEvents |
"connect" |
"reconnect" |
"disconnect"

export type SocketEventHandler<ReceivedData extends unknown, ResponseData extends unknown> = (
	data: ReceivedData
) => Promise<ResponseData | void> | (ResponseData | void)

export type SetPlayerDataEventInput = { player: Player }
export type SetPlayerDataEventResponse = { player: Player }

export type CreateGameEventResponse = { gameId: string }

export type JoinGameEventInput = { gameId: string }
export type JoinGameEventResponse = { game: Game, chat: Chat }

export type BuyCardEventInput = { gameId: string }

export type PutCardEventInput = { gameId: string, cardIds: string[], selectedColor: CardColors }

export type SendChatMessageEventInput = { chatId: string, message: string }

export type ChangePlayerStatusEventInput = { gameId: string, playerStatus: PlayerStatus }

export type ToggleReadyEventInput = { gameId: string }

export type ForceSelfDisconnectEventInput = { gameId: string }

export type PlayerJoinedEventData = { player: PlayerData }

export type PlayerLeftEventData = { playerId: string }

export type PlayerWonEventData = { player: Player }

export type PlayerBuyCardsEventData = { playerId: string, amountToBuy: number }

export type PlayerBlockedEventData = { playerId: string }

export type PlayerUnoEventData = { playerId: string }

export type GameEndedEventData = { gameId: string }

export type PlayerStatusChangedEventData = { playerId: string, status: PlayerStatus }

export type GameStartedEventData = { game: Game }

export type PlayerToggledReadyEventData = { playerId: string, ready: boolean }

export type NewMessageEventData = { chatId: string, message: ChatMessage }

export type PlayerPutCardEventData = { playerId: string, cards: CardData[] }

export type PlayerChoseCardColorEventData = { cards: CardData[] }

export type GameRoundRemainingTimeChangedEventData = { roundRemainingTimeInSeconds: number }

export type GameHistoryConsolidatedEventData = { gameHistory: GameHistory[] }

export type PlayerBoughtCardEventData = { playerId: string, cards: CardData[] }

export type PlayerCardUsabilityConsolidatedEventData = {
	players: Array<{
		id: string
		isCurrentRoundPlayer: boolean
		canBuyCard: boolean
		handCards: Array<{
			id: string
			canBeUsed: boolean
			canBeCombed: boolean
		}>
	}>
}

export type GameAmountToBuyChangedEventData = { amountToBuy: number }
