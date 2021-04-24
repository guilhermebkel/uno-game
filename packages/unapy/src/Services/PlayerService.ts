import { Player } from "@uno-game/protocols"

import PlayerRepository from "@/Repositories/PlayerRepository"

class PlayerService {
	async setPlayerData (playerData: Player): Promise<void> {
		await PlayerRepository.setPlayerData(playerData)
	}

	async getPlayerData (playerId: string): Promise<Player> {
		return await PlayerRepository.getPlayerData(playerId)
	}

	async playerExists (playerId: string): Promise<boolean> {
		const player = await PlayerRepository.getPlayerData(playerId)

		if (player) {
			return true
		} else {
			return false
		}
	}
}

export default new PlayerService()
