import { Chat, ChatMessage } from "@uno-game/protocols"

class GameRepository {
	private static chats: Map<string, Chat> = new Map()

	static async createChat (chatData: Chat): Promise<void> {
		this.chats.set(chatData.id, chatData)
	}

	static async getChat (chatId: string): Promise<Chat> {
		const chat = this.chats.get(chatId)

		return chat
	}

	static async pushMessageToChat (chatId: string, message: ChatMessage): Promise<void> {
		const chat = this.chats.get(chatId)

		if (chat) {
			chat.messages.push(message)

			this.chats.set(chatId, chat)
		}
	}
}

export default GameRepository
