export const buildPercentage = (used: number, total: number): number => {
	const percentage = (used / total) * 100

	return percentage
}
