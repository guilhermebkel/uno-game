import React from "react"
import {
	Drawer,
	Grid,
	Typography,
} from "@material-ui/core"

import {
	Avatar,
} from "@/components"

import useStyles from "@/components/Menu/styles"

type MenuProps = {

}

const Menu: React.FC<MenuProps> = (props) => {
	const classes = useStyles()

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
		</Drawer>
	)
}

export default Menu
