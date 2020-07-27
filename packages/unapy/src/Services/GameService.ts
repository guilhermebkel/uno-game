import CardService from "@/Services/CardService"
import SocketService from "@/Services/SocketService"
import PlayerService from "@/Services/PlayerService"

import NumberUtil from "@/Utils/NumberUtil"

import {
	Game,
	GameEvents,
	PlayerData,
	CurrentPlayerInfo,
	CurrentPlayerStatus,
	CardData,
	CardTypes
} from "@uno-game/protocols"

import GameRepository from "@/Repositories/GameRepository"

class GameService {
	setupGame (playerId: string, gameId: string) {
		const cards = CardService.setupRandomCards()

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
			nextPlayerIndex: 1,
			currentGameColor: null,
			title: playerData.name,
			availableCards: [],
			usedCards: [],
			players: [initialPlayer],
			cards,
			direction: "clockwise",
			currentCardCombo: []
		}

		this.setGameData(gameId, game)

		this.emitGameEvent(gameId, "GameCreated", game)
	}

	gameExists (gameId: string) {
		const game = GameRepository.getGame(gameId)

		if (game) {
			return true
		} else {
			return false
		}
	}

	joinGame (gameId: string, playerId: string) {
		const game = this.getGame(gameId)

		const player = game?.players?.find(player => player.id === playerId)

		const gameHasNotStarted = game.status === "waiting"
		const gameIsNotFull = game.players.length < game.maxPlayers
		const playerIsNotOnGame = !player

		if (gameHasNotStarted && gameIsNotFull && playerIsNotOnGame) {
			this.addPlayer(gameId, playerId)
		}

		this.emitGameEvent(gameId, "PlayerJoined", game)
	}

	purgePlayer (playerId: string) {
		const games = this.getGameList()

		games.forEach(game => {
			const isPlayerOnGame = game?.players?.find(player => player?.id === playerId)

			if (isPlayerOnGame) {
				this.disconnectPlayer(game?.id, playerId)
			}
		})
	}

	toggleReady (playerId: string, gameId: string) {
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
		const isThereMoreThanOnePlayer = game?.players?.length > 1

		if (areAllPlayersReady && isThereMoreThanOnePlayer) {
			this.startGame(gameId)
		}
	}

	getGameList () {
		return GameRepository.getGameList()
	}

	buyCard (playerId: string, gameId: string) {
		const currentPlayerInfo = this.getCurrentPlayerInfo(gameId)

		if (currentPlayerInfo.id !== playerId) {
			return
		}

		const game = this.getGame(gameId)

		/**
		 * Just to make sure the game will only stop if someone
		 * wins it.
		 */
		const availableCardsAreOver = game.availableCards.length === 0

		if (availableCardsAreOver) {
			const additionalCards = CardService.setupRandomCards()

			game.cards = [
				...game.cards,
				...additionalCards
			]

			game.availableCards = [
				...game.availableCards,
				...additionalCards
			]
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

		game.players = this.buildPlayersWithCardUsability(currentPlayerInfo.id, gameId)

		this.setGameData(gameId, game)
	}

	putCard (playerId: string, cardIds: string[], gameId: string) {
		let game = this.getGame(gameId)

		const player = game?.players?.find(player => player.id === playerId)

		const cards = player?.handCards?.filter(card => cardIds.includes(card.id))

		game.players = game?.players?.map(player => {
			if (player.id === playerId) {
				return {
					...player,
					handCards: player?.handCards?.filter(card => !cardIds.includes(card.id)),
					usedCards: [...cards, ...player?.usedCards]
				}
			} else {
				return player
			}
		})

		game.usedCards = [...cards, ...game?.usedCards]

		game.currentGameColor = cards[0]?.color

		this.setGameData(gameId, game)

		const cardTypes = cards.map(card => card.type)

		game = this.buildGameWithCardEffect(gameId, cardTypes)

		this.setGameData(gameId, game)

		this.nextTurn(gameId)
	}

	private startGame (gameId: string) {
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

	private addPlayer (gameId: string, playerId: string) {
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

	private disconnectPlayer (gameId: string, playerId: string) {
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

	private getGame (gameId: string) {
		const game = GameRepository.getGame(gameId)

		return game
	}

	private nextTurn (gameId: string) {
		const currentPlayerInfo = this.getCurrentPlayerInfo(gameId)

		if (currentPlayerInfo.status === "winner") {
			this.emitGameEvent(gameId, "PlayerWon", currentPlayerInfo.id)
			return this.endGame(gameId)
		}

		if (currentPlayerInfo.status === "uno") {
			this.emitGameEvent(gameId, "PlayerUno", currentPlayerInfo.id)
		}

		const game = this.getGame(gameId)

		const expectedNextPlayerIndex = game?.nextPlayerIndex

		const nextPlayerIndex = NumberUtil.getSanitizedValueWithBoundaries(expectedNextPlayerIndex, game?.players?.length, 0)

		if (game.direction === "clockwise") {
			game.nextPlayerIndex = nextPlayerIndex + 1
		} else {
			game.nextPlayerIndex = nextPlayerIndex - 1
		}

		const nextPlayer = game?.players?.[nextPlayerIndex]

		game.players = this.buildPlayersWithCardUsability(nextPlayer.id, gameId)

		game.round++

		game.currentPlayerIndex = nextPlayerIndex

		this.setGameData(gameId, game)
	}

	// eslint-disable-next-line
	private emitGameEvent (gameId: string, event: GameEvents, ...data: any) {
		SocketService.emitRoomEvent(gameId, event, ...data)
	}

	private setGameData (gameId: string, game: Game) {
		GameRepository.setGameData(gameId, game)

		this.emitGameEvent(gameId, "GameStateChanged", game)
	}

	private getTopStackCard (gameId: string) {
		const game = this.getGame(gameId)

		return game?.usedCards?.[0]
	}

	private buildGameWithCardEffect (gameId: string, cardTypes: CardTypes[]): Game {
		const game = this.getGame(gameId)

		let playerAffected: PlayerData

		if (cardTypes.every(cardType => cardType === "reverse")) {
			cardTypes.forEach(() => {
				if (game.direction === "clockwise") {
					game.direction = "counterclockwise"

					game.nextPlayerIndex = game.currentPlayerIndex - 1
				} else {
					game.direction = "clockwise"

					game.nextPlayerIndex = game.currentPlayerIndex + 1
				}
			})
		}

		if (cardTypes.every(cardType => cardType === "block")) {
			cardTypes.forEach(() => {
				const nextPlayerIndex = NumberUtil.getSanitizedValueWithBoundaries(game?.nextPlayerIndex, game?.players?.length, 0)
				playerAffected = game?.players?.[nextPlayerIndex]

				if (game.direction === "clockwise") {
					game.nextPlayerIndex++
				} else {
					game.nextPlayerIndex--
				}

				this.emitGameEvent(game.id, "PlayerBlocked", playerAffected?.id)
			})
		}

		if (cardTypes.every(cardType => cardType === "buy-2") || cardTypes.every(cardType => cardType === "buy-4")) {
			const currentCardComboType = cardTypes[0]

			game.currentCardCombo = [
				...game.currentCardCombo,
				...cardTypes
			]

			const nextPlayerIndex = NumberUtil.getSanitizedValueWithBoundaries(game?.nextPlayerIndex, game?.players?.length, 0)
			playerAffected = game?.players?.[nextPlayerIndex]

			const affectedPlayerCanMakeCardBuyCombo = playerAffected.handCards
				.some(card => (
					(card.type === "buy-2" && currentCardComboType === "buy-4" && card.color === game.currentGameColor) ||
					(card.type === "buy-2" && currentCardComboType === "buy-2") ||
					(card.type === "buy-4")
				))

			let amountToBuy = 0

			game.currentCardCombo.forEach(cardType => {
				if (cardType === "buy-2") {
					amountToBuy += 2
				} else if (cardType === "buy-4") {
					amountToBuy += 4
				}
			})

			if (affectedPlayerCanMakeCardBuyCombo) {
				this.emitGameEvent(game.id, "CardStackBuyCardsCombo", amountToBuy)
			} else {
				/**
				 * In case there are no more cards to buy.
				 */
				const areThereSufficientCardsToBuy = game.availableCards.length - amountToBuy > 0

				if (!areThereSufficientCardsToBuy) {
					const additionalCards = CardService.setupRandomCards()

					game.cards = [
						...game.cards,
						...additionalCards
					]

					game.availableCards = [
						...game.availableCards,
						...additionalCards
					]
				}

				let available = [...game?.availableCards]

				const cards = available.slice(0, amountToBuy)

				available = available.slice(amountToBuy, available.length - 1)

				game.players = game?.players?.map(player => {
					if (player.id === playerAffected.id) {
						return {
							...player,
							handCards: [...cards, ...player?.handCards]
						}
					} else {
						return player
					}
				})

				game.availableCards = available
				game.currentCardCombo = []

				this.emitGameEvent(game.id, "PlayerBuyCards", playerAffected?.id, amountToBuy)
			}
		}

		return game
	}

	private buildPlayersWithCardUsability (currentPlayerId: string, gameId: string): PlayerData[] {
		const game = this.getGame(gameId)

		const topStackCard = this.getTopStackCard(gameId)

		const playersWithCardUsability = game?.players?.map(player => {
			if (currentPlayerId === player.id) {
				const handCards = player?.handCards?.map(handCard => ({
					...handCard,
					canBeUsed: (
						topStackCard?.color === handCard.color ||
						handCard.type === "change-color" ||
						handCard.type === "buy-4" ||
						topStackCard?.type === handCard.type
					),
					canBeCombed: game.currentCardCombo.includes(handCard.type)
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
						canBeUsed: false,
						canBeCombed: false
					}))
				}
			}
		})

		return playersWithCardUsability
	}

	private getCurrentPlayerInfo (gameId: string): CurrentPlayerInfo {
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

	private endGame (gameId: string) {
		const game = this.getGame(gameId)

		game.status = "ended"

		this.setGameData(gameId, game)

		this.emitGameEvent(gameId, "GameEnded")
	}
}

export default new GameService()
