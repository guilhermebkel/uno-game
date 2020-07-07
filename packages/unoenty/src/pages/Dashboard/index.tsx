import React from "react"
import { Grid, Container, Button } from "@material-ui/core"

import RoomCard from "./RoomCard"

const Dashboard = () => {
	return (
		<Container>
			<Grid container spacing={2}>
				<Grid item sm={12} md={12} lg={12} xl={12}>
					<Button
						color="primary"
						variant="contained"
						fullWidth
					>
						New game
					</Button>
				</Grid>
				<Grid item sm={12} md={12} lg={12} xl={12}>
					<Grid container spacing={2}>
						<Grid item  sm={5} md={4} lg={3} xl={3}>
							<RoomCard />
						</Grid>
						<Grid item  sm={5} md={4} lg={3} xl={3}>
							<RoomCard />
						</Grid>
						<Grid item  sm={5} md={4} lg={3} xl={3}>
							<RoomCard />
						</Grid>
						<Grid item  sm={5} md={4} lg={3} xl={3}>
							<RoomCard />
						</Grid>
					</Grid>
				</Grid>
			</Grid>
			
		</Container>
	)
}

export default Dashboard
