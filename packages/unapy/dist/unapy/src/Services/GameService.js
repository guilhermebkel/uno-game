"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const CardService_1 = __importDefault(require("@unapy/Services/CardService"));
const SocketService_1 = __importDefault(require("@unapy/Services/SocketService"));
class GameService {
    static setupGame(playerId, gameId) {
        const cards = CardService_1.default.setupInitialCards();
        const initialPlayer = {
            id: playerId,
            name: playerId,
            handCards: [],
            usedCards: [],
            status: "online",
            ready: false,
            isCurrentRoundPlayer: false
        };
        const game = {
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
        };
        this.setGameData(gameId, game);
        this.emitGameEvent(gameId, "GameCreated", game);
    }
    static startGame(gameId) {
        var _a;
        const game = this.getGame(gameId);
        const allCards = [...game === null || game === void 0 ? void 0 : game.cards];
        const currentPlayer = (_a = game === null || game === void 0 ? void 0 : game.players) === null || _a === void 0 ? void 0 : _a[0];
        game.status = "playing";
        game.players = game === null || game === void 0 ? void 0 : game.players.map(player => {
            const handCards = [];
            for (let i = 0; i < 7; i++) {
                const selectedCard = allCards.shift();
                handCards.push(selectedCard);
            }
            return Object.assign(Object.assign({}, player), { isCurrentRoundPlayer: player.id === currentPlayer.id, handCards: handCards.map(handCard => (Object.assign(Object.assign({}, handCard), { canBeUsed: player.id === currentPlayer.id }))) });
        });
        game.availableCards = allCards;
        this.setGameData(gameId, game);
        this.emitGameEvent(gameId, "GameStarted", game);
    }
    static joinGame(gameId, playerId) {
        var _a;
        const game = this.getGame(gameId);
        const player = (_a = game === null || game === void 0 ? void 0 : game.players) === null || _a === void 0 ? void 0 : _a.find(player => player.id === playerId);
        if (game.status === "waiting" && game.players.length < game.maxPlayers && !player) {
            this.addPlayer(gameId, playerId);
        }
        this.emitGameEvent(gameId, "PlayerJoined", game);
    }
    static purgePlayer(playerId) {
        var _a;
        for (const game of this.games.values()) {
            const isPlayerInGame = (_a = game === null || game === void 0 ? void 0 : game.players) === null || _a === void 0 ? void 0 : _a.find(player => (player === null || player === void 0 ? void 0 : player.id) === playerId);
            if (isPlayerInGame) {
                this.disconnectPlayer(game === null || game === void 0 ? void 0 : game.id, playerId);
            }
        }
    }
    static toggleReady(playerId, gameId) {
        var _a;
        const game = this.getGame(gameId);
        game.players = (_a = game === null || game === void 0 ? void 0 : game.players) === null || _a === void 0 ? void 0 : _a.map(player => {
            if (player.id === playerId) {
                return Object.assign(Object.assign({}, player), { ready: !player.ready });
            }
            else {
                return player;
            }
        });
        this.setGameData(gameId, game);
    }
    static getGameList() {
        const games = [];
        for (const game of this.games.values()) {
            games.push(game);
        }
        return games;
    }
    static buyCard(playerId, gameId) {
        var _a, _b;
        const currentPlayerInfo = this.getCurrentPlayerInfo(gameId);
        if (currentPlayerInfo.id !== playerId) {
            return;
        }
        const game = this.getGame(gameId);
        if (((_a = game === null || game === void 0 ? void 0 : game.availableCards) === null || _a === void 0 ? void 0 : _a.length) === 0) {
            return;
        }
        const available = [...game === null || game === void 0 ? void 0 : game.availableCards];
        const card = available.shift();
        game.players = (_b = game === null || game === void 0 ? void 0 : game.players) === null || _b === void 0 ? void 0 : _b.map(player => {
            if (player.id === playerId) {
                return Object.assign(Object.assign({}, player), { handCards: [card, ...player === null || player === void 0 ? void 0 : player.handCards] });
            }
            else {
                return player;
            }
        });
        game.availableCards = available;
        this.setGameData(gameId, game);
        this.nextTurn(gameId);
    }
    static putCard(playerId, cardId, gameId) {
        var _a, _b, _c;
        const currentPlayerInfo = this.getCurrentPlayerInfo(gameId);
        if (currentPlayerInfo.id !== playerId) {
            return;
        }
        const game = this.getGame(gameId);
        const player = (_a = game === null || game === void 0 ? void 0 : game.players) === null || _a === void 0 ? void 0 : _a.find(player => player.id === playerId);
        const card = (_b = player === null || player === void 0 ? void 0 : player.handCards) === null || _b === void 0 ? void 0 : _b.find(card => card.id === cardId);
        game.players = (_c = game === null || game === void 0 ? void 0 : game.players) === null || _c === void 0 ? void 0 : _c.map(player => {
            var _a;
            if (player.id === playerId) {
                return Object.assign(Object.assign({}, player), { handCards: (_a = player === null || player === void 0 ? void 0 : player.handCards) === null || _a === void 0 ? void 0 : _a.filter(card => card.id !== cardId), usedCards: [card, ...player === null || player === void 0 ? void 0 : player.usedCards] });
            }
            else {
                return player;
            }
        });
        game.usedCards = [card, ...game === null || game === void 0 ? void 0 : game.usedCards];
        game.currentGameColor = card === null || card === void 0 ? void 0 : card.color;
        this.setGameData(gameId, game);
        this.nextTurn(gameId);
    }
    static addPlayer(gameId, playerId) {
        const game = this.getGame(gameId);
        game.players = [
            ...game === null || game === void 0 ? void 0 : game.players,
            {
                id: playerId,
                name: playerId,
                handCards: [],
                usedCards: [],
                status: "online",
                ready: false,
                isCurrentRoundPlayer: false
            }
        ];
        this.setGameData(gameId, game);
    }
    static disconnectPlayer(gameId, playerId) {
        var _a, _b;
        const game = this.getGame(gameId);
        if (game.status === "waiting") {
            game.players = (_a = game === null || game === void 0 ? void 0 : game.players) === null || _a === void 0 ? void 0 : _a.filter(player => player.id !== playerId);
        }
        if (game.status === "playing") {
            game.players = (_b = game === null || game === void 0 ? void 0 : game.players) === null || _b === void 0 ? void 0 : _b.map(player => {
                if (player.id === playerId) {
                    return Object.assign(Object.assign({}, player), { status: "offline" });
                }
                else {
                    return player;
                }
            });
        }
        this.setGameData(gameId, game);
    }
    static getGame(gameId) {
        const game = this.games.get(gameId);
        return game;
    }
    static nextTurn(gameId) {
        var _a, _b;
        const currentPlayerInfo = this.getCurrentPlayerInfo(gameId);
        if (currentPlayerInfo.status === "winner") {
            this.emitGameEvent(gameId, "PlayerWon", currentPlayerInfo.id);
            return this.endGame(gameId);
        }
        if (currentPlayerInfo.status === "uno") {
            this.emitGameEvent(gameId, "PlayerUno", currentPlayerInfo.id);
        }
        const game = this.getGame(gameId);
        const totalPlayers = (_a = game === null || game === void 0 ? void 0 : game.players) === null || _a === void 0 ? void 0 : _a.length;
        const currentPlayerIndex = game === null || game === void 0 ? void 0 : game.currentPlayerIndex;
        const expectedNextPlayerIndex = currentPlayerIndex + 1;
        const nextPlayerIndex = (expectedNextPlayerIndex >= totalPlayers) ? 0 : expectedNextPlayerIndex;
        const nextPlayer = (_b = game === null || game === void 0 ? void 0 : game.players) === null || _b === void 0 ? void 0 : _b[nextPlayerIndex];
        const playersWithCardUsability = this.buildPlayersWithCardUsability(nextPlayer.id, gameId);
        game.round++;
        game.currentPlayerIndex = nextPlayerIndex;
        game.players = playersWithCardUsability;
        this.setGameData(gameId, game);
    }
    static emitGameEvent(gameId, event, data) {
        SocketService_1.default.emitRoomEvent(gameId, event, data);
    }
    static setGameData(gameId, game) {
        this.games.set(gameId, game);
        this.emitGameEvent(gameId, "GameStateChanged", game);
    }
    static getTopStackCard(gameId) {
        var _a;
        const game = this.getGame(gameId);
        return (_a = game === null || game === void 0 ? void 0 : game.usedCards) === null || _a === void 0 ? void 0 : _a[0];
    }
    static buildPlayersWithCardUsability(currentPlayerId, gameId) {
        var _a;
        const game = this.getGame(gameId);
        const topStackCard = this.getTopStackCard(gameId);
        const playersWithCardUsability = (_a = game === null || game === void 0 ? void 0 : game.players) === null || _a === void 0 ? void 0 : _a.map(player => {
            var _a, _b;
            if (currentPlayerId === player.id) {
                return Object.assign(Object.assign({}, player), { isCurrentRoundPlayer: true, handCards: (_a = player === null || player === void 0 ? void 0 : player.handCards) === null || _a === void 0 ? void 0 : _a.map(handCard => (Object.assign(Object.assign({}, handCard), { canBeUsed: ((topStackCard === null || topStackCard === void 0 ? void 0 : topStackCard.color) === handCard.color ||
                            handCard.type === "change-color" ||
                            handCard.type === "buy-4") }))) });
            }
            else {
                return Object.assign(Object.assign({}, player), { isCurrentRoundPlayer: false, handCards: (_b = player === null || player === void 0 ? void 0 : player.handCards) === null || _b === void 0 ? void 0 : _b.map(handCard => (Object.assign(Object.assign({}, handCard), { canBeUsed: false }))) });
            }
        });
        return playersWithCardUsability;
    }
    static getCurrentPlayerInfo(gameId) {
        const game = this.getGame(gameId);
        const { players } = game;
        const currentPlayer = players[game === null || game === void 0 ? void 0 : game.currentPlayerIndex];
        const currentPlayerId = currentPlayer === null || currentPlayer === void 0 ? void 0 : currentPlayer.id;
        let status;
        /**
         * In case the current player has no card on hand, he's the winner
         */
        if ((currentPlayer === null || currentPlayer === void 0 ? void 0 : currentPlayer.handCards.length) === 0) {
            status = "winner";
            /**
             * In case the player has only one card, he's made uno
             */
        }
        else if ((currentPlayer === null || currentPlayer === void 0 ? void 0 : currentPlayer.handCards.length) === 1) {
            status = "uno";
        }
        return {
            id: currentPlayerId,
            status
        };
    }
    static endGame(gameId) {
        const game = this.getGame(gameId);
        game.status = "ended";
        this.setGameData(gameId, game);
        this.emitGameEvent(gameId, "GameEnded");
    }
}
GameService.games = new Map();
exports.default = GameService;
//# sourceMappingURL=GameService.js.map