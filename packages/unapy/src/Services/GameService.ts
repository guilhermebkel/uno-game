import CardService from "@/Services/CardService"
import SocketService from "@/Services/SocketService"
import PlayerService from "@/Services/PlayerService"
import GameRoundService from "@/Services/GameRoundService"
import ClientService from "@/Services/ClientService"

import NumberUtil from "@/Utils/NumberUtil"

import environmentConfig from "@/Config/environment"

import {
	Game,
	GameEvents,
	PlayerData,
	CurrentPlayerInfo,
	CurrentPlayerGameStatus,
	CardData,
	CardColors,
	PlayerStatus,
} from "@uno-game/protocols"

import GameRepository from "@/Repositories/GameRepository"

class GameService {
	setupGame (playerId: string, gameId: string, chatId: string) {
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
			canBuyCard: false,
		}

		const game: Game = {
			maxPlayers: 6,
			type: "public",
			status: "waiting",
			round: 0,
			id: gameId,
			chatId,
			currentPlayerIndex: 0,
			nextPlayerIndex: 1,
			currentGameColor: null,
			title: playerData.name,
			availableCards: [],
			usedCards: [],
			players: [initialPlayer],
			cards,
			direction: "clockwise",
			currentCardCombo: {
				cardTypes: [],
				amountToBuy: 0,
			},
			maxRoundDurationInSeconds: environmentConfig.isDev ? 200000 : 20,
			createdAt: Date.now(),
		}

		this.setGameData(gameId, game)

