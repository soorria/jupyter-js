import { Input, InputProps, useColorModeValue } from '@chakra-ui/react'
import { forwardRef } from 'react'

const StyledInput = forwardRef<HTMLInputElement, InputProps>((props, ref) => {
  const focusColor = useColorModeValue('purple.500', 'purple.300')
  return <Input ref={ref} focusBorderColor={focusColor} {...props} />
})

StyledInput.displayName = 'StyledInput'

export default StyledInput
