"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const AssetController_1 = __importDefault(require("@unapy/Controllers/AssetController"));
const GameController_1 = __importDefault(require("@unapy/Controllers/GameController"));
const routes = express_1.Router();
routes.use("/assets", AssetController_1.default.getAsset);
routes.use("/games", GameController_1.default.getGameList);
exports.default = routes;
//# sourceMappingURL=routes.js.map