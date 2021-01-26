import { Spinner, SpinnerProps, useColorModeValue } from '@chakra-ui/react'

type LoaderProps = SpinnerProps & {}

const Loader: React.FC<LoaderProps> = ({ ...rest }) => {
  const loaderColor = useColorModeValue('purple.700', 'purple.300')
  return <Spinner color={loaderColor} {...rest} />
}

export default Loader
