import { Router } from "express"

import AssetController from "@/Controllers/AssetController"
import GameController from "@/Controllers/GameController"
import CardController from "@/Controllers/CardController"

const routes = Router()

routes.use("/assets", AssetController.getAsset)

routes.get("/games", GameController.getGameList)

// routes.get("/games/:gameId", GameController.getDetailedGame)

routes.get("/cards", CardController.getCardList)

export default routes
