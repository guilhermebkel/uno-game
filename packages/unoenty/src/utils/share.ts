class Share {
	mountGameShareUrl (gameId: string) {
		const baseUrl = window.origin

		return `${baseUrl}/${gameId}`
	}
}

export default new Share()
