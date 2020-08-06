import { Socket } from "socket.io"

import GameService from "@/Services/GameService"
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
			const roomId = CryptUtil.makeShortUUID()

			client.join(roomId)

			this.onCreateGame(roomId, playerData.id)
		})

		client.on("JoinGame", (roomId: string) => {
			client.join(roomId)

			this.onJoinGame(roomId, playerData.id)
		})

		client.on("BuyCard", (roomId: string) => {
			this.onBuyCard(roomId, playerData.id)
		})

		client.on("PutCard", (roomId: string, cardIds: string[], selectedColor: CardColors) => {
			this.onPutCard(roomId, playerData.id, cardIds, selectedColor)
		})

		client.on("ToggleReady", (roomId: string) => {
			this.onToggleReady(roomId, playerData.id)
		})

		client.on("disconnect", () => {
			this.onPlayerDisconnect(playerData.id)
		})
	}

	private onJoinGame (gameId: string, playerId: string) {
		const gameExists = GameService.gameExists(gameId)

		if (gameExists) {
			GameService.joinGame(gameId, playerId)
		}
	}

	private onCreateGame (gameId: string, playerId: string) {
		const playerExists = PlayerService.playerExists(playerId)

		if (playerExists) {
			GameService.setupGame(playerId, gameId)
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
