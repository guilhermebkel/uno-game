import { Player } from "@uno-game/protocols"

import PlayerRepository from "@/Repositories/PlayerRepository"

import CryptUtil from "@/Utils/CryptUtil"

class PlayerService {
	async setPlayerData (playerData: Player): Promise<Player> {
		const player = {
			id: playerData.id || CryptUtil.makeUUID(),
			name: playerData.name,
		}

		await PlayerRepository.setPlayerData(player)

		return player
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

	async getAllPlayerIds (): Promise<string[]> {
		const playerIds = await PlayerRepository.getAllPlayerIds()

		return playerIds
	}
}

export default new PlayerService()
