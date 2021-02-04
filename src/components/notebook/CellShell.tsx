import {
  Box,
  BoxProps,
  ButtonGroup,
  Heading,
  HStack,
  IconButton,
  Popover,
  PopoverBody,
  PopoverContent,
  PopoverTrigger,
  Portal,
  Spacer,
  useBreakpointValue,
  useColorModeValue,
} from '@chakra-ui/react'
import { FiChevronDown, FiChevronUp, FiMoreHorizontal, FiTrash2, FiX } from 'react-icons/fi'

type CellShellProps = Omit<BoxProps, 'title'> & {
  title?: React.ReactNode
  toolbarButtons?: React.ReactNode
  onDelete?: () => any
  onMove?: (direction: 'UP' | 'DOWN') => any
}

const Toolbar: React.FC = ({ children }) => {
  const showPopover = useBreakpointValue({ base: true, md: false })

  return showPopover ? (
    <Box>
      <Popover placement="bottom-end">
        {({ onClose }) => (
          <>
            <PopoverTrigger>
              <IconButton aria-label="Show Toolbar" icon={<FiMoreHorizontal />} />
            </PopoverTrigger>
            <Portal>
              <PopoverContent width="auto">
                <PopoverBody py={1} px={1}>
                  <ButtonGroup size="sm" spacing={2} justifyContent="center">
                    {children}
                    <IconButton onClick={onClose} aria-label="Close Toolbar" icon={<FiX />} />
                  </ButtonGroup>
                </PopoverBody>
              </PopoverContent>
            </Portal>
          </>
        )}
      </Popover>
    </Box>
  ) : (
    <>{children}</>
  )
}

const CellShell: React.FC<CellShellProps> = ({
  children,
  title,
  onDelete,
  onMove,
  toolbarButtons,
  ...rest
}) => {
  const bg = useColorModeValue('gray.100', 'whiteAlpha.50')

  return (
    <Box px={4} pb={6} pt={4} bg={bg} rounded="md" {...rest}>
      <HStack spacing={4} pb={4}>
        <Heading fontSize="lg" fontWeight="bold" fontFamily="heading" as="h3">
          {title}
        </Heading>
        <Spacer />
        <Toolbar>
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
        </Toolbar>
      </HStack>
      {children}
    </Box>
  )
}

export default CellShell
