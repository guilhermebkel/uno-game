import SocketService from "@/Services/SocketService"
import PlayerService from "@/Services/PlayerService"

import CryptUtil from "@/Utils/CryptUtil"

import {
	Chat,
	ChatMessage,
	ChatEvents,
} from "@uno-game/protocols"

import ChatRepository from "@/Repositories/ChatRepository"

class ChatService {
	setupChat (playerId: string, chatId: string) {
		const playerData = PlayerService.getPlayerData(playerId)

		const chat: Chat = {
			id: chatId,
			title: playerData.name,
			messages: [],
		}

		this.createChat(chat)
	}

	chatExists (chatId: string) {
		const chat = ChatRepository.getChat(chatId)

		if (chat) {
			return true
		} else {
			return false
		}
	}

	pushMessage (playerId: string, chatId: string, content: string) {
		const playerData = PlayerService.getPlayerData(playerId)

		const id = CryptUtil.makeUUID()

		const message: ChatMessage = {
			playerId,
			playerName: playerData.name,
			content,
			date: Date.now(),
			id,
		}

		ChatRepository.pushMessageToChat(chatId, message)

		this.emitChatEvent(chatId, "NewMessage", chatId, message)
	}

	retrieveChat (chatId: string): Chat {
		const chat = ChatRepository.getChat(chatId)

		return chat
	}

	joinChat (chatId: string): void {
		const chat = ChatRepository.getChat(chatId)

		this.emitChatEvent(chatId, "ChatStateChanged", chat)
	}

	private createChat (chatData: Chat): void {
		ChatRepository.createChat(chatData)
	}

	// eslint-disable-next-line
	private emitChatEvent (chatId: string, event: ChatEvents, ...data: any) {
		SocketService.emitRoomEvent(chatId, event, ...data)
	}
}

export default new ChatService()
