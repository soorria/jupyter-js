import { Text, TextProps } from '@chakra-ui/react'

type GradientTextProps = TextProps & {
  bgGradient: TextProps['bgGradient']
}

const GradientText: React.FC<GradientTextProps> = ({ children, bgGradient, ...rest }) => {
  return (
    <Text as="span" bgClip="text" bgGradient={bgGradient} {...rest}>
      {children}
    </Text>
  )
}

export default GradientText
