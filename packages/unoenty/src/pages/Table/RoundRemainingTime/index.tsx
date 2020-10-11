import React from "react"
import { Chip } from "@material-ui/core"

import useStyles from "@/pages/Table/RoundRemainingTime/styles"

import { useSocketStore } from "@/store/Socket"

type RoundRemainingTimeType = {
	style?: Record<string, unknown>
}

const RoundRemainingTime: React.FC<RoundRemainingTimeType> = (props) => {
	const { style } = props

	const socketStore = useSocketStore()

	const classes = useStyles()

	return (
		<Chip
			style={style}
			label={socketStore.game?.roundRemainingTimeInSeconds}
			className={classes.cardChipRoundCounter}
		/>
	)
}

export default RoundRemainingTime
