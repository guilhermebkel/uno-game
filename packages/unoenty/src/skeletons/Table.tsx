import React, { ReactElement } from "react"
import { Skeleton } from "@material-ui/lab"
import { Grid, makeStyles, createStyles, Card, CardContent } from "@material-ui/core"

const useStyles = makeStyles(theme => createStyles({
	cardContentCardDeckPlaceholder: {
		paddingBottom: `${theme.spacing(1)}px !important`,
		padding: `${theme.spacing(1)}px !important`,
	},
}))

const TableSkeleton = (): ReactElement => {
	const classes = useStyles()

	return (
		<Grid container style={{ height: "100%", overflow: "hidden" }}>
			<Grid container>
				<Grid item xs={1}>

				</Grid>
				<Grid item xs={10}>
					<Grid container justify="center" alignItems="center">
						<Card>
							<CardContent className={classes.cardContentCardDeckPlaceholder}>
								<Skeleton
									variant="rect"
									height={50}
									width={100}
								/>
							</CardContent>
						</Card>
					</Grid>
				</Grid>
				<Grid item xs={1}>
					<Skeleton
						variant="rect"
						height={50}
						width="10%"
					/>
				</Grid>
			</Grid>
			<Grid container alignItems="center">
				<Grid item xs={2}>
					<Grid container justify="flex-start">
						<Card>
							<CardContent className={classes.cardContentCardDeckPlaceholder}>
								<Skeleton
									variant="rect"
									height={50}
									width={100}
								/>
							</CardContent>
						</Card>
					</Grid>
				</Grid>
				<Grid item xs={8}>
					<Grid container justify="center" alignItems="center">
						<Card>
							<CardContent className={classes.cardContentCardDeckPlaceholder}>
								<Skeleton
									variant="circle"
									height={100}
									width={100}
								/>
							</CardContent>
						</Card>
					</Grid>
				</Grid>
				<Grid item xs={2}>
					<Grid container justify="flex-end">
						<Card>
							<CardContent className={classes.cardContentCardDeckPlaceholder}>
								<Skeleton
									variant="rect"
									height={50}
									width={100}
								/>
							</CardContent>
						</Card>
					</Grid>
				</Grid>
			</Grid>
			<Grid container alignItems="flex-end">
				<Grid item xs={1}></Grid>
				<Grid item xs={10}>
					<Grid container justify="center">
						<Card>
							<CardContent className={classes.cardContentCardDeckPlaceholder}>
								<Skeleton
									variant="rect"
									height={50}
									width={100}
								/>
							</CardContent>
						</Card>
					</Grid>
				</Grid>
				<Grid item xs={1}></Grid>
			</Grid>
		</Grid>
	)
}

export default TableSkeleton
