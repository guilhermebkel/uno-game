import { Chat, ChatMessage } from "@uno-game/protocols"

class GameRepository {
	private static chats: Map<string, Chat> = new Map()

	static createChat (chatData: Chat): void {
		this.chats.set(chatData.id, chatData)
	}

	static getChat (chatId: string): Chat {
		const chat = this.chats.get(chatId)

		return chat
	}

	static pushMessageToChat (chatId: string, message: ChatMessage): void {
		const chat = this.chats.get(chatId)

		if (chat) {
			chat.messages.push(message)

			this.chats.set(chatId, chat)
		}
	}
}

export default GameRepository
