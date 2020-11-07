export const clearAllServiceWorkerCache = async (): Promise<void> => {
	const cacheNames = await caches.keys()

	try {
		Promise.all(
			cacheNames.map(cache => caches.delete(cache)),
		)
	} catch (error) {
		console.error("[RemoveCacheError] ", error.message)
	}
}
