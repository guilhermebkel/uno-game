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
"PlayerJoined" |
"PlayerLeft" |
"ResetPlayerMovement" |
"ResetPlayerItem" |
"SetPlayerMovement" |
"SetPlayerCharacterAttributes" |
"SetPlayerRacingLap" |
"SetPlayerItem" |
"MysteryItemCaught" |
"MysteryItemSpawned" |
"connect"

export type SocketEventHandler<ReceivedData extends unknown, ResponseData extends unknown> = (
	...data: ReceivedData[]
) => Promise<ResponseData | void> | (ResponseData | void)
