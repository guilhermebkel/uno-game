export const buildPercentage = (used: number, total: number): number => {
	const percentage = (used / total) * 100

	return percentage
}

export const getSanitizedValueWithBoundaries = (value: number, max: number, min: number) => {
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
