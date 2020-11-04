import React from "react"
import { Link } from "react-router-dom"
import { ListItem as MaterialListItem } from "@material-ui/core"
import { GameStatus } from "@uno-game/protocols"
import { fade } from "@material-ui/core/styles/colorManipulator"

import { statusColorMap, StatusMap } from "@/utils/game"

import useStyles from "@/components/Menu/ListItem/styles"

const statusBackgroundColorMap: StatusMap<string> = {
	ended: `linear-gradient(90deg, ${fade(statusColorMap.ended, 0.3)} 0%, #151515 100%)`,
	playing: `linear-gradient(90deg, ${fade(statusColorMap.playing, 0.3)} 0%, #151515 100%)`,
	waiting: `linear-gradient(90deg, ${fade(statusColorMap.waiting, 0.3)} 0%, #151515 100%)`,
}

type ListItemProps = {
	to: string
	status?: GameStatus
}

const ListItem: React.FC<ListItemProps> = (props) => {
	const { children, to, status } = props

	const classes = useStyles()

	const isSelected = to === "/" ? (
		window.location.pathname === to
	) : (
		window.location.pathname.includes(to)
	)

	const backgroundColor = status ? (
		statusBackgroundColorMap[status]
	) : (
		"linear-gradient(90deg, #2B2A3C 0%, #151515 100%)"
	)

	return (
		<MaterialListItem
			button
			component={Link}
			to={to}
			className={classes.listItem}
			style={{
				background: isSelected ? backgroundColor : "transparent",
				opacity: isSelected ? 1 : 0.7,
			}}
		>
			{children}
		</MaterialListItem>
	)
}

export default ListItem
