import React, { useEffect } from "react"

import useCards from "../../hooks/useCards"

const Table = () => {
	const {
		preloadingCardPictures,
		getCard,
		availableCards,
		usedCards,
		commitPlay
	} = useCards({
		preloadCardPictures: true,
		players: [{
			id: 1,
			name: "mota"
		}]
	})

	useEffect(() => {
		console.log(availableCards, usedCards)
	}, [availableCards, usedCards])

	return (
		<>
			{preloadingCardPictures ? (
				<h1>Preloading Card Pictures...</h1>
			) : (
				<>
					<h1>Table</h1>
					<img src={getCard("0", "blue").src} alt={getCard("0", "blue").name} />
				</>
			)}
		</>
	)
}

export default Table