		this.emitGameEvent(gameId, "GameCreated", game)
	}

	getChatIdByGameId (gameId: string) {
		const game = GameRepository.getGame(gameId)

		return game?.chatId
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

		const gameRoundRemainingTimeInSeconds = this.getRoundRemainingTimeInSeconds(gameId)

		GameRoundService.emitGameRoundEvent(gameId, "GameRoundRemainingTimeChanged", gameRoundRemainingTimeInSeconds)

		if (!playerIsNotOnGame) {
			game.players = this.buildPlayersWithChangedPlayerStatus(gameId, playerId, "online")
		}

		this.emitGameEvent(gameId, "PlayerJoined", game)
	}

	purgePlayer (playerId: string) {
		const games = this.getGameList()

		games.forEach(game => {
			const isPlayerOnGame = game?.players?.find(player => player?.id === playerId)

			if (isPlayerOnGame) {
				this.disconnectPlayer(game?.id, playerId)

				this.emitGameEvent(game?.id, "PlayerLeft", game)
			}
		})
	}

	toggleReady (playerId: string, gameId: string) {
		const game = this.getGame(gameId)

		game.players = game?.players?.map(player => {
			if (player.id === playerId) {
				return {
					...player,
					ready: !player.ready,
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

		const player = game?.players?.find(player => player.id === currentPlayerInfo.id)

		const needToBuyCard = player?.handCards?.every(card => !card.canBeUsed)

		if (!needToBuyCard) {
			return
		}

		const available = [...game?.availableCards]

		const card = available.shift()

		game.players = game?.players?.map(player => {
			if (player.id === playerId) {
				return {
					...player,
					handCards: [card, ...player?.handCards],
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

	putCard (playerId: string, cardIds: string[], gameId: string, selectedColor: CardColors) {
		const currentPlayerInfo = this.getCurrentPlayerInfo(gameId)

		if (currentPlayerInfo.id !== playerId) {
			return
		}

		let game = this.getGame(gameId)

		const player = game?.players?.find(player => player.id === playerId)

		const cards: CardData[] = []

		cardIds.forEach(cardId => {
			const card = player?.handCards?.find(card => card.id === cardId)

			cards.push(card)
		})

		game.players = game?.players?.map(player => {
			if (player.id === playerId) {
				return {
					...player,
					handCards: player?.handCards?.filter(card => !cardIds.includes(card.id)),
					usedCards: [...cards, ...player?.usedCards],
				}
			} else {
				return player
			}
		})

		/**
		 * We keep flowing the used cards back to stack, in order to help
		 * keeping the game up till someone wins it.
		 */
		const usedCards = [...cards, ...game?.usedCards]

		const inStackCards = usedCards.slice(0, 10)
		let outStackCards = usedCards.slice(10, usedCards.length)

		outStackCards = outStackCards.map(card => {
			if (card.color === "black") {
				return {
					...card,
					selectedColor: null,
					src: card.possibleColors.black,
				}
			} else {
				return card
			}
		})

		game.usedCards = inStackCards
		game.availableCards = [
			...game.availableCards,
			...outStackCards,
		]

		game.currentGameColor = cards[0]?.color

		this.setGameData(gameId, game)

		game = this.buildGameWithCardEffect(gameId, cards, selectedColor)

		this.setGameData(gameId, game)

		this.nextRound(gameId)
	}

	changePlayerStatus (gameId: string, playerId: string, playerStatus: PlayerStatus) {
		const game = this.getGame(gameId)

		game.players = this.buildPlayersWithChangedPlayerStatus(gameId, playerId, playerStatus)

		this.setGameData(gameId, game)
	}

	private makeComputedPlay (gameId: string, playerId: string): void {
		const game = this.getGame(gameId)

		const player = game.players.find(playerItem => playerItem.id === playerId)

		if (player.status === "online") {
			return
		}

		const { handCards } = player

		const usableCard = handCards.find(card => card.canBeUsed)

		if (!usableCard) {
			this.buyCard(playerId, gameId)

			return this.makeComputedPlay(gameId, playerId)
		}

		const randomCardColor = CardService.retrieveRandomCardColor()

		this.putCard(playerId, [usableCard.id], gameId, randomCardColor)
	}

	private getRoundRemainingTimeInSeconds (gameId: string): number {
		const remainingTimeInSeconds = GameRoundService.getRoundRemainingTimeInSeconds(gameId)

		return remainingTimeInSeconds
	}

	private resetRoundCounter (gameId: string) {
		const game = this.getGame(gameId)

		const gameRoundRemainingTime = this.getRoundRemainingTimeInSeconds(gameId)

		GameRoundService.emitGameRoundEvent(gameId, "GameRoundRemainingTimeChanged", gameRoundRemainingTime)

		GameRoundService.resetRoundCounter(gameId, {
			timeoutAction: (gameId) => {
				const currentPlayerInfo = this.getCurrentPlayerInfo(gameId)

				game.players = this.buildPlayersWithChangedPlayerStatus(gameId, currentPlayerInfo.id, "afk")

				this.setGameData(gameId, game)

				this.makeComputedPlay(gameId, currentPlayerInfo.id)

				this.emitGameEvent(gameId, "PlayerGotAwayFromKeyboard", currentPlayerInfo.id)
			},
			intervalAction: (gameId) => {
				const gameRoundRemainingTime = this.getRoundRemainingTimeInSeconds(gameId)

				GameRoundService.emitGameRoundEvent(gameId, "GameRoundRemainingTimeChanged", gameRoundRemainingTime)
			},
			gameId,
			timeInSeconds: game.maxRoundDurationInSeconds,
		})
	}

	private removeRoundCounter (gameId: string) {
		GameRoundService.removeRoundCounter(gameId)
	}

	private buildPlayersWithChangedPlayerStatus (gameId: string, playerId: string, status: PlayerStatus): PlayerData[] {
		const game = this.getGame(gameId)

		const playersWithChangedPlayerStatus = game.players.map(player => {
			if (player.id === playerId) {
				return {
					...player,
					status,
				}
			}

			return player
		})

		return playersWithChangedPlayerStatus
	}

	private startGame (gameId: string) {
		const game = this.getGame(gameId)

		const allCards = [...game?.cards]

		const currentPlayer = game?.players?.[game.currentPlayerIndex]

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
					canBeUsed: player.id === currentPlayer.id,
				})),
				canBuyCard: false,
			}
		})

		game.availableCards = allCards

		this.setGameData(gameId, game)

		this.emitGameEvent(gameId, "GameStarted", game)

		this.resetRoundCounter(gameId)
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
				canBuyCard: false,
			},
		]

		this.setGameData(gameId, game)
	}

	private disconnectPlayer (gameId: string, playerId: string) {
		const game = this.getGame(gameId)

		if (game.status === "waiting") {
			game.players = game?.players?.filter(player => player.id !== playerId)
		}

		if (game.status === "playing") {
			game.players = this.buildPlayersWithChangedPlayerStatus(gameId, playerId, "offline")
		}

		this.setGameData(gameId, game)
	}

	private getGame (gameId: string) {
		const game = GameRepository.getGame(gameId)

		return game
	}

	private nextRound (gameId: string) {
		this.resetRoundCounter(gameId)

		const currentPlayerInfo = this.getCurrentPlayerInfo(gameId)

		if (currentPlayerInfo.gameStatus === "winner") {
			this.emitGameEvent(gameId, "PlayerWon", currentPlayerInfo.id, currentPlayerInfo.name)
			return this.endGame(gameId)
		}

		if (currentPlayerInfo.gameStatus === "uno") {
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

		const nextPlayerInfo = this.getCurrentPlayerInfo(gameId)
		const nextPlayerCanMakeComputedPlay = this.playerCanMakeComputedPlay(nextPlayerInfo.playerStatus)

		if (nextPlayerCanMakeComputedPlay) {
			setTimeout(() => {
				this.makeComputedPlay(gameId, nextPlayerInfo.id)
			}, 1000)
		}
	}

	private playerCanMakeComputedPlay (playerStatus: PlayerStatus) {
		const isAfk = playerStatus === "afk"
		const isOffline = playerStatus === "offline"

		if (isAfk || isOffline) {
			return true
		} else {
			return false
		}
	}

	private emitGameEvent (gameId: string, event: GameEvents, ...data: unknown[]) {
		SocketService.emitRoomEvent(gameId, event, ...data)

		const gameUpdateEvents: GameEvents[] = [
			"GameStarted",
			"GameCreated",
			"GameEnded",
			"PlayerJoined",
			"PlayerLeft",
		]

		const isGameUpdateEvent = gameUpdateEvents.some(gameEvent => gameEvent === event)

		if (isGameUpdateEvent) {
			ClientService.dispatchGameHistoryConsolidated()
			ClientService.dispatchGameListUpdated()
		}
	}

	private setGameData (gameId: string, game: Game) {
		GameRepository.setGameData(gameId, game)

		this.emitGameEvent(gameId, "GameStateChanged", game)
	}

	private getTopStackCard (gameId: string) {
		const game = this.getGame(gameId)

		return game?.usedCards?.[0]
	}

	private cardCanBeBuyCombed = (game: Game, card: CardData) => {
		const currentCardComboType = game?.currentCardCombo?.cardTypes?.[0]

		return (
			(card.type === "buy-2" && currentCardComboType === "buy-4" && card.color === game.currentGameColor) ||
			(card.type === "buy-2" && currentCardComboType === "buy-2") ||
			(card.type === "buy-4")
		)
	}

	private buildGameWithCardEffect (gameId: string, cards: CardData[], selectedColor: CardColors): Game {
		const cardTypes = cards.map(card => card.type)
		const cardIds = cards.map(card => card.id)

		const game = this.getGame(gameId)

		let playerAffected: PlayerData

		const isBuy4Card = cardTypes.every(cardType => cardType === "buy-4")
		const isBuy2Card = cardTypes.every(cardType => cardType === "buy-2")
		const isChangeColorCard = cardTypes.every(cardType => cardType === "change-color")
		const isReverseCard = cardTypes.every(cardType => cardType === "reverse")
		const isBlockCard = cardTypes.every(cardType => cardType === "block")

		if (isChangeColorCard || isBuy4Card) {
			game.currentGameColor = selectedColor

			game.usedCards = game.usedCards.map(card => {
				if (cardIds.includes(card.id)) {
					return {
						...card,
						selectedColor,
						src: card.possibleColors[selectedColor],
					}
				} else {
					return card
				}
			})
		}

		if (isReverseCard) {
			if (cardTypes.length % 2 === 0) {
				game.nextPlayerIndex = game.currentPlayerIndex
			} else if (game.direction === "clockwise") {
				game.direction = "counterclockwise"

				game.nextPlayerIndex = game.currentPlayerIndex - 1
			} else {
				game.direction = "clockwise"

				game.nextPlayerIndex = game.currentPlayerIndex + 1
			}
		}

		if (isBlockCard) {
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

		if (isBuy2Card || isBuy4Card) {
			game.currentCardCombo.cardTypes = [
				...game.currentCardCombo.cardTypes,
				...cardTypes,
			]

			const nextPlayerIndex = NumberUtil.getSanitizedValueWithBoundaries(game?.nextPlayerIndex, game?.players?.length, 0)
			playerAffected = game?.players?.[nextPlayerIndex]

			const affectedPlayerCanMakeCardBuyCombo = playerAffected.handCards
				.some(card => this.cardCanBeBuyCombed(game, card))

			game.currentCardCombo.amountToBuy = 0

			game.currentCardCombo.cardTypes.forEach(cardType => {
				if (cardType === "buy-2") {
					game.currentCardCombo.amountToBuy += 2
				} else if (cardType === "buy-4") {
					game.currentCardCombo.amountToBuy += 4
				}
			})

			if (!affectedPlayerCanMakeCardBuyCombo) {
				this.emitGameEvent(game.id, "PlayerBuyCards", playerAffected?.id, game.currentCardCombo.amountToBuy)

				let available = [...game?.availableCards]

				const cards = available.slice(0, game.currentCardCombo.amountToBuy)

				available = available.slice(game.currentCardCombo.amountToBuy, available.length)

				game.players = game?.players?.map(player => {
					if (player.id === playerAffected.id) {
						return {
							...player,
							handCards: [...cards, ...player?.handCards],
						}
					} else {
						return player
					}
				})

				game.availableCards = available

				game.currentCardCombo = {
					cardTypes: [],
					amountToBuy: 0,
				}

				if (game.direction === "clockwise") {
					game.nextPlayerIndex++
				} else {
					game.nextPlayerIndex--
				}
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
					canBeUsed: game?.currentCardCombo?.cardTypes.length ? (
						this.cardCanBeBuyCombed(game, handCard)
					) : (
						topStackCard?.color === handCard.color ||
						handCard.type === "change-color" ||
						handCard.type === "buy-4" ||
						topStackCard?.type === handCard.type ||
						handCard.color === game.currentGameColor
					),
					canBeCombed: game.currentCardCombo.cardTypes.includes(handCard.type),
				}))

				return {
					...player,
					isCurrentRoundPlayer: true,
					canBuyCard: handCards.every(card => !card.canBeUsed),
					handCards,
				}
			} else {
				return {
					...player,
					isCurrentRoundPlayer: false,
					canBuyCard: false,
					handCards: player?.handCards?.map(handCard => ({
						...handCard,
						canBeUsed: false,
						canBeCombed: false,
					})),
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
		let gameStatus: CurrentPlayerGameStatus

		/**
		 * In case the current player has no card on hand, he's the winner
		 */
		if (currentPlayer?.handCards.length === 0) {
			gameStatus = "winner"
		/**
		 * In case the player has only one card, he's made uno
		 */
		} else if (currentPlayer?.handCards.length === 1) {
			gameStatus = "uno"
		}

		return {
			id: currentPlayerId,
			name: currentPlayer.name,
			playerStatus: currentPlayer.status,
			gameStatus,
		}
	}

	private endGame (gameId: string) {
		const winnerInfo = this.getCurrentPlayerInfo(gameId)

		const game = this.getGame(gameId)

		const cards = CardService.setupRandomCards()

		game.status = "ended"

		game.round = 0

		const winnerIndex = game.players.findIndex(player => player.id === winnerInfo.id)

		game.currentPlayerIndex = winnerIndex

		game.nextPlayerIndex = NumberUtil.getSanitizedValueWithBoundaries(game?.currentPlayerIndex + 1, game?.players?.length, 0)

		game.availableCards = []

		game.usedCards = []

		game.direction = "clockwise"

		game.currentCardCombo = {
			cardTypes: [],
			amountToBuy: 0,
		}

		game.cards = cards

		game.players = game?.players?.map(player => ({
			...player,
			canBuyCard: false,
			handCards: [],
			isCurrentRoundPlayer: false,
			ready: false,
			status: "online",
			usedCards: [],
		}))

		this.setGameData(gameId, game)

		this.removeRoundCounter(gameId)

		this.emitGameEvent(gameId, "GameEnded")
	}
}

export default new GameService()
