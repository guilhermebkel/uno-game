import { Socket } from "socket.io"
import ErrorHandler from "@uno-game/error-handler"

import GameService from "@/Services/GameService"
import ChatService from "@/Services/ChatService"
import PlayerService from "@/Services/PlayerService"
import ClientService from "@/Services/ClientService"
import SocketService from "@/Services/SocketService"

import {
	Player,
	SetPlayerDataEventInput,
	SetPlayerDataEventResponse,
	CreateGameEventResponse,
	JoinGameEventInput,
	JoinGameEventResponse,
	BuyCardEventInput,
	PutCardEventInput,
	SendChatMessageEventInput,
	ChangePlayerStatusEventInput,
	ToggleReadyEventInput,
	ForceSelfDisconnectEventInput,
} from "@uno-game/protocols"

class EventHandlerModule {
	clients: Map<string, Socket> = new Map()

	onConnection (client: Socket) {
		try {
			let playerData = {} as Player

			SocketService.on<SetPlayerDataEventInput, SetPlayerDataEventResponse>(client, "SetPlayerData", async ({ player }) => {
				playerData = await PlayerService.setPlayerData(player)

				SocketService.setupListener(client, "player", playerData.id)

				await ClientService.dispatchGameHistoryConsolidated(playerData.id)

				return {
					player: playerData,
				}
			})

			SocketService.on<unknown, CreateGameEventResponse>(client, "CreateGame", async () => {
				let game = await GameService.getExistingPlayerGame(playerData.id)

				/**
				 * Prevent players from creating a lot of games.
				 */
				if (!game) {
					const chat = await ChatService.setupChat(playerData.id)

					game = await GameService.setupGame(playerData.id, chat.id)
				}

				SocketService.setupListener(client, "game", game.id)
				SocketService.setupListener(client, "chat", game.chatId)

				return {
					gameId: game.id,
				}
			})

			SocketService.on<JoinGameEventInput, JoinGameEventResponse>(client, "JoinGame", async ({ gameId }) => {
				const game = await GameService.joinGame(gameId, playerData.id)
				const chat = await ChatService.joinChat(game.chatId)

				SocketService.setupListener(client, "chat", game.chatId)
				SocketService.setupListener(client, "game", gameId)

				return {
					game,
					chat,
				}
			})

			SocketService.on<BuyCardEventInput, unknown>(client, "BuyCard", async ({ gameId }) => {
				await GameService.buyCard(playerData.id, gameId)
			})

			SocketService.on<PutCardEventInput, unknown>(client, "PutCard", async ({ gameId, cardIds, selectedColor }) => {
				await GameService.putCard(playerData.id, cardIds, gameId, selectedColor)
			})

			SocketService.on<SendChatMessageEventInput, unknown>(client, "SendChatMessage", async ({ chatId, message }) => {
				await ChatService.pushMessage(playerData.id, chatId, message)
			})

			SocketService.on<ChangePlayerStatusEventInput, unknown>(client, "ChangePlayerStatus", async ({ gameId, playerStatus }) => {
				await GameService.changePlayerStatus(gameId, playerData.id, playerStatus)
			})

			SocketService.on<ToggleReadyEventInput, unknown>(client, "ToggleReady", async ({ gameId }) => {
				await GameService.toggleReady(playerData.id, gameId)
			})

			SocketService.on<ForceSelfDisconnectEventInput, unknown>(client, "ForceSelfDisconnect", async () => {
				const purgedGames = await GameService.purgePlayer(playerData.id)

				purgedGames.forEach(purgedGame => {
					SocketService.removeListener(client, "game", purgedGame.id)
					SocketService.removeListener(client, "chat", purgedGame.chatId)
				})
			})

			SocketService.on<unknown, unknown>(client, "disconnect", async () => {
				await GameService.purgePlayer(playerData.id)
			})
		} catch (error) {
			ErrorHandler.handle(error)
		}
	}
}

export default new EventHandlerModule()
