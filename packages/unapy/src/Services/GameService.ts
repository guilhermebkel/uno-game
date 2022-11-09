import CardService from "@/Services/CardService"
import SocketService from "@/Services/SocketService"
import PlayerService from "@/Services/PlayerService"
import GameRoundService from "@/Services/GameRoundService"
import ClientService from "@/Services/ClientService"

import NumberUtil from "@/Utils/NumberUtil"
import ArrayUtil from "@/Utils/ArrayUtil"

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
	PlayerJoinedEventData,
	PlayerLeftEventData,
	PlayerWonEventData,
	PlayerBuyCardsEventData,
	PlayerUnoEventData,
	PlayerBlockedEventData,
	GameEndedEventData,
	GameStartedEventData,
	PlayerToggledReadyEventData,
	PlayerPutCardEventData,
	PlayerChoseCardColorEventData,
	GameRoundRemainingTimeChangedEventData,
	PlayerBoughtCardEventData,
	PlayerCardUsabilityConsolidatedEventData,
	GameAmountToBuyChangedEventData,
	PlayerStatusChangedEventData,
} from "@uno-game/protocols"

import GameRepository from "@/Repositories/GameRepository"

import CryptUtil from "@/Utils/CryptUtil"

class GameService {
	async setupGame (playerId: string, chatId: string): Promise<Game> {
		const cards = await CardService.setupRandomCards()

		const playerData = await PlayerService.getPlayerData(playerId)

		const game: Game = {
			maxPlayers: 8,
			type: "public",
			status: "waiting",
			round: 0,
			id: CryptUtil.makeShortUUID(),
			chatId,
			currentPlayerIndex: 0,
			nextPlayerIndex: 1,
			currentGameColor: null,
			title: playerData.name,
			availableCards: [],
			usedCards: [],
			players: [],
			cards,
			direction: "clockwise",
			currentCardCombo: {
				cardTypes: [],
				amountToBuy: 0,
			},
			maxRoundDurationInSeconds: environmentConfig.isDev ? 100 : 30,
			createdAt: Date.now(),
		}

		await this.setGameData(game.id, game)

		return game
	}

	async getExistingPlayerGame (playerId: string): Promise<Game> {
		const player = await PlayerService.getPlayerData(playerId)
		const games = await this.getGameList()

		const game = games
			.filter(({ status }) => status === "waiting")
			.find(({ title }) => title === player.name)

		return game
	}

	async getChatIdByGameId (gameId: string): Promise<string> {
		const game = await GameRepository.getGame(gameId)

		return game?.chatId
	}

	async gameExists (gameId: string): Promise<boolean> {
		const game = await GameRepository.getGame(gameId)

		if (game) {
			return true
		} else {
			return false
		}
	}

	async joinGame (gameId: string, playerId: string): Promise<Game> {
		const game = await this.getGame(gameId)

		const player = game?.players?.find(player => player.id === playerId)

		const gameHasNotStarted = game.status === "waiting"
		const gameIsNotFull = game.players.length < game.maxPlayers
		const playerIsNotOnGame = !player

		if (gameHasNotStarted && gameIsNotFull && playerIsNotOnGame) {
			const playerData = await PlayerService.getPlayerData(playerId)

			const player: PlayerData = {
				id: playerId,
				name: playerData.name,
				handCards: [],
				status: "online",
				ready: false,
				isCurrentRoundPlayer: false,
				canBuyCard: false,
			}

			game.players.push(player)

			this.emitGameEvent<PlayerJoinedEventData>(game.id, "PlayerJoined", { player })
		}

		const gameRoundRemainingTimeInSeconds = await this.getRoundRemainingTimeInSeconds(gameId)

		GameRoundService.emitGameRoundEvent<GameRoundRemainingTimeChangedEventData>(gameId, "GameRoundRemainingTimeChanged", {
			roundRemainingTimeInSeconds: gameRoundRemainingTimeInSeconds,
		})

		if (!playerIsNotOnGame) {
			game.players = await this.buildPlayersWithChangedPlayerStatus(game, playerId, "online")
		}

		await this.setGameData(gameId, game)

		return game
	}

	async purgePlayer (playerId: string): Promise<Game[]> {
		const games = await this.getGameList()

		const purgedGames: Game[] = []

		await Promise.all(
			games.map(async game => {
				const isPlayerOnGame = game?.players?.find(player => player?.id === playerId)

				if (isPlayerOnGame) {
					await this.disconnectPlayer(game?.id, playerId)

					this.emitGameEvent<PlayerLeftEventData>(game?.id, "PlayerLeft", { playerId })

					purgedGames.push(game)
				}
			}),
		)

		return purgedGames
	}

