export class DeviceUtil {
	static get isTouchDevice() {
		if ("ontouchstart" in window) {
			return true
		} else {
			return false
		}
	}
}