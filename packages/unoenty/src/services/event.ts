type Events = "GameTableOpened"

export const dispatchEvent = (event: Events): void => {
	window.postMessage(event, window.origin)
}

export const onEvent = (event: Events, callback: () => void): void => {
	window.addEventListener("message", ({ data }) => {
		if (data === event) {
			callback()
		}
	})
}
