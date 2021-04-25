import { CardColors } from "./Card"
import { Chat, ChatEvents } from "./Chat"
import { GameEvents, Game } from "./Game"
import { GameRoundEvents } from "./GameRound"
import { Player, PlayerEvents, PlayerStatus } from "./Player"

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
"connect"

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
