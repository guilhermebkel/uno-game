import React from "react"

import useCards from "../../hooks/useCards"

const Table = () => {
	const { cards, loading } = useCards({ preload: true })

	if (loading) {
		return <h1>Loading...</h1>
	} else {
		return (
			<>
				<h1>Table</h1>
				<img src={cards["0"]?.blue.src} alt={cards["0"]?.blue.name} />
			</>
		)
	}
}

export default Table
