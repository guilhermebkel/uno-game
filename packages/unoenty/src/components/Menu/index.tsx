import React from "react"
import { Link } from "react-router-dom"
import {
	Drawer,
	Grid,
	Typography,
	List,
	ListItem,
	ListItemIcon,
	ListItemText,
} from "@material-ui/core"
import {
	SportsEsports as GameIcon,
} from "@material-ui/icons"

import {
	Avatar,
	Divider,
} from "@/components"

import { useSocketStore } from "@/store/Socket"

import useStyles from "@/components/Menu/styles"

type MenuProps = {

}

const Menu: React.FC<MenuProps> = (props) => {
	const classes = useStyles()
	const socketStore = useSocketStore()

	return (
		<Drawer
			open
			variant="persistent"
			PaperProps={{ className: classes.drawerPaper }}
		>
			<Grid
				container
				justify="flex-start"
				alignItems="center"
			>
				<Avatar
					size="large"
					name="Mota"
				/>

				<Typography
					variant="h3"
					className={classes.avatarName}
				>
					Mota
				</Typography>
			</Grid>

			<Divider size={2} />

			<Typography
				variant="h2"
				className={classes.menuTitle}
			>
				PAGES
			</Typography>

			<Divider size={1} />

			<List>
				<ListItem
					button
					component={Link}
					to="/"
				>
					<ListItemIcon>
						<GameIcon
							fontSize="large"
							className={classes.listItemIcon}
						/>
					</ListItemIcon>
					<ListItemText
						primary="Games"
						primaryTypographyProps={{
							variant: "h3",
							className: classes.listItemText,
						}}
					/>
				</ListItem>
			</List>

			<Divider size={4} />

			<Typography
				variant="h2"
				className={classes.menuTitle}
			>
				LAST GAMES
			</Typography>

			<Divider size={1} />

			<List>
				{socketStore.gameHistory
				?.slice(0, 3)
				.map(gameHistory => (
					<ListItem
						button
						component={Link}
						to={`/${gameHistory.gameId}`}
					>
						<h1>
							{gameHistory.name}
						</h1>
					</ListItem>
				))}
			</List>
		</Drawer>
	)
}

export default Menu
