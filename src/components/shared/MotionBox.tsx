import { Box, BoxProps } from '@chakra-ui/react'
import { isValidMotionProp, motion } from 'framer-motion'
import { forwardRef } from 'react'

const MotionBox = motion.custom<BoxProps>(
  forwardRef((props, ref) => {
    const chakraProps: Record<string, any> = {}
    Object.entries(props).forEach(([key, value]) => {
      if (!isValidMotionProp(key)) {
        chakraProps[key] = [value]
      }
    })
    return <Box ref={ref as any} {...chakraProps} />
  })
)

export default MotionBox
