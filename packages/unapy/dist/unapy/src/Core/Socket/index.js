"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.io = void 0;
const socket_io_1 = __importDefault(require("socket.io"));
const uuid_1 = __importDefault(require("uuid"));
const ListenerService_1 = __importDefault(require("@unapy/Services/ListenerService"));
class Socket {
    static boot(http) {
        return __awaiter(this, void 0, void 0, function* () {
            Socket.setupSocket(http);
            Socket.setupListeners();
        });
    }
    static setupSocket(http) {
        exports.io = socket_io_1.default(http);
    }
    static setupListeners() {
        exports.io.on("connection", client => {
            const playerId = client.id;
            let roomId;
            client.emit("PlayerConnected", playerId);
            client.on("CreateGame", () => {
                roomId = uuid_1.default.v4();
                client.join(roomId);
                ListenerService_1.default.onCreateGame(roomId, playerId);
            });
            client.on("JoinGame", (roomId) => {
                client.join(roomId);
                ListenerService_1.default.onJoinGame(roomId, playerId);
            });
            client.on("StartGame", (roomId) => {
                ListenerService_1.default.onStartGame(roomId);
            });
            client.on("BuyCard", (roomId) => {
                ListenerService_1.default.onBuyCard(roomId, playerId);
            });
            client.on("PutCard", (roomId, cardId) => {
                ListenerService_1.default.onPutCard(roomId, playerId, cardId);
            });
            client.on("ToggleReady", (roomId) => {
                ListenerService_1.default.onToggleReady(roomId, playerId);
            });
            client.on("disconnect", () => {
                ListenerService_1.default.onPlayerDisconnect(playerId);
            });
        });
    }
    static get io() {
        return exports.io;
    }
}
exports.default = Socket;
//# sourceMappingURL=index.js.map