import React, { useEffect, ReactElement } from "react"
import { Grid, makeStyles, Zoom, Fade } from "@material-ui/core"
import lottie from "lottie-web"
import { JackInTheBox, Pulse } from "react-awesome-reveal"

import tarotAnimation from "../../assets/animations/tarot.json"
// import fullLogo from "../../assets/logo.png"

const LOADING_TAG_ID = "loading"
const animationData = tarotAnimation

type LoadingProps = {
	loading: boolean
	background?: string
	children: React.ReactNode
}

const useStyle = makeStyles({
	container: {
		height: "100vh",
	},
	loadingAnimation: {
		width: 400,
		height: "auto",
	},
	logo: {
		width: "150px",
	},
})

const LoadingApp: React.FC<LoadingProps> = (props) => {
	const { loading, children, background } = props

	const classes = useStyle()

	const initAnimation = () => {
		lottie.loadAnimation({
			container: document.getElementById(LOADING_TAG_ID) as Element,
			renderer: "canvas",
			loop: true,
			autoplay: true,
			animationData,
		})
	}

	useEffect(() => {
		initAnimation()
	}, [])

	return (
		<>
			<div style={{ height: "100%", width: "100%", overflow: "hidden", position: "absolute" }}>
				<Zoom in={loading}>
					<JackInTheBox>
						<Pulse>
							<Grid
								container
								justify="center"
								alignItems="center"
								className={classes.container}
								direction="column"
								style={{ backgroundColor: background }}
							>
								{/* <img src={fullLogo} className={classes.logo} alt="UnoGame" /> */}
								<div id={LOADING_TAG_ID} className={classes.loadingAnimation} />
							</Grid>
						</Pulse>
					</JackInTheBox>
				</Zoom>
			</div>
			{!loading && <Fade in={!loading} children={children as React.ReactElement} />}
		</>
	)
}

LoadingApp.defaultProps = {
	background: "#222329",
}

export default LoadingApp
