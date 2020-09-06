import { Socket } from "socket.io"

import GameService from "@/Services/GameService"
import ChatService from "@/Services/ChatService"
import PlayerService from "@/Services/PlayerService"

import CryptUtil from "@/Utils/CryptUtil"

import { CardColors, Player } from "@uno-game/protocols"

/**
 * Usually the class which handles events from client
 */
class ListenerService {
	onConnection (client: Socket) {
		const playerData = {} as Player

		client.emit("PlayerConnected", client.id)

		client.on("SetPlayerData", (playerId: string, playerName: string) => {
			playerData.id = playerId
			playerData.name = playerName

			this.onSetPlayerData(playerId, playerName)

			client.emit("PlayerDataSet")
		})

		client.on("CreateGame", () => {
			const gameId = CryptUtil.makeShortUUID()
			const chatId = CryptUtil.makeShortUUID()

			client.join(gameId)
			client.join(chatId)

			this.onCreateGame(gameId, playerData.id, chatId)
		})

		client.on("JoinGame", (gameId: string) => {
			client.join(gameId)

			const chatId = GameService.getChatIdByGameId(gameId)

			if (chatId) {
				client.join(chatId)
			}

			this.onJoinGame(gameId, playerData.id, chatId)
		})

		client.on("BuyCard", (gameId: string) => {
			this.onBuyCard(gameId, playerData.id)
		})

		client.on("PutCard", (gameId: string, cardIds: string[], selectedColor: CardColors) => {
			this.onPutCard(gameId, playerData.id, cardIds, selectedColor)
		})

		client.on("SendChatMessage", (chatId: string, content: string) => {
			this.onSendChatMessage(playerData.id, chatId, content)
		})

		client.on("ToggleReady", (gameId: string) => {
			this.onToggleReady(gameId, playerData.id)
		})

		client.on("disconnect", () => {
			this.onPlayerDisconnect(playerData.id)
		})
	}

	private onSendChatMessage (playerId: string, chatId: string, content: string) {
		const playerExists = PlayerService.playerExists(playerId)
		const chatExists = ChatService.chatExists(chatId)

		if (playerExists && chatExists) {
			ChatService.pushMessage(playerId, chatId, content)
		}
	}

	private onJoinGame (gameId: string, playerId: string, chatId: string) {
		const gameExists = GameService.gameExists(gameId)
		const chatExists = ChatService.chatExists(chatId)

		if (gameExists) {
			GameService.joinGame(gameId, playerId)

			if (chatExists) {
				ChatService.joinChat(chatId)
			}
		}
	}

	private onCreateGame (gameId: string, playerId: string, chatId: string) {
		const playerExists = PlayerService.playerExists(playerId)

		if (playerExists) {
			GameService.setupGame(playerId, gameId, chatId)
			ChatService.setupChat(playerId, chatId)
		}
	}

	private onPlayerDisconnect (playerId: string) {
		const playerExists = PlayerService.playerExists(playerId)

		if (playerExists) {
			GameService.purgePlayer(playerId)
		}
	}

	private onBuyCard (gameId: string, playerId: string) {
		const gameExists = GameService.gameExists(gameId)
		const playerExists = PlayerService.playerExists(playerId)

		if (gameExists && playerExists) {
			GameService.buyCard(playerId, gameId)
		}
	}

	private onPutCard (gameId: string, playerId: string, cardIds: string[], selectedColor: CardColors) {
		const gameExists = GameService.gameExists(gameId)
		const playerExists = PlayerService.playerExists(playerId)

		if (gameExists && playerExists) {
			GameService.putCard(playerId, cardIds, gameId, selectedColor)
		}
	}

	private onToggleReady (gameId: string, playerId: string) {
		const gameExists = GameService.gameExists(gameId)
		const playerExists = PlayerService.playerExists(playerId)

		if (gameExists && playerExists) {
			GameService.toggleReady(playerId, gameId)
		}
	}

	private onSetPlayerData (playerId: string, playerName: string) {
		PlayerService.setPlayerData({
			id: playerId,
			name: playerName
		})
	}
}

export default new ListenerService()
