import React from "react"
import { Grid } from "@material-ui/core"

import useStyles from "./styles"

const Header = () => {
	const classes = useStyles()

	return (
		<Grid className={classes.headerContainer}>

		</Grid>
	)
}

export default Header
