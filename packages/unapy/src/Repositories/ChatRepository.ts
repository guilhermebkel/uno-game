import { Chat, ChatMessage } from "@uno-game/protocols"

import { Store } from "@/Protocols/StoreProtocol"

import AsyncMapStoreService from "@/Services/AsyncMapStoreService"

class GameRepository {
	private static chats: Store<Chat> = new AsyncMapStoreService()

	static async createChat (chatData: Chat): Promise<void> {
		this.chats.set(chatData.id, chatData)
	}

	static async getChat (chatId: string): Promise<Chat> {
		const chat = await this.chats.getOne(chatId)

		return chat
	}

	static async pushMessageToChat (chatId: string, message: ChatMessage): Promise<void> {
		const chat = await this.chats.getOne(chatId)

		if (chat) {
			chat.messages.push(message)

			await this.chats.set(chatId, chat)
		}
	}
}

export default GameRepository
