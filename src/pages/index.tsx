import MainLayout from '#src/components/layout/MainLayout'
import GradientText from '#src/components/shared/GradientText'
import { Box, Button, Center, Heading, useColorModeValue } from '@chakra-ui/react'
import { useSession } from 'next-auth/client'
import Link from 'next/link'

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

const IndexPage: React.FC = () => {
  const [session] = useSession()

  const textGradients = useColorModeValue(GRADIENTS.light, GRADIENTS.dark)

  return (
    <MainLayout>
      <Box p={4}>
        <Center as="section" my="15vh" flexDirection="column">
          <Heading size="3xl" mx="auto" textAlign="center" maxW="40rem" lineHeight="1">
            <GradientText bgGradient={textGradients[0]}>edit</GradientText> and{' '}
            <GradientText bgGradient={textGradients[1]}>annotate</GradientText> your code right from{' '}
            <GradientText bgGradient={textGradients[2]}>your browser</GradientText>
          </Heading>
          <Box mx="auto" mt="4rem">
            <Link href={session ? '/app/dashboard' : 'login'} passHref>
              <Button as="a" size="2xl" variant="gradientBorder">
                Get started now!
              </Button>
            </Link>
          </Box>
        </Center>
      </Box>
    </MainLayout>
  )
}

export default IndexPage
