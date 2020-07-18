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
const express_1 = __importDefault(require("express"));
const http_1 = require("http");
const cors_1 = __importDefault(require("cors"));
const routes_1 = __importDefault(require("@unapy/routes"));
class Server {
    static boot() {
        return __awaiter(this, void 0, void 0, function* () {
            Server.setupMiddlewares();
            Server.setupRoutes();
            Server.start();
        });
    }
    static setupMiddlewares() {
        const middlewares = [
            express_1.default.json(),
            cors_1.default()
        ];
        middlewares.map(middleware => Server.app.use(middleware));
    }
    static start() {
        Server.http.listen(process.env.PORT, () => {
            console.log(`Server is running... [PORT ${process.env.PORT}]`);
        });
    }
    static setupRoutes() {
        Server.app.use(routes_1.default);
    }
}
Server.app = express_1.default();
Server.http = http_1.createServer(Server.app);
exports.default = Server;
//# sourceMappingURL=index.js.map