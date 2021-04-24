import { Socket } from "socket.io"
import ErrorHandler from "@uno-game/error-handler"

import GameService from "@/Services/GameService"
import ChatService from "@/Services/ChatService"
import PlayerService from "@/Services/PlayerService"
import ClientService from "@/Services/ClientService"
import SocketService from "@/Services/SocketService"

import CryptUtil from "@/Utils/CryptUtil"

import { CardColors, Player, PlayerStatus } from "@uno-game/protocols"

class EventHandlerModule {
	clients: Map<string, Socket> = new Map()

	onConnection (client: Socket) {
		try {
			const playerData = {} as Player

			SocketService.setupPlayerListener(client, client.id)
			SocketService.emitPlayerEvent(client.id, "PlayerConnected")

			SocketService.on(client, "SetPlayerData", async (playerId: string, playerName: string) => {
				playerData.id = playerId
				playerData.name = playerName

				SocketService.setupPlayerListener(client, playerId)

				await this.onSetPlayerData(playerId, playerName)

				SocketService.emitPlayerEvent(playerId, "PlayerDataSet")
			})

			SocketService.on(client, "CreateGame", async () => {
				const existingGame = await GameService.getExistingPlayerGame(playerData.id)

				/**
				 * Prevent players from creating a lot of games.
				 */
				if (existingGame) {
					SocketService.setupGameListener(client, existingGame.id)
					SocketService.setupChatListener(client, existingGame.chatId)

					GameService.emitGameEvent(existingGame.id, "GameCreated", existingGame)
				} else {
					const gameId = CryptUtil.makeShortUUID()
					const chatId = CryptUtil.makeShortUUID()

					SocketService.setupGameListener(client, gameId)
					SocketService.setupChatListener(client, chatId)

					await this.onCreateGame(gameId, playerData.id, chatId)
				}
			})

			SocketService.on(client, "JoinGame", async (gameId: string) => {
				SocketService.setupGameListener(client, gameId)

				const chatId = await GameService.getChatIdByGameId(gameId)

				if (chatId) {
					SocketService.setupChatListener(client, chatId)
				}

				await this.onJoinGame(gameId, playerData.id, chatId)
			})

			SocketService.on(client, "BuyCard", async (gameId: string) => {
				await this.onBuyCard(gameId, playerData.id)
			})

			SocketService.on(client, "PutCard", async (gameId: string, cardIds: string[], selectedColor: CardColors) => {
				await this.onPutCard(gameId, playerData.id, cardIds, selectedColor)
			})

			SocketService.on(client, "SendChatMessage", async (chatId: string, content: string) => {
				await this.onSendChatMessage(playerData.id, chatId, content)
			})

			SocketService.on(client, "ChangePlayerStatus", async (gameId: string, playerStatus: PlayerStatus) => {
				await this.onChangePlayerStatus(playerData.id, gameId, playerStatus)
			})

			SocketService.on(client, "ToggleReady", async (gameId: string) => {
				await this.onToggleReady(gameId, playerData.id)
			})

			SocketService.on(client, "ForceSelfDisconnect", async (gameId: string) => {
				await this.onPlayerDisconnect(playerData.id)

				client.leave(gameId)
				SocketService.emitPlayerEvent(playerData.id, "SelfDisconnected")
			})

			SocketService.on(client, "disconnect", async () => {
				await this.onPlayerDisconnect(playerData.id)
			})
		} catch (error) {
			ErrorHandler.handle(error)
		}
	}

	private async onChangePlayerStatus (playerId: string, gameId: string, playerStatus: PlayerStatus): Promise<void> {
		const playerExists = await PlayerService.playerExists(playerId)
		const gameExists = await GameService.gameExists(gameId)

		if (playerExists && gameExists) {
			await GameService.changePlayerStatus(gameId, playerId, playerStatus)
		}
	}

	private async onSendChatMessage (playerId: string, chatId: string, content: string): Promise<void> {
		const playerExists = await PlayerService.playerExists(playerId)
		const chatExists = await ChatService.chatExists(chatId)

		if (playerExists && chatExists) {
			await ChatService.pushMessage(playerId, chatId, content)
		}
	}

	private async onJoinGame (gameId: string, playerId: string, chatId: string): Promise<void> {
		const gameExists = await GameService.gameExists(gameId)
		const chatExists = await ChatService.chatExists(chatId)
		const playerExists = await PlayerService.playerExists(playerId)

		if (gameExists && playerExists) {
			await GameService.joinGame(gameId, playerId)

			if (chatExists) {
				await ChatService.joinChat(chatId)
			}
		}
	}

	private async onCreateGame (gameId: string, playerId: string, chatId: string): Promise<void> {
		const playerExists = await PlayerService.playerExists(playerId)

		if (playerExists) {
			await GameService.setupGame(playerId, gameId, chatId)
			await ChatService.setupChat(playerId, chatId)
		}
	}

	private async onPlayerDisconnect (playerId: string): Promise<void> {
		const playerExists = await PlayerService.playerExists(playerId)

		if (playerExists) {
			await GameService.purgePlayer(playerId)
		}
	}

	private async onBuyCard (gameId: string, playerId: string): Promise<void> {
		const gameExists = await GameService.gameExists(gameId)
		const playerExists = await PlayerService.playerExists(playerId)

		if (gameExists && playerExists) {
			await GameService.buyCard(playerId, gameId)
		}
	}

	private async onPutCard (gameId: string, playerId: string, cardIds: string[], selectedColor: CardColors): Promise<void> {
		const gameExists = await GameService.gameExists(gameId)
		const playerExists = await PlayerService.playerExists(playerId)

		if (gameExists && playerExists) {
			await GameService.putCard(playerId, cardIds, gameId, selectedColor)
		}
	}

	private async onToggleReady (gameId: string, playerId: string): Promise<void> {
		const gameExists = await GameService.gameExists(gameId)
		const playerExists = await PlayerService.playerExists(playerId)

		if (gameExists && playerExists) {
			await GameService.toggleReady(playerId, gameId)
		}
	}

	private async onSetPlayerData (playerId: string, playerName: string): Promise<void> {
		await PlayerService.setPlayerData({
			id: playerId,
			name: playerName,
		})

		await ClientService.dispatchGameHistoryConsolidated(playerId)
	}
}

export default new EventHandlerModule()
