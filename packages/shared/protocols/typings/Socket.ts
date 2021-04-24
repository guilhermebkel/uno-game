import { ChatEvents } from "./Chat"
import { GameEvents } from "./Game"
import { GameRoundEvents } from "./GameRound"
import { PlayerEvents } from "./Player"

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
