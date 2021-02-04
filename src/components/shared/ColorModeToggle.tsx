import { IconButton, IconButtonProps, useColorMode } from '@chakra-ui/react'
import { FiMoon, FiSun } from 'react-icons/fi'

const ColorModeToggle: React.FC<Partial<IconButtonProps>> = props => {
  const { colorMode, toggleColorMode } = useColorMode()
  return (
    <IconButton
      {...props}
      aria-label="toggle dark mode"
      icon={colorMode === 'light' ? <FiMoon /> : <FiSun />}
      onClick={toggleColorMode}
    >
      Toggle Dark Mode
    </IconButton>
  )
}

export default ColorModeToggle
