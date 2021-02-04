import { useIsomorphicLayoutEffect } from '#src/hooks'
import { Box, BoxProps, Center, Flex, Icon, useColorModeValue } from '@chakra-ui/react'
import { ReactNode, useCallback, useEffect, useRef, useState } from 'react'
import { MdDragHandle } from 'react-icons/md'

interface ResizableProps {
  minWidth?: BoxProps['minWidth']
  maxWidth?: BoxProps['maxWidth']
  minHeight?: BoxProps['minHeight']
  maxHeight?: BoxProps['maxHeight']
  defaultRatio?: number
  left: ReactNode
  right: ReactNode
}

const RESIZE_BAR_SIZE = 4

type ResizeHandler = (event: MouseEvent | TouchEvent) => any
type DragEndHandler = (event: MouseEvent | TouchEvent) => any

const events = {
  touch: {
    start: 'touchstart',
    move: 'touchmove',
    end: 'touchend',
  },
  mouse: {
    start: 'mousedown',
    move: 'mousemove',
    end: 'mouseup',
  },
} as const

const addResizableEvents = ({
  handleResize,
  handleDragEnd,
}: {
  handleResize: ResizeHandler
  handleDragEnd: DragEndHandler
}): (() => void) => {
  window.addEventListener(events.mouse.move, handleResize)
  window.addEventListener(events.touch.move, handleResize)
  window.addEventListener(events.mouse.end, handleDragEnd)
  window.addEventListener(events.touch.end, handleDragEnd)

  return () => {
    window.removeEventListener(events.mouse.move, handleResize)
    window.removeEventListener(events.touch.move, handleResize)
    window.removeEventListener(events.mouse.end, handleDragEnd)
    window.removeEventListener(events.touch.end, handleDragEnd)
  }
}

const getTouchId = (e: any): number | null =>
  e?.targetTouches?.[0]?.identifier ?? e?.changedTouches?.[0]?.identifier

const findTouch = (touches?: TouchList, id?: number | null): Touch | null => {
  if (id === null || !touches?.length) return null
  for (let i = 0; i < touches.length; i++) {
    if (touches[i].identifier === id) return touches[i]
  }
  return null
}

