import React from "react"
import { Container, Typography, TypographyVariant } from "@material-ui/core"
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

	const getTypographyVariant = () => {
		let variant: TypographyVariant | undefined

		if (size === "large") {
			variant = "h1"
		}

		if (size === "small") {
			variant = "h3"
		}

		return variant
	}

	const getAvatarColor = () => {
		const colors = [
			"#E0CE2D",
			"#35EA88",
			"#35EAC9",
			"#9E3EFF",
		]

		return colors[0]
	}

	const getAvatarSize = () => {
		let avatarSize: number | undefined

		if (size === "large") {
			avatarSize = 85
		}

		if (size === "small") {
			avatarSize = 65
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
					variant={getTypographyVariant()}
					className={classes.avatarTypography}
				>
					{getNameMainLetter()}
				</Typography>
			</Container>
		</Container>
	)
}

export default Avatar