	async toggleReady (playerId: string, gameId: string): Promise<void> {
		const game = await this.getGame(gameId)

		const updatedPlayer = game?.players?.find(({ id }) => id === playerId)

		updatedPlayer.ready = !updatedPlayer.ready

		this.emitGameEvent<PlayerToggledReadyEventData>(gameId, "PlayerToggledReady", {
			playerId,
			ready: updatedPlayer.ready,
		})

		await this.setGameData(gameId, game)

		const areAllPlayersReady = game?.players?.every(player => player.ready)

		if (areAllPlayersReady) {
			await this.startGame(gameId)
		}
	}

	async getGameList (): Promise<Game[]> {
		return await GameRepository.getGameList()
	}

	async buyCard (playerId: string, gameId: string): Promise<void> {
		const game = await this.getGame(gameId)

		const currentPlayerInfo = await this.getCurrentPlayerInfo(game)

		if (currentPlayerInfo.id !== playerId) {
			return
		}

		const player = game?.players?.find(player => player.id === currentPlayerInfo.id)

		const needToBuyCard = player?.handCards?.every(card => !card.canBeUsed)

		if (!needToBuyCard) {
			return
		}

		const available = [...game?.availableCards]

		const card = available.shift()

		this.emitGameEvent<PlayerBoughtCardEventData>(game.id, "PlayerBoughtCard", {
			playerId: playerId,
			cards: [card],
		})

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

		game.players = await this.buildPlayersWithCardUsability(currentPlayerInfo.id, game)

		await this.setGameData(gameId, game)
	}

