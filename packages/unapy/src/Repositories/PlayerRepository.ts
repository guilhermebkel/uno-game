import { Player } from "@uno-game/protocols"

class PlayerRepository {
	private static players: Map<string, Player> = new Map()

	static async setPlayerData (playerData: Player): Promise<void> {
		this.players.set(playerData.id, playerData)
	}

	static async getPlayerData (playerId: string): Promise<Player> {
		return this.players.get(playerId)
	}
}

export default PlayerRepository
