class Device {
	get isTouchDevice () {
		if ("ontouchstart" in window) {
			return true
		} else {
			return false
		}
	}

	get isMobile () {
		return window.innerWidth < 600
	}
}

export default new Device()
