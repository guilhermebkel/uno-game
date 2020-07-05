import { Router } from "express"

import AssetController from "@unapy/Controllers/Asset"

const routes = Router()

routes.use("/assets", AssetController.getAsset)

export default routes
