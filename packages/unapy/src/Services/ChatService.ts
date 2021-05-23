import SocketService from "@/Services/SocketService"
import PlayerService from "@/Services/PlayerService"

import CryptUtil from "@/Utils/CryptUtil"

import {
	Chat,
	ChatMessage,
	ChatEvents,
	NewMessageEventData,
} from "@uno-game/protocols"

import ChatRepository from "@/Repositories/ChatRepository"

class ChatService {
	async setupChat (playerId: string): Promise<Chat> {
		const playerData = await PlayerService.getPlayerData(playerId)

		const chat: Chat = {
			id: CryptUtil.makeShortUUID(),
			title: playerData.name,
			messages: [],
		}

		await this.createChat(chat)

		return chat
	}

	async chatExists (chatId: string): Promise<boolean> {
		const chat = await ChatRepository.getChat(chatId)

		if (chat) {
			return true
		} else {
			return false
		}
	}

	async pushMessage (playerId: string, chatId: string, content: string): Promise<void> {
		const playerData = await PlayerService.getPlayerData(playerId)

		const id = CryptUtil.makeUUID()

		const message: ChatMessage = {
			playerId,
			playerName: playerData.name,
			content,
			date: Date.now(),
			id,
		}

		await ChatRepository.pushMessageToChat(chatId, message)

		this.emitChatEvent<NewMessageEventData>(chatId, "NewMessage", {
			chatId,
			message,
		})
	}

	async retrieveChat (chatId: string): Promise<Chat> {
		const chat = await ChatRepository.getChat(chatId)

		return chat
	}

	async joinChat (chatId: string): Promise<Chat> {
		const chat = await ChatRepository.getChat(chatId)

		return chat
	}

	private async createChat (chatData: Chat): Promise<void> {
		await ChatRepository.createChat(chatData)
	}

	private emitChatEvent<Data extends unknown> (chatId: string, event: ChatEvents, data: Data) {
		SocketService.emitRoomEvent("chat", chatId, event, data)
	}
}

export default new ChatService()
