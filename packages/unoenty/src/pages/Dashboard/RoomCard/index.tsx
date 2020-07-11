import React from "react"
import {
	Card,
	CardContent,
	ButtonBase
} from "@material-ui/core"

import useStyles from "./styles"

interface RoomCardProps {
	title: string
}

const RoomCard = (props: RoomCardProps) => {
	const { title } = props

	const classes = useStyles()

	return (
		<Card className={classes.cardContainer}>
			<CardContent
				component={ButtonBase}
				className={classes.cardContent}
			>
				{title}
			</CardContent>
		</Card>
	)
}

export default RoomCard