const Resizable: React.FC<ResizableProps> = ({
  minWidth,
  maxWidth,
  minHeight,
  maxHeight,
  defaultRatio = 0.5,
  left,
  right,
}) => {
  const [width, setWidth] = useState(0)
  const [height, setHeight] = useState(0)
  const leftRef = useRef<HTMLDivElement>()
  const containerRef = useRef<HTMLDivElement>()
  const EWRef = useRef<HTMLDivElement>(null)
  const NSRef = useRef<HTMLDivElement>(null)
  const touchIdRef = useRef<number | null>(null)
  const dragBarColor = useColorModeValue('purple.100', 'purple.600')
  const dragBarHoverColor = useColorModeValue('purple.200', 'purple.500')
  const dragHandleColor = useColorModeValue('purple.900', 'purple.50')

  useIsomorphicLayoutEffect(() => {
    if (containerRef.current && !width) {
      const ratio = defaultRatio > 1 ? 1 : defaultRatio < 0 ? 0 : defaultRatio
      setWidth(containerRef.current.clientWidth * Math.max(Math.min(ratio, 1), 0))
      setHeight(containerRef.current.clientHeight)
    }
  }, [])

  // useEffect(() => {
  //   const handleResize = debounce(() => {
  //     console.log(width, leftRef.current?.clientWidth, containerRef.current?.clientWidth)
  //   }, 100)
  //   window.addEventListener('resize', handleResize)
  //   return () => {
  //     window.removeEventListener('resize', handleResize)
  //   }
  // }, [])

  // East-West Dragging
  const [EWDragging, setEWDragging] = useState(false)
  useEffect(() => {
    if (!EWDragging) return

    const handleResize: ResizeHandler = event => {
      if (event.type === events.mouse.move) {
        setWidth((event as MouseEvent).pageX - leftRef.current!.getBoundingClientRect().x)
      } else {
        // Prevent scrolling when you try to drag
        event.preventDefault()

        event = event as TouchEvent
        const id = touchIdRef.current
        const touch = findTouch(event.targetTouches ?? event.changedTouches, id)

        if (!touch) return

        setWidth(touch.pageX - leftRef.current!.getBoundingClientRect().x)
      }
      console.log(2)
    }

    const handleDragEnd = () => {
      setEWDragging(false)
    }

    return addResizableEvents({ handleResize, handleDragEnd })
  }, [EWDragging])
  const handleEWDragStart = useCallback((e: any) => {
    if (e.type === events.touch.start) {
      e.preventDefault()
      touchIdRef.current = getTouchId(e)
    }
    setEWDragging(true)
    console.log(1)
  }, [])

  // East-West Dragging
  const [NSDragging, setNSDragging] = useState(false)
  useEffect(() => {
    if (!NSDragging) return

    const handleResize: ResizeHandler = event => {
      // https://stackoverflow.com/a/50310297
      const rect = containerRef.current!.getBoundingClientRect()
      const containerY = window.pageYOffset + rect.top

      if (event.type === events.mouse.move) {
        setHeight((event as MouseEvent).pageY - containerY)
      } else {
        // Prevent scrolling when you try to drag
        event.preventDefault()

        event = event as TouchEvent
        const id = touchIdRef.current
        const touch = findTouch(event.targetTouches ?? event.changedTouches, id)

        if (!touch) return

        setHeight(touch.pageY - containerY)
      }
    }

    const handleDragEnd: DragEndHandler = () => {
      setNSDragging(false)
    }

    return addResizableEvents({ handleResize, handleDragEnd })
  }, [NSDragging])
  const handleNSDragStart = useCallback((e: any) => {
    if (e.type === events.touch.start) {
      e.preventDefault()
      touchIdRef.current = getTouchId(e)
    }
    setNSDragging(true)
  }, [])

  useEffect(() => {
    // The refs might be undefined by the time the component is unmounted
    const nodes = { ew: EWRef.current, ns: NSRef.current }

    nodes.ew?.addEventListener(events.touch.start, handleEWDragStart, { passive: false })
    nodes.ns?.addEventListener(events.touch.start, handleNSDragStart, { passive: false })

    return () => {
      nodes.ew?.removeEventListener(events.touch.start, handleEWDragStart)
      nodes.ns?.removeEventListener(events.touch.start, handleNSDragStart)
    }
  }, [handleEWDragStart, handleNSDragStart])

  const dragging = EWDragging || NSDragging

  return (
    <Flex
      ref={containerRef as any}
      position="relative"
      minH={minHeight}
      maxH={maxHeight}
      style={{ height: height ? `${height}px` : 'auto' }}
    >
      <Box
        position="absolute"
        left={0}
        top={0}
        right={0}
        bottom={0}
        opacity={dragging ? 1 : 0}
        bg="transparent"
        style={{ backdropFilter: 'blur(5px)' }}
        transition="opacity 150ms ease-in-out"
        zIndex={2}
        pointerEvents={dragging ? 'initial' : 'none'}
      />
      <Box
        minWidth={minWidth}
        maxWidth={maxWidth}
        position="relative"
        ref={leftRef as any}
        style={{ width: `${width}px` }}
        pr={RESIZE_BAR_SIZE / 2}
        pb={RESIZE_BAR_SIZE / 2}
      >
        {left}
        <Center
          ref={EWRef}
          position="absolute"
          right={0}
          top={0}
          bottom={RESIZE_BAR_SIZE / 2}
          w={RESIZE_BAR_SIZE}
          cursor="col-resize"
          transform="translateX(50%)"
          bg={dragBarColor}
          _hover={{ bg: dragBarHoverColor }}
          color={dragHandleColor}
          transition="all 200ms"
          onMouseDown={handleEWDragStart}
          zIndex={3}
          flexDirection="column"
        >
          <Icon transform="rotate(90deg)" as={MdDragHandle} boxSize={RESIZE_BAR_SIZE * 2} />
        </Center>
      </Box>
      <Box
        pl={RESIZE_BAR_SIZE / 2}
        pb={RESIZE_BAR_SIZE / 2}
        minWidth={minWidth}
        maxWidth={maxWidth}
        flex="1"
      >
        {right}
      </Box>
      <Center
        ref={NSRef}
        position="absolute"
        right={0}
        left={0}
        bottom={0}
        h={RESIZE_BAR_SIZE}
        cursor="row-resize"
        transform="translateY(50%)"
        bg={dragBarColor}
        _hover={{ bg: dragBarHoverColor }}
        color={dragHandleColor}
        transition="all 200ms"
        onMouseDown={handleNSDragStart}
        zIndex={3}
      >
        <Icon as={MdDragHandle} boxSize={RESIZE_BAR_SIZE * 2} />
      </Center>
    </Flex>
  )
}

export default Resizable
