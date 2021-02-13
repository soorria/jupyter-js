import MainLayout from '#src/components/layout/MainLayout'
import CodeCell from '#src/components/notebook/CodeCell'
import MarkdownCell from '#src/components/notebook/MarkdownCell'
import GradientText from '#src/components/shared/GradientText'
import Loader from '#src/components/shared/Loader'
import noop from '#src/utils/noop'
import {
  Box,
  Button,
  Center,
  Heading,
  Icon,
  keyframes,
  Stack,
  Text,
  useColorModeValue,
} from '@chakra-ui/react'
import { useSession } from 'next-auth/client'
import Link from 'next/link'
import { useEffect, useState } from 'react'
import { FiArrowDown } from 'react-icons/fi'
import { useInView } from 'react-intersection-observer'

const INITIAL_CODE = `import { useState } from 'react'
import 'bulma/css/bulma.css'

const App = () => {
  const [count, setCount] = useState(0)
  
  return (
    <div className="content m-4">
      <h1 className="title">Count: {count}</h1>
      <button className="button is-primary" onClick={() => setCount(count + 1)}>Click me!</button>
    </div>
  )
}

show(<App />)
`

const INITIAL_MARKDOWN = `# Double-Click to Edit

## Here's some lorem ipsum

Natus veniam cumque et vitae consequatur perferendis ipsam et. Et aliquam cupiditate provident voluptatum deleniti ullam voluptatem. Provident magnam dolores amet voluptas qui magnam cumque architecto. Ullam maiores in ipsam alias et quas.

A vitae quo voluptatem earum. Quo adipisci eveniet dolor dolorem dolorem eos veritatis quidem. Eos quidem ex vitae odio. Iusto quam est odit. Consequatur totam nesciunt recusandae minima expedita possimus suscipit beatae. Nisi natus ab fugit quis et possimus officiis enim.
`

const GRADIENTS = {
  light: [
    'linear(45deg, pink.600, purple.600)',
    'linear(45deg, purple.600, cyan.500)',
    'linear(45deg, cyan.500, pink.600)',
  ],
  dark: [
    'linear(45deg, pink.400, purple.400)',
    'linear(45deg, purple.400, cyan.300)',
    'linear(45deg, cyan.300, pink.400)',
  ],
} as const

const bounce = keyframes`
  0%, 100% {
    transform: translateY(-25%);
    animation-timing-function: cubic-bezier(0.8,0,1,1);
  }
  50% {
    transform: none;
    animation-timing-function: cubic-bezier(0,0,0.2,1);
  }
`

const IndexPage: React.FC = () => {
  const [session] = useSession()
  const [showDemo, setShowDemo] = useState(false)
  const demoBg = useColorModeValue('purple.200', 'purple.800')
  const { ref, inView } = useInView({ triggerOnce: true })

  useEffect(() => {
    if (inView) {
      setShowDemo(true)
    }
  }, [inView])

  const textGradients = useColorModeValue(GRADIENTS.light, GRADIENTS.dark)

  const getStartedButton = (
    <Link href={session ? '/app/dashboard' : '/login'} passHref>
      <Button as="a" size="2xl" variant="gradientBorder">
        Get started now!
      </Button>
    </Link>
  )

  return (
    <MainLayout>
      <Box>
        <Center as="section" h="80vh" py="13vh" flexDirection="column">
          <Heading as="h1" size="3xl" mx="auto" textAlign="center" maxW="40rem" lineHeight="1">
            <GradientText bgGradient={textGradients[0]}>edit</GradientText> and{' '}
            <GradientText bgGradient={textGradients[1]}>annotate</GradientText> code right from{' '}
            <GradientText bgGradient={textGradients[2]}>your browser</GradientText>
          </Heading>
          <Box mx="auto" mt="4rem" mb="6rem">
            {getStartedButton}
          </Box>
          <Box as="a" href="#demo" animation={`${bounce} 1s infinite`}>
            <Icon boxSize="2.5rem" as={FiArrowDown} />
          </Box>
        </Center>
        <Center
          position="relative"
          id="demo"
          minH="100vh"
          bg={demoBg}
          mt="10vh"
          mb="20vh"
          transform="skewY(-5deg)"
          py="10vh"
          _before={{
            content: '""',
            bg: demoBg,
            opacity: 0.6,
            transform: 'skewY(7deg)',
            position: 'absolute',
            top: 0,
            left: 0,
            w: 'full',
            h: 'full',
          }}
        >
          <Stack spacing={8} transform="skewY(5deg)" minH="50%" flex="1" mx={4} py={8} ref={ref}>
            {showDemo ? (
              <>
                <Heading as="h2">Try it out</Heading>
                <CodeCell
                  initialValue={INITIAL_CODE}
                  onDelete={noop}
                  onChange={noop}
                  onMove={noop}
                  cellId="demo"
                />
                <MarkdownCell
                  initialValue={INITIAL_MARKDOWN}
                  onDelete={noop}
                  onChange={noop}
                  onMove={noop}
                  cellId="demo"
                />
              </>
            ) : (
              <Center h="100%" flexDirection="column">
                <Text mb={4} fontSize="xl">
                  Loading demo
                </Text>
                <Loader size="xl" />
              </Center>
            )}
          </Stack>
        </Center>
        <Center mt="2rem" mb="12rem">
          {getStartedButton}
        </Center>
      </Box>
    </MainLayout>
  )
}

export default IndexPage
