type Config = {
	onSuccess?: (registration?: ServiceWorkerRegistration) => void
	onUpdate?: (registration?: ServiceWorkerRegistration) => void
}

export const register = (config: Config): void => {
	if (process.env.NODE_ENV === "production" && "serviceWorker" in navigator) {
		window.addEventListener("load", () => {
			const swUrl = `${process.env.PUBLIC_URL}/service-worker.js`

			registerValidSW(swUrl, config)
		})
	}
}

const registerValidSW = (swUrl: string, config: Config): void => {
	navigator.serviceWorker
		.register(swUrl)
		.then((registration) => {
			registration.onupdatefound = () => {
				const installingWorker = registration.installing

				if (installingWorker == null) {
					return
				}

				installingWorker.onstatechange = () => {
					if (installingWorker.state === "installed") {
						if (navigator.serviceWorker.controller) {
							/**
							 * At this point, the updated precached content has been fetched,
							 * but the previous service worker will still serve the older
							 * content until all client tabs are closed.
							 */
							if (config && config.onUpdate) {
								config.onUpdate(registration)
							}
						} else {
							/**
							 * At this point, everything has been precached.
							 * It's the perfect time to display a
							 * "Content is cached for offline use." message.
							 */
							if (config && config.onSuccess) {
								config.onSuccess(registration)
							}
						}
					}
				}
			}
		})
		.catch((error) => {
			console.error("Error during service worker registration:", error)
		})
}

export const checkValidServiceWorker = (swUrl: string, config: Config): void => {
	/**
	 * Check if the service worker can be found. If it can't reload the page.
	 */
	fetch(swUrl, {
		headers: { "Service-Worker": "script" },
	})
		.then((response) => {
			/**
			 * Ensure service worker exists, and that we really are getting a JS file.
			 */
			const contentType = response.headers.get("content-type")
			if (
				response.status === 404 ||
				(contentType != null && contentType.indexOf("javascript") === -1)
			) {
				/**
				 * No service worker found. Probably a different app. Reload the page.
				 */
				navigator.serviceWorker.ready.then((registration) => {
					registration.unregister().then(() => {
						window.location.reload()
					})
				})
			} else {
				/**
				 * Service worker found. Proceed as normal.
				 */
				registerValidSW(swUrl, config)
			}
		})
		.catch(() => {
			console.log("No internet connection found. App is running in offline mode.")
		})
}

export const unregister = (): void => {
	if ("serviceWorker" in navigator) {
		navigator.serviceWorker.ready
			.then((registration) => {
				registration.unregister()
			})
			.catch((error) => {
				console.error(error.message)
			})
	}
}
