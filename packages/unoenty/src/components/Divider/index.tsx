import React, { ReactElement } from "react"

import theme from "../../styles/theme"

type DividerProps = {
	size: number
	orientation: "vertical" | "horizontal"
}

const Divider = (props: DividerProps): ReactElement => {
	const { size, orientation } = props

	return (
		<div
			style={{
				height: orientation === "horizontal" ? size * theme.spacing() : "auto",
				width: orientation === "vertical" ? size * theme.spacing() : "100%",
			}}
		/>
	)
}

export default Divider
