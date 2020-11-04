import React, { createContext, useContext, useState } from "react"

import { CardData } from "@uno-game/protocols"

export interface CardContextData {
	selectedCards: CardData[]
	setSelectedCards: (value: React.SetStateAction<CardData[]>) => void
}

interface CardProviderProps {
	children: React.ReactNode
}

const CardStore = createContext<CardContextData>({} as CardContextData)

export const useCardStore = (): CardContextData => useContext(CardStore)

const CardProvider: React.FC<CardProviderProps> = (props) => {
	const { children } = props

	const [selectedCards, setSelectedCards] = useState<CardData[]>([] as CardData[])

	return (
		<CardStore.Provider
			value={{
				selectedCards,
				setSelectedCards,
			}}
		>
			{children}
		</CardStore.Provider>
	)
}

export default CardProvider
