class NumberUtil {
	getSanitizedValueWithBoundaries (value: number, max: number, min: number) {
		let sanitizedValue: number

		if (value >= max) {
			sanitizedValue = value % max
		} else if (value <= min) {
			sanitizedValue = Math.abs(max - Math.abs(value)) % max
		} else {
			return value
		}

		return sanitizedValue
	}
}

export default new NumberUtil()
