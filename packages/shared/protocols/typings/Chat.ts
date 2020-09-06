export type ChatEvents =
"NewMessage" |
"ChatStateChanged"

export type ChatMessage = {
	playerId: string
	playerName: string
	content: string
}

export type Chat = {
	id: string
	title: string
	messages: ChatMessage[]
}
