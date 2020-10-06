import Storage from "@/services/storage"

import { Player } from "@uno-game/protocols"

class Auth {
	authKey = "Un0-@uTh"

	getPlayerData () {
		const authData = Storage.get<Player>(this.authKey)

		return authData
	}

	setPlayerData (authData: Player) {
		Storage.set(this.authKey, authData)
	}

	logout () {
		Storage.delete(this.authKey)

		window.location.href = "/"
	}
}

export default new Auth()
