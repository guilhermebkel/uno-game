import ErrorHandler from "@uno-game/error-handler"

class Storage {
	get<Data extends Record<string, unknown>> (key: string): Data | null {
		try {
			const stringifiedData = localStorage.getItem(key)

			if (stringifiedData) {
				const parsedData = JSON.parse(stringifiedData)

				return parsedData
			} else {
				return null
			}
		} catch (error) {
			ErrorHandler.handle(error)
			return null
		}
	}

	set (key: string, data: Record<string, unknown>) {
		try {
			const stringifiedData = JSON.stringify(data)

			localStorage.setItem(key, stringifiedData)
		} catch (error) {
			ErrorHandler.handle(error)
		}
	}

	delete (key: string) {
		try {
			localStorage.removeItem(key)
		} catch (error) {
			ErrorHandler.handle(error)
		}
	}
}

export default new Storage()
