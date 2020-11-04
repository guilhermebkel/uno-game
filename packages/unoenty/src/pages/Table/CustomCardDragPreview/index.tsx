import React from "react"
import { useDragLayer, XYCoord } from "react-dnd"

import { CARD_TYPE, DraggedCardItem } from "@/pages/Table/CardDeck"

import useStyles from "@/pages/Table/CustomCardDragPreview/styles"

import { useCardStore } from "@/store/Card"

const CustomCardDragPreview: React.FC = () => {
	const {
		itemType,
		isDragging,
		item,
		initialOffset,
		currentOffset,
	} = useDragLayer((monitor) => ({
		item: monitor.getItem() as DraggedCardItem,
		itemType: monitor.getItemType(),
		initialOffset: monitor.getInitialSourceClientOffset(),
		currentOffset: monitor.getSourceClientOffset(),
		isDragging: monitor.isDragging(),
	}))

	const classes = useStyles()
	const cardStore = useCardStore()

	const getItemStyles = (initialOffset: XYCoord | null, currentOffset: XYCoord | null) => {
		if (!initialOffset || !currentOffset) {
			return {
				display: "none",
			}
		}

		const { x, y } = currentOffset

		const transform = `translate(${x}px, ${y}px)`

		return {
			transform,
			WebkitTransform: transform,
			position: "relative" as const,
			width: 0,
		}
	}

	if (isDragging) {
		return (
			<div className={classes.container} >
				<div style={getItemStyles(initialOffset, currentOffset)}>
					{itemType === CARD_TYPE &&
            cardStore?.selectedCards?.length &&
            cardStore?.selectedCards?.every(card => card.type === item.cardType) ? (
							<>
								{cardStore?.selectedCards?.map((card, index) => (
									<img
										key={index}
										alt={card.name}
										src={card.src}
										className={item.className}
										style={{
											filter: "saturate(1.5)",
											left: +index * 20,
											position: "absolute",
										}}
									/>
								))}
							</>
						) : (
							<img
								alt={item.name}
								src={item.src}
								className={item.className}
								style={{ filter: "saturate(1.5)" }}
							/>
						)}
				</div>
			</div>
		)
	} else {
		return <React.Fragment />
	}
}

export default CustomCardDragPreview
