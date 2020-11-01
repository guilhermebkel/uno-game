import React, { ReactElement } from "react"
import { Skeleton } from "@material-ui/lab"
import { Grid, makeStyles, createStyles, Card, CardContent } from "@material-ui/core"

import { Divider } from "../components"

const useStyles = makeStyles(theme => createStyles({
	cardContentButton: {
		paddingBottom: `${theme.spacing(1)}px !important`,
		padding: `${theme.spacing(1)}px !important`,
		backgroundColor: theme.palette.primary.main,
	},
	cardContentGameItem: {
		paddingBottom: `${theme.spacing(3)}px !important`,
		padding: `${theme.spacing(3)}px !important`,
		backgroundColor: theme.palette.background.default,
	},
}))

const GameListSkeleton = (): ReactElement => {
	const classes = useStyles()

	const cards = [...new Array(3)].map((_, index) => (
		<React.Fragment key={index}>
			<Card>
				<CardContent className={classes.cardContentGameItem}>
					<Grid container justify="space-between">
						<Skeleton
							animation="wave"
							variant="rect"
							height={30}
							width="30%"
						/>

						<Skeleton
							animation="wave"
							variant="circle"
							height={30}
						/>

						<Skeleton
							animation="wave"
							variant="rect"
							height={30}
							width="10%"
						/>
					</Grid>
				</CardContent>
			</Card>

			<Divider orientation="horizontal" size={2} />
		</React.Fragment>
	))

	return (
		<Grid container direction="column">
			<Skeleton
				animation="wave"
				variant="rect"
				height={30}
				width="30%"
			/>

			<Divider orientation="horizontal" size={5} />

			{cards}
		</Grid>
	)
}

export default GameListSkeleton
