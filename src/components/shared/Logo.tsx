import { Heading, HeadingProps, keyframes, Text } from '@chakra-ui/react'
import { forwardRef } from 'react'

type LogoProps = HeadingProps

const headingHover = keyframes`
  from {
    background-position: left;
  }

  to {
    background-position: right;
  }
`

const Logo: React.FC<LogoProps> = forwardRef<HTMLHeadingElement, LogoProps>(({ ...rest }, ref) => {
  return (
    <Heading
      as="a"
      userSelect="none"
      bgGradient="linear(45deg, pink.400, purple.400, cyan.300, blue.300, pink.400, purple.400)"
      color="transparent"
      bgClip="text"
      bgSize="600%"
      _hover={{ animation: `${headingHover} 5500ms linear infinite` }}
      size="xl"
      ref={ref as any}
      {...rest}
    >
      j
      <Text as="span" display={{ base: 'none', sm: 'inline' }}>
        upyter.
      </Text>
      js
    </Heading>
  )
})

Logo.displayName = 'Logo'

export default Logo
