import React from "react"
import { Skeleton } from "@material-ui/lab"
import { Grid, makeStyles, createStyles, Card, CardContent } from "@material-ui/core"

import { Divider } from "../components"

const useStyles = makeStyles(theme => createStyles({
	cardContentButton: {
		paddingBottom: `${theme.spacing(1)}px !important`,
		padding: `${theme.spacing(1)}px !important`,
		backgroundColor: theme.palette.primary.main
	},
	cardContentPlayerItem: {
		paddingBottom: `${theme.spacing(3)}px !important`,
		padding: `${theme.spacing(3)}px !important`,
		backgroundColor: theme.palette.background.default
	}
}))

const PlayerListSkeleton = () => {
	const classes = useStyles()

	const cards = [...new Array(3)].map(() => (
		<>
			<Card>
				<CardContent className={classes.cardContentPlayerItem}>
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

			<Divider size={2} />
		</>
	))

	return (
		<Grid container direction="column">
			<Divider size={4} />

			<Card>
				<CardContent className={classes.cardContentButton}>
					<Grid container justify="center">
						<Skeleton
							animation="wave"
							variant="rect"
							height={20}
							width="10%"
						/>
					</Grid>
				</CardContent>
			</Card>

			<Divider size={5} />

			{cards}
		</Grid>
	)
}

export default PlayerListSkeleton
