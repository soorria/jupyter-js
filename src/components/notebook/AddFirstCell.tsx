import { Box, Heading, Icon, keyframes } from '@chakra-ui/react'
import { FiChevronDown } from 'react-icons/fi'
import AddCell from './AddCell'

const floating = keyframes`
  from {
    transform: translateY(10%)
  }

  to {
    transform: translateY(-10%)
  }
`

interface AddFirstCellProps {
  noteId: string
}

const AddFirstCell: React.FC<AddFirstCellProps> = ({ noteId }) => {
  return (
    <Box py={16}>
      <Heading as="h3" mb={4} textAlign="center">
        Create your first cell
      </Heading>
      <Box mx="auto" textAlign="center" mb={16}>
        <Icon
          as={FiChevronDown}
          boxSize="2rem"
          animation={`${floating} 1500ms infinite alternate ease-in-out`}
        />
      </Box>
      <AddCell noteId={noteId} prevCellId={null} expanded />
    </Box>
  )
}

export default AddFirstCell
