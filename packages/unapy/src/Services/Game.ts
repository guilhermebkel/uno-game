import CardService from "@unapy/Services/Card"
import SocketService from "@unapy/Services/Socket"

import { Game, GameEvents } from "@unapy/Protocols/Game"
import { PlayerData } from "@unapy/Protocols/Player"
import { CardData } from "@unapy/Protocols/Card"

class GameService {
	static games: Map<string, Game> = new Map()

	static setupGame (playerId: string, gameId: string) {
		const cards = CardService.setupInitialCards()

		const initialPlayer: PlayerData = {
			id: playerId,
			name: "player",
			handCards: [],
			usedCards: []
		}

		const game: Game = {
			id: gameId,
			currentPlayerIndex: 0,
			currentGameColor: null,
			title: "test",
			availableCards: [],
			usedCards: [],
			players: [initialPlayer],
			cards
		}

		GameService.setGameData(gameId, game)

		GameService.emitGameEvent(gameId, "GameCreated", game)
	}

	static startGame (gameId: string) {
		const game = GameService.getGame(gameId)

		const allCards = [...game?.cards]

		const currentPlayer = game?.players?.[0]

		GameService.setGameData(gameId, {
			...game,
			players: game?.players.map(player => {
				const handCards: CardData[] = []

				new Array(7).forEach(() => {
					const selectedCard = allCards.shift()

					handCards.push(selectedCard)
				})

				return {
					...player,
					handCards: handCards.map(handCard => ({
						...handCard,
						canBeUsed: player.id === currentPlayer.id
					}))
				}
			}),
			availableCards: allCards
		})

		GameService.emitGameEvent(gameId, "GameStarted", game)
	}

	static removePlayer (gameId: string, playerId: string) {
		const game = GameService.getGame(gameId)

		GameService.setGameData(gameId, {
			...game,
			players: game?.players?.filter(player => player.id !== playerId)
		})
	}

	static getGame (gameId: string) {
		const game = GameService.games.get(gameId)

		return game
	}

	static nextTurn (gameId: string) {
		const game = GameService.getGame(gameId)

		const totalPlayers = game?.players?.length
		const currentPlayerIndex = game?.currentPlayerIndex
		const expectedNextPlayerIndex = currentPlayerIndex + 1

		const nextPlayerIndex = (expectedNextPlayerIndex >= totalPlayers) ? 0 : expectedNextPlayerIndex
		const nextPlayer = game?.players?.[nextPlayerIndex]

		const playersWithCardUsability = GameService.buildPlayersWithCardUsability(nextPlayer.id, gameId)

		GameService.setGameData(gameId, {
			...game,
			currentPlayerIndex: nextPlayerIndex,
			players: playersWithCardUsability
		})
	}

	static buyCard (playerId: string, gameId: string) {
		const game = GameService.getGame(gameId)

		if (game?.availableCards?.length === 0) {
			return
		}

		const available = [...game?.availableCards]

		const card = available.shift()

		GameService.setGameData(gameId, {
			...game,
			players: game?.players?.map(player => {
				if (player.id === playerId) {
					return {
						...player,
						handCards: [card, ...player?.handCards]
					}
				} else {
					return player
				}
			}),
			availableCards: available
		})
	}

	static putCard (playerId: string, cardId: string, gameId: string) {
		const game = GameService.getGame(gameId)

		const player = game?.players?.find(player => player.id === playerId)

		const card = player?.handCards?.find(card => card.id === cardId)

		GameService.setGameData(gameId, {
			...game,
			players: game?.players?.map(player => {
				if (player.id === playerId) {
					return {
						...player,
						handCards: player?.handCards?.filter(card => card.id !== cardId),
						usedCards: [card, ...player?.usedCards]
					}
				} else {
					return player
				}
			}),
			usedCards: [card, ...game?.usedCards]
		})
	}

	private static emitGameEvent (gameId: string, event: GameEvents, game?: Game) {
		SocketService.emitRoomEvent(gameId, event, game)
	}

	private static setGameData (gameId: string, game: Game) {
		GameService.games.set(gameId, game)

		GameService.emitGameEvent(gameId, "GameStateChanged", game)
	}

	private static getTopStackCard (gameId: string) {
		const game = GameService.getGame(gameId)

		return game?.usedCards?.[0]
	}

	private static buildPlayersWithCardUsability (currentPlayerId: string, gameId: string): PlayerData[] {
		const game = GameService.getGame(gameId)
		const topStackCard = GameService.getTopStackCard(gameId)

		const playersWithCardUsability = game?.players?.map(player => {
			if (currentPlayerId === player.id) {
				return {
					...player,
					handCards: player?.handCards?.map(handCard => ({
						...handCard,
						canBeUsed: topStackCard.color === handCard.color
					}))
				}
			} else {
				return {
					...player,
					handCards: player?.handCards?.map(handCard => ({
						...handCard,
						canBeUsed: false
					}))
				}
			}
		})

		return playersWithCardUsability
	}
}

export default GameService
