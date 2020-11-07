export type CardColors =
"yellow" |
"blue" |
"green" |
"red" |
"black"

export type CardTypes =
"0" |
"1" |
"2" |
"3" |
"4" |
"5" |
"6" |
"7" |
"8" |
"9" |
"block" |
"change-color" |
"buy-2" |
"buy-4" |
"reverse"

type ColorMap = {
	[key in CardColors]?: string
}

export type CardData = {
	id: string
	src: string
	name: string
	color: CardColors
	type: CardTypes
	canBeUsed?: boolean
	/**
	 * If the card can be mixed with other cards of same type
	 */
	canBeCombed?: boolean
	selectedColor?: CardColors
	possibleColors?: ColorMap
}

export type CurrentCardCombo = {
	cardTypes: Array<CardTypes>
	amountToBuy: number
}
