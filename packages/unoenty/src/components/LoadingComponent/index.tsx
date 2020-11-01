import React from "react"
import { CircularProgress, Grid, Fade } from "@material-ui/core"

import useStyles from "@/components/LoadingComponent/styles"

type LoadingComponentProps = {
	children: React.ReactElement
	customLoadingElement?: React.ReactElement
	loading: boolean
}

const LoadingComponent: React.FC<LoadingComponentProps> = (props) => {
	const { children, loading, customLoadingElement } = props

	const classes = useStyles()

	let component

	if (loading) {
		if (customLoadingElement) {
			component = customLoadingElement
		} else {
			component = (
				<Grid
					container
					justify="center"
					alignItems="center"
					className={classes.defaultLoadingContainer}
				>
					<CircularProgress color="primary" />
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
