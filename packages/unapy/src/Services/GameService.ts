import CardService from "@unapy/Services/CardService"
import SocketService from "@unapy/Services/SocketService"
import PlayerService from "@unapy/Services/PlayerService"

import { Game, GameEvents } from "@shared/protocols/Game"
import { PlayerData, CurrentPlayerInfo, CurrentPlayerStatus } from "@shared/protocols/Player"
import { CardData } from "@shared/protocols/Card"

class GameService {
	static games: Map<string, Game> = new Map()

	static setupGame (playerId: string, gameId: string) {
		const cards = CardService.setupInitialCards()

		const playerData = PlayerService.getPlayerData(playerId)

		const initialPlayer: PlayerData = {
			id: playerId,
			name: playerData.name,
			handCards: [],
			usedCards: [],
			status: "online",
			ready: false,
			isCurrentRoundPlayer: false,
			canBuyCard: false
		}

		const game: Game = {
			maxPlayers: 4,
			type: "public",
			status: "waiting",
			round: 0,
			id: gameId,
			currentPlayerIndex: 0,
			currentGameColor: null,
			title: gameId,
			availableCards: [],
			usedCards: [],
			players: [initialPlayer],
			cards
		}

		this.setGameData(gameId, game)

		this.emitGameEvent(gameId, "GameCreated", game)
	}

	static joinGame (gameId: string, playerId: string) {
		const game = this.getGame(gameId)

		const player = game?.players?.find(player => player.id === playerId)

		if (game.status === "waiting" && game.players.length < game.maxPlayers && !player) {
			this.addPlayer(gameId, playerId)
		}

		this.emitGameEvent(gameId, "PlayerJoined", game)
	}

	static purgePlayer (playerId: string) {
		for (const game of this.games.values()) {
			const isPlayerInGame = game?.players?.find(player => player?.id === playerId)

			if (isPlayerInGame) {
				this.disconnectPlayer(game?.id, playerId)
			}
		}
	}

	static toggleReady (playerId: string, gameId: string) {
		const game = this.getGame(gameId)

		game.players = game?.players?.map(player => {
			if (player.id === playerId) {
				return {
					...player,
					ready: !player.ready
				}
			} else {
				return player
			}
		})

		this.setGameData(gameId, game)

		const areAllPlayersReady = game?.players?.every(player => player.ready)

		if (areAllPlayersReady) {
			this.startGame(gameId)
		}
	}

	static getGameList () {
		const games: Game[] = []

		for (const game of this.games.values()) {
			games.push(game)
		}

		return games
	}

	static buyCard (playerId: string, gameId: string) {
		const currentPlayerInfo = this.getCurrentPlayerInfo(gameId)

		if (currentPlayerInfo.id !== playerId) {
			return
		}

		const game = this.getGame(gameId)

		if (game?.availableCards?.length === 0) {
			return
		}

		const available = [...game?.availableCards]

		const card = available.shift()

		game.players = game?.players?.map(player => {
			if (player.id === playerId) {
				return {
					...player,
					handCards: [card, ...player?.handCards]
				}
			} else {
				return player
			}
		})

		game.availableCards = available

		this.setGameData(gameId, game)

		this.nextTurn(gameId)
	}

	static putCard (playerId: string, cardId: string, gameId: string) {
		const currentPlayerInfo = this.getCurrentPlayerInfo(gameId)

		if (currentPlayerInfo.id !== playerId) {
			return
		}

		const game = this.getGame(gameId)

		const player = game?.players?.find(player => player.id === playerId)

		const card = player?.handCards?.find(card => card.id === cardId)

		game.players = game?.players?.map(player => {
			if (player.id === playerId) {
				return {
					...player,
					handCards: player?.handCards?.filter(card => card.id !== cardId),
					usedCards: [card, ...player?.usedCards]
				}
			} else {
				return player
			}
		})

		game.usedCards = [card, ...game?.usedCards]

		game.currentGameColor = card?.color

		this.setGameData(gameId, game)

		this.nextTurn(gameId)
	}

	private static startGame (gameId: string) {
		const game = this.getGame(gameId)

		const allCards = [...game?.cards]

		const currentPlayer = game?.players?.[0]

		game.status = "playing"

		game.players = game?.players.map(player => {
			const handCards: CardData[] = []

			for (let i = 0; i < 7; i++) {
				const selectedCard = allCards.shift()
				handCards.push(selectedCard)
			}

			return {
				...player,
				isCurrentRoundPlayer: player.id === currentPlayer.id,
				handCards: handCards.map(handCard => ({
					...handCard,
					canBeUsed: player.id === currentPlayer.id
				})),
				canBuyCard: false
			}
		})

		game.availableCards = allCards

		this.setGameData(gameId, game)

		this.emitGameEvent(gameId, "GameStarted", game)
	}

