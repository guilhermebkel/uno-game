export const preloadImage = (src: string): Promise<void> => new Promise(resolve => {
	const image = new Image()

	image.src = src

	image.onload = () => resolve()
})
