import ErrorHandler from "@uno-game/error-handler"

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
