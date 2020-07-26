import { Player } from "@uno-game/protocols"

import PlayerRepository from "@/Repositories/PlayerRepository"

class PlayerService {
	setPlayerData (playerData: Player) {
		PlayerRepository.setPlayerData(playerData)
	}

	getPlayerData (playerId: string): Player {
		return PlayerRepository.getPlayerData(playerId)
	}

	playerExists (playerId: string) {
		const player = PlayerRepository.getPlayerData(playerId)

		if (player) {
			return true
		} else {
			return false
		}
	}
}

export default new PlayerService()
