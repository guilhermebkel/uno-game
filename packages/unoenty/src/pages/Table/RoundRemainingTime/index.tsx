import React from "react"
import { Chip } from "@material-ui/core"

import useStyles from "@/pages/Table/RoundRemainingTime/styles"

import { useSocketStore } from "@/store/Socket"

const RoundRemainingTime = () => {
	const socketStore = useSocketStore()

	const classes = useStyles()

	return (
		<Chip
			label={socketStore.game?.roundRemainingTimeInSeconds}
			className={classes.cardChipRoundCounter}
		/>
	)
}

export default RoundRemainingTime
