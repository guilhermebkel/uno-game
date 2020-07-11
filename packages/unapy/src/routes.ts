import { Router } from "express"

import AssetController from "@unapy/Controllers/Asset"
import GameController from "@unapy/Controllers/Game"

const routes = Router()

routes.use("/assets", AssetController.getAsset)

routes.use("/games", GameController.getGameList)

export default routes
