import React, { useCallback } from "react"
import { Container, Typography } from "@material-ui/core"
import { fade } from "@material-ui/core/styles/colorManipulator"

import { stringToColor } from "@/utils/color"
import Device from "@/utils/device"

import theme from "@/styles/theme"

import useStyles from "@/components/Avatar/styles"

type AvatarProps = {
	size: "small" | "large"
	name: string
	className?: string
}

const Avatar: React.FC<AvatarProps> = (props) => {
	const { size, name, className } = props

	const classes = useStyles()

	const getNameMainLetter = useCallback(() => {
		const firstLetter = name[0]

		const upperCasedFirstLetter = firstLetter.toUpperCase()

		return upperCasedFirstLetter
	}, [name])

	const getFontSize = useCallback(() => {
		let fontSize: number | undefined

		if (size === "large") {
			fontSize = 40
		}

		if (size === "small") {
			fontSize = 20
		}

		return fontSize
	}, [size])

	const getAvatarColor = useCallback(() => stringToColor(name), [name])

	const getAvatarSize = useCallback(() => {
		let avatarSize: number | undefined

		if (size === "large") {
			avatarSize = 65
		}

		if (size === "small") {
			avatarSize = Device.isMobile ? 40 : 45
		}

		return avatarSize
	}, [size])

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
				className={`${classes.avatarContent} ${className}`}
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
						color: theme.palette.getContrastText(getAvatarColor())
					}}
				>
					{getNameMainLetter()}
				</Typography>
			</Container>
		</Container>
	)
}

export default Avatar
