"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const GameService_1 = __importDefault(require("@unapy/Services/GameService"));
/**
 * Usually the class which handles events from client
 */
class ListenerService {
    onJoinGame(gameId, playerId) {
        GameService_1.default.joinGame(gameId, playerId);
    }
    onCreateGame(gameId, playerId) {
        GameService_1.default.setupGame(playerId, gameId);
    }
    onPlayerDisconnect(playerId) {
        GameService_1.default.purgePlayer(playerId);
    }
    onStartGame(gameId) {
        GameService_1.default.startGame(gameId);
    }
    onBuyCard(gameId, playerId) {
        GameService_1.default.buyCard(playerId, gameId);
    }
    onPutCard(gameId, playerId, cardId) {
        GameService_1.default.putCard(playerId, cardId, gameId);
    }
    onToggleReady(gameId, playerId) {
        GameService_1.default.toggleReady(playerId, gameId);
    }
}
exports.default = new ListenerService();
//# sourceMappingURL=ListenerService.js.map