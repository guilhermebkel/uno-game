import React from "react"

import useCards from "../../hooks/useCards"

const Table = () => {
	const { cards, loading } = useCards({ preload: true })

	return (
		<>
			{loading ? (
				<h1>Loading...</h1>
			) : (
				<>
					<h1>Table</h1>
					<img src={cards["0"]?.blue.src} alt={cards["0"]?.blue.name} />
				</>
			)}
		</>
	)
}

export default Table
