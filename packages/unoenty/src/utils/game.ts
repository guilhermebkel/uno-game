import { GameStatus } from "@uno-game/protocols"

import colors from "@/styles/colors"

export type StatusMap<Data> = {
	[key in GameStatus]: Data
}

export const statusColorMap: StatusMap<string> = {
	ended: colors.palette.orange1,
	playing: colors.palette.green1,
	waiting: colors.palette.yellow1,
}
