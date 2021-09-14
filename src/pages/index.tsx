import {
  Box,
  Button,
  Center,
  Heading,
  Icon,
  keyframes,
  Stack,
  Text,
  useBreakpointValue,
  useColorModeValue,
} from '@chakra-ui/react'
import { useSession } from 'next-auth/client'
import Link from 'next/link'
import dynamic from 'next/dynamic'
import { useEffect, useState } from 'react'
import { FiArrowDown, FiArrowRight } from 'react-icons/fi'
import { useInView } from 'react-intersection-observer'

import FeaturesList from '#src/components/landing/FeaturesList'
import Pricing from '#src/components/landing/Pricing'
import MainLayout from '#src/components/layout/MainLayout'
import GradientText from '#src/components/shared/GradientText'
import Loader from '#src/components/shared/Loader'
import { __prod__ } from '#src/constants'
import { useRouter } from 'next/router'

const DemoLoadingFallback = () => (
  <Center h="100%" flexDirection="column">
    <Text mb={4} fontSize="xl">
      Loading demo
    </Text>
    <Loader size="xl" />
  </Center>
)

const Demo = dynamic(() => import('#src/components/landing/Demo'), {
  loading: DemoLoadingFallback,
})

const DEV_SHOW_DEMO = __prod__ || true

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
  const arrowColor = useColorModeValue('purple.700', 'purple.300')
  const { ref, inView } = useInView({ triggerOnce: true })
  const btnSize = useBreakpointValue({ base: 'xl', sm: '2xl' })

  const { prefetch } = useRouter()

  useEffect(() => {
    prefetch('/app/note/[id]/asdkfasd').then(() => console.log('preloaded'))
  }, [prefetch])

  useEffect(() => {
    if (inView) {
      setShowDemo(true)
    }
  }, [inView])

  const textGradients = useColorModeValue(GRADIENTS.light, GRADIENTS.dark)

  const getStartedButton = (
    <Link href={session ? '/app/dashboard' : '/login'} passHref>
      <Button
        as="a"
        size={btnSize}
        variant="gradientBorder"
        rightIcon={session ? <Icon as={FiArrowRight} /> : undefined}
      >
        {session ? 'Go to dashboard' : 'Get started for free'}
      </Button>
    </Link>
  )

  return (
    <MainLayout>
      <Box>
        <Center as="section" h="80vh" py="13vh" flexDirection="column">
          <Heading
            as="h1"
            size="3xl"
            mx="auto"
            textAlign="center"
            maxW="40rem"
            lineHeight="1"
            px={4}
          >
            <GradientText bgGradient={textGradients[0]}>edit</GradientText> and{' '}
            <GradientText bgGradient={textGradients[1]}>annotate</GradientText> code right from{' '}
            <GradientText bgGradient={textGradients[2]}>your browser</GradientText>
          </Heading>
          <Box mx="auto" mt="4rem" mb="6rem">
            {getStartedButton}
          </Box>
          <Box as="a" href="#demo" animation={`${bounce} 1s infinite`}>
            <Icon boxSize="2.5rem" as={FiArrowDown} color={arrowColor} />
          </Box>
        </Center>
        <Center
          id="demo"
          position="relative"
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
            {showDemo && DEV_SHOW_DEMO ? <Demo /> : <DemoLoadingFallback />}
          </Stack>
        </Center>
        <FeaturesList />
        <Pricing />
        <Center mt="2rem" mb="12rem">
          {getStartedButton}
        </Center>
      </Box>
    </MainLayout>
  )
}

export default IndexPage
