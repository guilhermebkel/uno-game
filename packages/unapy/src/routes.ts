import { Router } from "express"

import AssetController from "@unapy/Controllers/AssetController"
import GameController from "@unapy/Controllers/GameController"
import CardController from "@unapy/Controllers/CardController"

const routes = Router()

routes.use("/assets", AssetController.getAsset)

routes.get("/games", GameController.getGameList)

routes.get("/cards", CardController.getCardList)

export default routes
