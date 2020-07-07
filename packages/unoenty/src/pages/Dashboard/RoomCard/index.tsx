import React from "react"
import {
	Card,
	CardContent,
	ButtonBase
} from "@material-ui/core"

import useStyles from "./styles"

const RoomCard = () => {
	const classes = useStyles()

	return (
		<Card className={classes.cardContainer}>
			<CardContent
				component={ButtonBase}
				className={classes.cardContent}
			>
			</CardContent>
		</Card>
	)
}

export default RoomCard
