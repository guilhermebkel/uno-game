import Storage from "@unoenty/services/storage"

import { Player } from "@shared/protocols/Player"

class Auth {
	authKey = "Un0-@uTh"

	getPlayerData(): Player {
		const authData = Storage.get<Player>(this.authKey)

		return authData as Player
	}

	setPlayerData(authData: Player) {
		Storage.set(this.authKey, authData)
	}

	logout() {
		Storage.delete(this.authKey)

		window.location.href = "/"
	}
}

export default new Auth()
