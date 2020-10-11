import React, { ReactElement } from "react"

import theme from "../../styles/theme"

type DividerProps = {
	size: number
}

const Divider = (props: DividerProps): ReactElement => {
	const { size } = props

	return (
		<div
			style={{
				height: size * theme.spacing(),
				width: "100%",
			}}
		/>
	)
}

export default Divider
