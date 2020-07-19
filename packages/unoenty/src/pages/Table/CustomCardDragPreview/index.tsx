import React from "react"
import { useDragLayer, XYCoord } from "react-dnd"

import { CARD_TYPE } from "@unoenty/pages/Table/CardDeck"

import useStyles from "@unoenty/pages/Table/CustomCardDragPreview/styles"

const CustomCardDragPreview = () => {
  const {
    itemType,
    isDragging,
    item,
    initialOffset,
    currentOffset
  } = useDragLayer((monitor) => ({
    item: monitor.getItem(),
    itemType: monitor.getItemType(),
    initialOffset: monitor.getInitialSourceClientOffset(),
    currentOffset: monitor.getSourceClientOffset(),
    isDragging: monitor.isDragging()
  }))

  const classes = useStyles()

  const getItemStyles = (initialOffset: XYCoord | null, currentOffset: XYCoord | null) => {
    if (!initialOffset || !currentOffset) {
      return {
        display: "none"
      }
    }
  
    const { x, y } = currentOffset

    const transform = `translate(${x}px, ${y}px)`
  
    return {
      transform,
      WebkitTransform: transform,
    }
  }

  if (isDragging) {
    return (
      <div className={classes.container} >
        <div style={getItemStyles(initialOffset, currentOffset)}>
          {itemType === CARD_TYPE && (
            <img
              alt={item.name}
              src={item.src}
              className={item.className}
            />
          )}
        </div>
      </div>
    )
  } else {
    return null
  }
}

export default CustomCardDragPreview