	async putCard (playerId: string, cardIds: string[], gameId: string, selectedColor: CardColors): Promise<void> {
		let game = await this.getGame(gameId)

		const currentPlayerInfo = await this.getCurrentPlayerInfo(game)

		if (currentPlayerInfo.id !== playerId) {
			return
		}

		const player = game?.players?.find(player => player.id === playerId)

		const cards: CardData[] = []

		cardIds.forEach(cardId => {
			const card = player?.handCards?.find(card => card.id === cardId)

			cards.push(card)
		})

		this.emitGameEvent<PlayerPutCardEventData>(game.id, "PlayerPutCard", { playerId, cards })

		game.players = game?.players?.map(player => {
			if (player.id === playerId) {
				return {
					...player,
					handCards: player?.handCards?.filter(card => !cardIds.includes(card.id)),
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

		const inStackCards = usedCards.slice(0, 10).filter(card => card)
		let outStackCards = usedCards.slice(10, usedCards.length).filter(card => card)

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

		ArrayUtil.shuffle(outStackCards)

		game.usedCards = inStackCards
		game.availableCards = [
			...game.availableCards,
			...outStackCards,
		]

		game.currentGameColor = cards[0]?.color

		game = await this.buildGameWithCardEffect(game, cards, selectedColor)

		await this.setGameData(gameId, game)

		await this.nextRound(gameId)
	}

	async changePlayerStatus (gameId: string, playerId: string, playerStatus: PlayerStatus): Promise<void> {
		const game = await this.getGame(gameId)

		game.players = await this.buildPlayersWithChangedPlayerStatus(game, playerId, playerStatus)

		await this.setGameData(gameId, game)
	}

	emitGameEvent<Data extends unknown> (gameId: string, event: GameEvents, data: Data) {
		SocketService.emitRoomEvent("game", gameId, event, data)

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

	private async makeComputedPlay (gameId: string, playerId: string): Promise<void> {
		const game = await this.getGame(gameId)

		const player = game.players.find(playerItem => playerItem.id === playerId)

		if (player.status === "online") {
			return
		}

		const { handCards } = player

		const usableCard = handCards.find(card => card.canBeUsed)

		if (!usableCard) {
			await this.buyCard(playerId, gameId)

			return await this.makeComputedPlay(gameId, playerId)
		}

		const randomCardColor = await CardService.retrieveRandomCardColor()

		await this.putCard(playerId, [usableCard.id], gameId, randomCardColor)
	}

	private async getRoundRemainingTimeInSeconds (gameId: string): Promise<number> {
		const remainingTimeInSeconds = await GameRoundService.getRoundRemainingTimeInSeconds(gameId)

		return remainingTimeInSeconds
	}

	async resetRoundCounter (gameId: string): Promise<void> {
		const { maxRoundDurationInSeconds } = await this.getGame(gameId)

		const gameRoundRemainingTime = await this.getRoundRemainingTimeInSeconds(gameId)

		GameRoundService.emitGameRoundEvent<GameRoundRemainingTimeChangedEventData>(gameId, "GameRoundRemainingTimeChanged", {
			roundRemainingTimeInSeconds: gameRoundRemainingTime,
		})

		await GameRoundService.resetRoundCounter(gameId, {
			timeoutAction: async (gameId) => {
				const game = await this.getGame(gameId)

				const currentPlayerInfo = await this.getCurrentPlayerInfo(game)

				game.players = await this.buildPlayersWithChangedPlayerStatus(game, currentPlayerInfo.id, "afk")

				await this.setGameData(gameId, game)

				await this.makeComputedPlay(gameId, currentPlayerInfo.id)
			},
			intervalAction: async (gameId) => {
				const gameRoundRemainingTime = await this.getRoundRemainingTimeInSeconds(gameId)

				GameRoundService.emitGameRoundEvent<GameRoundRemainingTimeChangedEventData>(gameId, "GameRoundRemainingTimeChanged", {
					roundRemainingTimeInSeconds: gameRoundRemainingTime,
				})
			},
			gameId,
			timeInSeconds: maxRoundDurationInSeconds,
		})
	}

	private async removeRoundCounter (gameId: string): Promise<void> {
		await GameRoundService.removeRoundCounter(gameId)
	}

	private async buildPlayersWithChangedPlayerStatus (game: Game, playerId: string, status: PlayerStatus): Promise<PlayerData[]> {
		const updatedPlayer = game.players.find(({ id }) => id === playerId)

		updatedPlayer.status = status

		const playersWithChangedPlayerStatus = game.players.map(player => {
			if (player.id === playerId) {
				return updatedPlayer
			}

			return player
		})

		this.emitGameEvent<PlayerStatusChangedEventData>(game.id, "PlayerStatusChanged", {
			playerId: updatedPlayer.id,
			status: updatedPlayer.status,
		})

		return playersWithChangedPlayerStatus
	}

	private async startGame (gameId: string): Promise<void> {
		const game = await this.getGame(gameId)

		const allCards = [...game?.cards]

		const currentPlayer = await this.getCurrentPlayerInfo(game)

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

		await this.setGameData(gameId, game)

		this.emitGameEvent<GameStartedEventData>(gameId, "GameStarted", { game })

		await	this.resetRoundCounter(gameId)
	}

	private async addPlayer (gameId: string, playerId: string): Promise<void> {
		const game = await this.getGame(gameId)

		const playerData = await PlayerService.getPlayerData(playerId)

		game.players = [
			...game?.players,
			{
				id: playerId,
				name: playerData.name,
				handCards: [],
				status: "online",
				ready: false,
				isCurrentRoundPlayer: false,
				canBuyCard: false,
			},
		]

		await this.setGameData(gameId, game)
	}

	private async disconnectPlayer (gameId: string, playerId: string): Promise<void> {
		const game = await this.getGame(gameId)

		if (game.status === "waiting") {
			game.players = game?.players?.filter(player => player.id !== playerId)
		}

		if (game.status === "playing") {
			game.players = await this.buildPlayersWithChangedPlayerStatus(game, playerId, "offline")
		}

		await this.setGameData(gameId, game)
	}

	async getGame (gameId: string): Promise<Game> {
		const game = await GameRepository.getGame(gameId)

		return game
	}

	private async nextRound (gameId: string): Promise<void> {
		await this.resetRoundCounter(gameId)

		const game = await this.getGame(gameId)

		const currentPlayerInfo = await this.getCurrentPlayerInfo(game)

		if (currentPlayerInfo.gameStatus === "winner") {
			this.emitGameEvent<PlayerWonEventData>(gameId, "PlayerWon", {
				player: {
					id: currentPlayerInfo.id,
					name: currentPlayerInfo.name,
				},
			})

			return await this.endGame(gameId)
		}

		if (currentPlayerInfo.gameStatus === "uno") {
			this.emitGameEvent<PlayerUnoEventData>(gameId, "PlayerUno", { playerId: currentPlayerInfo.id })
		}

		const expectedNextPlayerIndex = game?.nextPlayerIndex

		const nextPlayerIndex = NumberUtil.getSanitizedValueWithBoundaries(expectedNextPlayerIndex, game?.players?.length, 0)

		if (game.direction === "clockwise") {
			game.nextPlayerIndex = nextPlayerIndex + 1
		} else {
			game.nextPlayerIndex = nextPlayerIndex - 1
		}

		const nextPlayer = game?.players?.[nextPlayerIndex]

		game.players = await this.buildPlayersWithCardUsability(nextPlayer.id, game)

		game.round++

		game.currentPlayerIndex = nextPlayerIndex

		const nextPlayerInfo = await this.getCurrentPlayerInfo(game)

		await this.setGameData(gameId, game)

		if (nextPlayerInfo.playerStatus === "afk") {
			await new Promise(resolve => {
				setTimeout(async () => {
					await this.makeComputedPlay(gameId, nextPlayerInfo.id)

					resolve(true)
				}, 1000)
			})
		}
	}

	private async setGameData (gameId: string, game: Game): Promise<void> {
		await GameRepository.setGameData(gameId, game)
	}

	private async getTopStackCard (game: Game): Promise<CardData> {
		return game?.usedCards?.[0]
	}

	private cardCanBeBuyCombed = (game: Game, card: CardData): boolean => {
		const currentCardComboType = game?.currentCardCombo?.cardTypes?.[0]

		return (
			(card.type === "buy-2" && currentCardComboType === "buy-4" && card.color === game.currentGameColor) ||
			(card.type === "buy-2" && currentCardComboType === "buy-2") ||
			(card.type === "buy-4")
		)
	}

	private async buildGameWithCardEffect (game: Game, cards: CardData[], selectedColor: CardColors): Promise<Game> {
		const cardTypes = cards.map(card => card.type)
		const cardIds = cards.map(card => card.id)

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

			const changedCards = game.usedCards.filter(({ id }) => cardIds.includes(id))

			this.emitGameEvent<PlayerChoseCardColorEventData>(game.id, "PlayerChoseCardColor", { cards: changedCards })
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

				this.emitGameEvent<PlayerBlockedEventData>(game.id, "PlayerBlocked", { playerId: playerAffected?.id })
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

			this.emitGameEvent<GameAmountToBuyChangedEventData>(game.id, "GameAmountToBuyChanged", {
				amountToBuy: game.currentCardCombo.amountToBuy,
			})

			if (!affectedPlayerCanMakeCardBuyCombo) {
				this.emitGameEvent<PlayerBuyCardsEventData>(game.id, "PlayerBuyCards", {
					playerId: playerAffected?.id,
					amountToBuy: game.currentCardCombo.amountToBuy,
				})

				let available = [...game?.availableCards]

				const cards = available.slice(0, game.currentCardCombo.amountToBuy)

				this.emitGameEvent<PlayerBoughtCardEventData>(game.id, "PlayerBoughtCard", {
					playerId: playerAffected?.id,
					cards,
				})

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

				this.emitGameEvent<GameAmountToBuyChangedEventData>(game.id, "GameAmountToBuyChanged", {
					amountToBuy: 0,
				})

				if (game.direction === "clockwise") {
					game.nextPlayerIndex++
				} else {
					game.nextPlayerIndex--
				}
			}
		}

		return game
	}

	private async buildPlayersWithCardUsability (currentPlayerId: string, game: Game): Promise<PlayerData[]> {
		const topStackCard = await this.getTopStackCard(game)

		const playersWithCardUsability = game?.players?.map(player => {
			if (currentPlayerId === player.id) {
				const handCards = player?.handCards?.map(handCard => ({
					...handCard,
					canBeUsed: game?.currentCardCombo?.cardTypes.length ? (
						this.cardCanBeBuyCombed(game, handCard)
					) : (
						topStackCard?.color === handCard?.color ||
						handCard?.type === "change-color" ||
						handCard?.type === "buy-4" ||
						topStackCard?.type === handCard?.type ||
						handCard?.color === game.currentGameColor
					),
					canBeCombed: game.currentCardCombo.cardTypes.includes(handCard?.type),
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

		const consolidatedPlayers = playersWithCardUsability.map(player => {
			const handCards = player.handCards.map(handCard => ({
				id: handCard.id,
				canBeUsed: handCard.canBeUsed,
				canBeCombed: handCard.canBeCombed,
			}))

			return {
				id: player.id,
				isCurrentRoundPlayer: player.isCurrentRoundPlayer,
				canBuyCard: player.canBuyCard,
				handCards,
			}
		})

		this.emitGameEvent<PlayerCardUsabilityConsolidatedEventData>(game.id, "PlayerCardUsabilityConsolidated", {
			players: consolidatedPlayers,
		})

		return playersWithCardUsability
	}

	private async getCurrentPlayerInfo (game: Game): Promise<CurrentPlayerInfo> {
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

	private async endGame (gameId: string): Promise<void> {
		const game = await this.getGame(gameId)

		const winnerInfo = await this.getCurrentPlayerInfo(game)

		const cards = await CardService.setupRandomCards()

		game.status = "ended"

		game.round = 0

		const winnerIndex = game.players.findIndex(player => player.id === winnerInfo.id)

		game.currentPlayerIndex = winnerIndex

		game.nextPlayerIndex = NumberUtil.getSanitizedValueWithBoundaries(game?.currentPlayerIndex + 1, game?.players?.length, 0)

		game.availableCards = []

		game.usedCards = []

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

		await this.setGameData(gameId, game)

		await this.removeRoundCounter(gameId)

		this.emitGameEvent<GameEndedEventData>(gameId, "GameEnded", { gameId })
	}
}

export default new GameService()