	private static addPlayer (gameId: string, playerId: string) {
		const game = this.getGame(gameId)

		const playerData = PlayerService.getPlayerData(playerId)

		game.players = [
			...game?.players,
			{
				id: playerId,
				name: playerData.name,
				handCards: [],
				usedCards: [],
				status: "online",
				ready: false,
				isCurrentRoundPlayer: false,
				canBuyCard: false
			}
		]

		this.setGameData(gameId, game)
	}

	private static disconnectPlayer (gameId: string, playerId: string) {
		const game = this.getGame(gameId)

		if (game.status === "waiting") {
			game.players = game?.players?.filter(player => player.id !== playerId)
		}

		if (game.status === "playing") {
			game.players = game?.players?.map(player => {
				if (player.id === playerId) {
					return {
						...player,
						status: "offline"
					}
				} else {
					return player
				}
			})
		}

		this.setGameData(gameId, game)
	}

	private static getGame (gameId: string) {
		const game = this.games.get(gameId)

		return game
	}

	private static nextTurn (gameId: string) {
		const currentPlayerInfo = this.getCurrentPlayerInfo(gameId)

		if (currentPlayerInfo.status === "winner") {
			this.emitGameEvent(gameId, "PlayerWon", currentPlayerInfo.id)
			return this.endGame(gameId)
		}

		if (currentPlayerInfo.status === "uno") {
			this.emitGameEvent(gameId, "PlayerUno", currentPlayerInfo.id)
		}

		const game = this.getGame(gameId)

		const totalPlayers = game?.players?.length
		const currentPlayerIndex = game?.currentPlayerIndex
		const expectedNextPlayerIndex = currentPlayerIndex + 1

		const nextPlayerIndex = (expectedNextPlayerIndex >= totalPlayers) ? 0 : expectedNextPlayerIndex
		const nextPlayer = game?.players?.[nextPlayerIndex]

		const playersWithCardUsability = this.buildPlayersWithCardUsability(nextPlayer.id, gameId)

		game.round++

		game.currentPlayerIndex = nextPlayerIndex

		game.players = playersWithCardUsability

		this.setGameData(gameId, game)
	}

	private static emitGameEvent (gameId: string, event: GameEvents, data?: Game | any) {
		SocketService.emitRoomEvent(gameId, event, data)
	}

	private static setGameData (gameId: string, game: Game) {
		this.games.set(gameId, game)

		this.emitGameEvent(gameId, "GameStateChanged", game)
	}

	private static getTopStackCard (gameId: string) {
		const game = this.getGame(gameId)

		return game?.usedCards?.[0]
	}

	private static buildPlayersWithCardUsability (currentPlayerId: string, gameId: string): PlayerData[] {
		const game = this.getGame(gameId)
		const topStackCard = this.getTopStackCard(gameId)

		const playersWithCardUsability = game?.players?.map(player => {
			if (currentPlayerId === player.id) {
				const handCards = player?.handCards?.map(handCard => ({
					...handCard,
					canBeUsed: (
						topStackCard?.color === handCard.color ||
						handCard.type === "change-color" ||
						handCard.type === "buy-4"
					)
				}))

				return {
					...player,
					isCurrentRoundPlayer: true,
					canBuyCard: handCards.every(card => !card.canBeUsed),
					handCards
				}
			} else {
				return {
					...player,
					isCurrentRoundPlayer: false,
					canBuyCard: false,
					handCards: player?.handCards?.map(handCard => ({
						...handCard,
						canBeUsed: false
					}))
				}
			}
		})

		return playersWithCardUsability
	}

	private static getCurrentPlayerInfo (gameId: string): CurrentPlayerInfo {
		const game = this.getGame(gameId)

		const { players } = game

		const currentPlayer = players[game?.currentPlayerIndex]

		const currentPlayerId = currentPlayer?.id
		let status: CurrentPlayerStatus

		/**
		 * In case the current player has no card on hand, he's the winner
		 */
		if (currentPlayer?.handCards.length === 0) {
			status = "winner"
		/**
		 * In case the player has only one card, he's made uno
		 */
		} else if (currentPlayer?.handCards.length === 1) {
			status = "uno"
		}

		return {
			id: currentPlayerId,
			status
		}
	}

	private static endGame (gameId: string) {
		const game = this.getGame(gameId)

		game.status = "ended"

		this.setGameData(gameId, game)

		this.emitGameEvent(gameId, "GameEnded")
	}
}

export default GameService
