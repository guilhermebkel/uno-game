import path from "path"
import express, { Request, Response, NextFunction } from "express"

class AssetController {
	getAsset (req: Request, res: Response, next: NextFunction) {
		const assetsPath = path.join(__dirname, "..", "Assets")

		return express.static(assetsPath)(req, res, next)
	}
}

export default new AssetController()
