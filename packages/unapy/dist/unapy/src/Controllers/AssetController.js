"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const path_1 = __importDefault(require("path"));
const express_1 = __importDefault(require("express"));
class AssetController {
    getAsset(req, res, next) {
        const assetsPath = path_1.default.join(__dirname, "..", "Assets");
        return express_1.default.static(assetsPath)(req, res, next);
    }
}
exports.default = new AssetController();
//# sourceMappingURL=AssetController.js.map