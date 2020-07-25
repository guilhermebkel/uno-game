import { Player } from "@uno-game/protocols"

import PlayerRepository from "@/Repositories/PlayerRepository"

class PlayerService {
	setPlayerData (playerData: Player) {
		PlayerRepository.setPlayerData(playerData)
	}

	getPlayerData (playerId: string): Player {
		return PlayerRepository.getPlayerData(playerId)
	}
}

export default new PlayerService()
