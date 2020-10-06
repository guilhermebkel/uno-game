let active = true

const useBackButton = (): {
	handleBackButton: (onBackButtonPress: () => void) => void,
	setActive: (value: boolean) => void,
} => {
	const setActive = (value: boolean) => {
		active = value
	}

	const handleBackButton = (onBackButtonPress: () => void) => {
		const lastPathName = window.location.pathname

		/**
		 * Creates a new history without changing any page data.
		 */
		window.history.pushState("forward", "", window.location.pathname)

		/**
		 * if it goes to the last pathname we trigger the callback function
		 * since it means the user has gone back with back button.
		 */
		window.addEventListener("popstate", function onPopStateChange () {
			if (lastPathName === window.location.pathname && active) {
				onBackButtonPress()
			}

			// eslint-disable-next-line
			window.removeEventListener("popstate", onPopStateChange)
		})
	}

	return {
		handleBackButton,
		setActive,
	}
}

export default useBackButton
