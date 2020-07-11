import React from "react"
import { Grid, Container, Button } from "@material-ui/core"

import { useSocketStore } from "../../store/socket"

import RoomCard from "./RoomCard"

const Dashboard = () => {
	const socketStore = useSocketStore()

	const handleCreateNewGame = () => {
		socketStore.io.emit("CreateGame")

		socketStore.io.on("GameCreated", (game) => {
			console.log(game)
		})
	}

	return (
		<Container>
			<Grid container spacing={2}>
				<Grid item sm={12} md={12} lg={12} xl={12}>
					<Button
						color="primary"
						variant="contained"
						fullWidth
						onClick={handleCreateNewGame}
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
