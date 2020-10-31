import React from "react"
import {
	Drawer,
} from "@material-ui/core"

import useStyles from "@/components/Menu/styles"

type MenuProps = {

}

const Menu: React.FC<MenuProps> = (props) => {
	const classes = useStyles()

	return (
		<Drawer open>
			TESTE
		</Drawer>
	)
}

export default Menu
