"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const uuid_1 = __importDefault(require("uuid"));
const ArrayUtil_1 = __importDefault(require("@unapy/Utils/ArrayUtil"));
const static_files_1 = __importDefault(require("@unapy/Config/static-files"));
class CardService {
    constructor() {
        this.cardTypes = [
            "0",
            "1",
            "2",
            "3",
            "4",
            "5",
            "6",
            "7",
            "8",
            "9",
            "block",
            "buy-2",
            "buy-4",
            "change-color",
            "reverse"
        ];
        this.cardColors = [
            "blue",
            "green",
            "red",
            "yellow"
        ];
    }
    setupInitialCards() {
        const initialCards = [];
        this.cardTypes.map(cardType => {
            this.cardColors.map(cardColor => {
                const cardPictureSrc = this.buildCardPictureSrc(cardType, cardColor);
                const cardId = uuid_1.default.v4();
                initialCards.push({
                    id: cardId,
                    src: cardPictureSrc,
                    name: `${cardType}-${cardColor}`,
                    color: cardColor,
                    type: cardType
                });
            });
        });
        ArrayUtil_1.default.shuffle(initialCards);
        return initialCards;
    }
    buildCardPictureSrc(cardType, cardColor) {
        const baseUrl = static_files_1.default.staticFilesBaseUrl;
        const picturePath = `cards/${cardType}/${cardColor}.png`;
        return `${baseUrl}/${picturePath}`;
    }
}
exports.default = new CardService();
//# sourceMappingURL=CardService.js.map