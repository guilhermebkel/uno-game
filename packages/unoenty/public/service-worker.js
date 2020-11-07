var CACHE_NAME = "uno-game-cache"
var urlsToCache = ["/"]

self.addEventListener("install", function (event) {
	/**
	 * event.waitUntil takes a promise to know how
	 * long the installation takes, and whether it
	 * succeeded or not.
	 */
	event.waitUntil(
		// caches.open(CACHE_NAME).then(function (cache) {
		// 	return cache.addAll(urlsToCache)
		// }),
	)
})
