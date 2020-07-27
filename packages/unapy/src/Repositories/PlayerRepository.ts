import { Player } from "@uno-game/protocols"

class PlayerRepository {
	static players: Map<string, Player> = new Map()

	static setPlayerData (playerData: Player): void {
		this.players.set(playerData.id, playerData)
	}

	static getPlayerData (playerId: string): Player {
		return this.players.get(playerId)
	}
}

export default PlayerRepository
