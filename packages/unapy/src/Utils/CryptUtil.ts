import uuid from "uuid"

class CryptUtil {
	makeShortUUID () {
		const uuidResult = uuid.v4()

		const shortVersion = uuidResult.split("-").pop()

		return shortVersion
	}

	makeUUID () {
		const uuidResult = uuid.v4()

		return uuidResult
	}
}

export default new CryptUtil()
