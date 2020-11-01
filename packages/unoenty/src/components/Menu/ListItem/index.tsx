import React from "react"
import { Link } from "react-router-dom"
import { ListItem as MaterialListItem } from "@material-ui/core"
import { GameStatus } from "@uno-game/protocols"
import { fade } from "@material-ui/core/styles/colorManipulator"

import colors from "@/styles/colors"

import useStyles from "@/components/Menu/ListItem/styles"

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

	const getBackground = (color: string) => (
		`linear-gradient(90deg, ${color} 0%, #151515 100%)`
	)

	const getSelectedColor = () => {
		let selectedColor = getBackground("#2B2A3C")

		if (status === "ended") {
			selectedColor = getBackground(fade(colors.palette.orange1, 0.3))
		}

		if (status === "waiting") {
			selectedColor = getBackground(fade(colors.palette.yellow1, 0.3))
		}

		if (status === "playing") {
			selectedColor = getBackground(fade(colors.palette.green1, 0.3))
		}

		return selectedColor
	}

	return (
		<MaterialListItem
			button
			component={Link}
			to={to}
			className={classes.listItem}
			style={{
				background: isSelected ? getSelectedColor() : "transparent",
			}}
		>
			{children}
		</MaterialListItem>
	)
}

export default ListItem
