import ErrorHandler from "@uno-game/error-handler"
import StorageService from "@/services/storage"

export const clearAllServiceWorkerCache = async (): Promise<void> => {
	const cacheNames = await caches.keys()

	try {
		Promise.all(
			cacheNames.map(cache => caches.delete(cache)),
		)
	} catch (error) {
		ErrorHandler.handle(error)
	}
}

type CacheData = {
	version: string
}

export const refreshCacheIfNeeded = async (): Promise<void> => {
	const cacheKey = "@uno-game-cache"

	const cacheVersion = "1"

	const currentCache = StorageService.get<CacheData>(cacheKey)

	if (!currentCache || currentCache?.version !== cacheVersion) {
		const newCacheData: CacheData = {
			version: cacheVersion,
		}

		StorageService.set(cacheKey, newCacheData)

		await clearAllServiceWorkerCache()
	}
}
