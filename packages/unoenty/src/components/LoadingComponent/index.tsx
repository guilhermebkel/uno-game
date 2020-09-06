import React from "react"
import { CircularProgress, Grid, Fade } from "@material-ui/core"

type LoadingComponentProps = {
	children: React.ReactElement
	customLoadingElement?: React.ReactElement
	loading: boolean
}

const LoadingComponent: React.FC<LoadingComponentProps> = (props) => {
	const { children, loading, customLoadingElement } = props

	let component

	if (loading) {
		if (customLoadingElement) {
			component = customLoadingElement
		} else {
			component = (
				<Grid container justify="center" alignItems="center">
					<CircularProgress color="secondary" />
				</Grid>
			)
		}
	} else {
		component = (
			<Fade in={!loading}>
				{children}
			</Fade>
		)
	}

	return component
}

export default LoadingComponent
