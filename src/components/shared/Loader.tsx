import { Spinner, SpinnerProps, useColorModeValue } from '@chakra-ui/react'

type LoaderProps = SpinnerProps

export const useLoaderColor = (): string => useColorModeValue('purple.700', 'purple.300')

const Loader: React.FC<LoaderProps> = ({ ...rest }) => {
  const loaderColor = useLoaderColor()
  return <Spinner color={loaderColor} {...rest} />
}

export default Loader
