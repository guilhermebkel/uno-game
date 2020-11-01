import React from "react"
import { Container, Typography } from "@material-ui/core"
import { fade } from "@material-ui/core/styles/colorManipulator"

import useStyles from "@/components/Avatar/styles"

type AvatarProps = {
	size: "small" | "large"
	name: string
}

const Avatar: React.FC<AvatarProps> = (props) => {
	const { size, name } = props

	const classes = useStyles()

	const getNameMainLetter = () => {
		const firstLetter = name[0]

		const upperCasedFirstLetter = firstLetter.toUpperCase()

		return upperCasedFirstLetter
	}

	const getFontSize = () => {
		let fontSize: number | undefined

		if (size === "large") {
			fontSize = 40
		}

		if (size === "small") {
			fontSize = 20
		}

		return fontSize
	}

	const getAvatarColor = () => {
		const colors = [
			"#E0CE2D",
			"#35EA88",
			"#35EAC9",
			"#9E3EFF",
		]

		return colors[name.length % colors.length]
	}

	const getAvatarSize = () => {
		let avatarSize: number | undefined

		if (size === "large") {
			avatarSize = 65
		}

		if (size === "small") {
			avatarSize = 45
		}

		return avatarSize
	}

	return (
		<Container
			disableGutters
			className={classes.avatarContainer}
			style={{
				backgroundColor: fade(getAvatarColor(), 0.5),
				width: getAvatarSize(),
				height: getAvatarSize(),
			}}
		>
			<Container
				disableGutters
				className={classes.avatarContent}
				style={{
					backgroundColor: getAvatarColor(),
					width: getAvatarSize(),
					height: getAvatarSize(),
				}}
			>
				<Typography
					variant="h1"
					className={classes.avatarTypography}
					style={{
						fontSize: getFontSize(),
					}}
				>
					{getNameMainLetter()}
				</Typography>
			</Container>
		</Container>
	)
}

export default Avatar
