import { Icon } from '@chakra-ui/react'
import { FiArrowUp } from 'react-icons/fi'

interface SortDirectionIconProps {
  isAscending: boolean
}

const SortDirectionIcon: React.FC<SortDirectionIconProps> = ({ isAscending }) => (
  <Icon
    as={FiArrowUp}
    transition="transform 100ms"
    transform={isAscending ? '' : 'rotate(-180deg)'}
  />
)

export default SortDirectionIcon
