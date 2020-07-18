import { Router } from "express"

import AssetController from "@unapy/Controllers/AssetController"
import GameController from "@unapy/Controllers/GameController"

const routes = Router()

routes.use("/assets", AssetController.getAsset)

routes.use("/games", GameController.getGameList)

export default routes
