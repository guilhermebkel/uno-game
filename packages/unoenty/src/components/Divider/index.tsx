import React from "react"

import theme from "../../styles/theme"

interface DividerProps {
	size: number
}

const Divider = (props: DividerProps) => {
	const { size } = props

	return (
		<div
			style={{
				height: size * theme.spacing(),
				width: "100%"
			}}
		/>
	)
}

export default Divider
