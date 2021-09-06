import GameService from "@/Services/GameService"

class ServerHandlerModule {
	async onSocketStart (): Promise<void> {
		await Promise.all([
			this.consolidateOnGoingGameRoundCounters(),
		])
	}

	private async consolidateOnGoingGameRoundCounters (): Promise<void> {
		const games = await GameService.getGameList()

		const onGoingGames = games.filter(({ status }) => status === "playing")

		await Promise.all(
			onGoingGames.map(() => {
				// GameService.resetRoundCounter(game.id)
			}),
		)
	}
}

export default new ServerHandlerModule()
