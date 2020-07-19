import React, { memo, useEffect, useState } from "react"
import { useDragLayer, XYCoord } from "react-dnd"
import { Container } from "@material-ui/core"

import { CARD_TYPE } from "@unoenty/pages/Table/CardDeck"

import useStyles from "@unoenty/pages/Table/CustomCardDragPreview/styles"

type CardPreviewProps = {
  name: string
  src: string
  className: string
}

const CardPreview = memo((props: CardPreviewProps) => {
    const [tickTock, setTickTock] = useState(false)

    useEffect(() => {
      const interval = setInterval(() => setTickTock(!tickTock), 500)

      return () => clearInterval(interval)
    }, [tickTock])

    return (
      <img
        alt={props.name}
        src={props.src}
        className={props.className}
      />
    )
  }
)

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
      <Container
        disableGutters
        maxWidth={false}
        className={classes.container}
      >
        <Container
          disableGutters
          maxWidth={false}
          style={getItemStyles(initialOffset, currentOffset)}
        >
          {itemType === CARD_TYPE && (
            <CardPreview
              name={item.name}
              src={item.src}
              className={item.className}
            />
          )}
        </Container>
      </Container>
    )
  } else {
    return null
  }
}

export default CustomCardDragPreview
