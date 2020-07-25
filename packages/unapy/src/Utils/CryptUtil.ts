import uuid from "uuid"

class CryptUtil {
	makeShortUUID () {
		const uuidResult = uuid.v4()

		const shortVersion = uuidResult.split("-").pop()

		return shortVersion
	}
}

export default new CryptUtil()
