class ErrorHandler {
	handle(error: Error) {
		console.error(error)
	}
}

export default new ErrorHandler()