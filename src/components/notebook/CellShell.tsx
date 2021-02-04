import {
  Box,
  BoxProps,
  Heading,
  HStack,
  IconButton,
  Spacer,
  useColorModeValue,
} from '@chakra-ui/react'
import { FiChevronDown, FiChevronUp, FiTrash2 } from 'react-icons/fi'

type CellShellProps = Omit<BoxProps, 'title'> & {
  title?: React.ReactNode
  toolbarButtons?: React.ReactNode
  onDelete?: () => any
  onMove?: (direction: 'UP' | 'DOWN') => any
}

const CellShell: React.FC<CellShellProps> = ({
  children,
  title,
  onDelete,
  onMove,
  toolbarButtons,
  ...rest
}) => {
  const bg = useColorModeValue('blackAlpha.50', 'whiteAlpha.50')

  return (
    <Box px={4} pb={6} pt={4} bg={bg} rounded="md" {...rest}>
      <HStack spacing={4} pb={4}>
        <Heading fontSize="lg" fontWeight="bold" fontFamily="heading" as="h3">
          {title}
        </Heading>
        <Spacer />
        {toolbarButtons}
        <IconButton
          onClick={onMove && (() => onMove('DOWN'))}
          aria-label="move cell down"
          icon={<FiChevronDown />}
        />
        <IconButton
          onClick={onMove && (() => onMove('UP'))}
          aria-label="move cell up"
          icon={<FiChevronUp />}
        />
        <IconButton
          onClick={onDelete}
          aria-label="delete cell"
          colorScheme="red"
          icon={<FiTrash2 />}
        />
      </HStack>
      {children}
    </Box>
  )
}

export default CellShell
