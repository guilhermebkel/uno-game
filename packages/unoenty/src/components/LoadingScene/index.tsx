import React, { useState } from "react"
import {
	Grid,
	ThemeProvider,
	Zoom,
	Fade,
} from "@material-ui/core"

import Node from "@/utils/node"

import useStyles from "@/components/LoadingScene/styles"

import useDidMount from "@/hooks/useDidMount"

import theme from "@/styles/theme"

import logoImg from "@/assets/logo-320.png"

type LoadingSceneProps = {
	onFinish?: () => void | (() => Promise<void>)
	onStart?: () => void | (() => Promise<void>)
	loading?: boolean
	duration?: number
}

type LoadingSceneType = {
	run: (props: LoadingSceneProps) => void
}

const LoadingScene: LoadingSceneType & React.FC<LoadingSceneProps> = (props) => {
	const { onFinish, onStart, loading, children, duration } = props

	const [visible, setVisible] = useState(true)

	const classes = useStyles()

	const handleScene = () => {
		if (onStart) {
			onStart()
		}

		setTimeout(() => {
			setVisible(false)

			if (onFinish) {
				onFinish()
			}
		}, duration)
	}

	useDidMount(() => {
		handleScene()
	})

	return (
		<ThemeProvider theme={theme}>
			<Zoom in={loading ?? visible}>
				<Grid
					container
					direction="column"
					alignItems="center"
					justify="center"
					className={classes.container}
				>
					<img
						className={classes.logo}
						src={logoImg}
						alt="logo"
					/>
				</Grid>
			</Zoom>
			{children && (
				<>
					{!loading && <Fade in={!loading} children={children as React.ReactElement} />}
				</>
			)}
		</ThemeProvider>
	)
}

LoadingScene.run = (props) => {
	Node.renderComponent(
		"loading-scene",
		<LoadingScene {...props} />,
	)
}

export default LoadingScene
