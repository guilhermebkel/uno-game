export type CardColors =
"yellow" |
"blue" |
"green" |
"red"

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

export type CardData = {
	id: string
	src: string
	name: string
	color: CardColors
	type: CardTypes
	canBeUsed?: boolean
}
