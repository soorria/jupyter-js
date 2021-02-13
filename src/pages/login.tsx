import MainLayout from '#src/components/layout/MainLayout'
import { Button, Center, Heading, Stack, useColorModeValue } from '@chakra-ui/react'
import { FiGithub } from 'react-icons/fi'
import { FcGoogle } from 'react-icons/fc'
import { signIn, useSession } from 'next-auth/client'
import { useEffect } from 'react'
import { useRouter } from 'next/router'
import Loader from '#src/components/shared/Loader'

interface LoginPageProps {}

const LoginPage: React.FC<LoginPageProps> = () => {
  const router = useRouter()
  const [session, loading] = useSession()
  const bg = useColorModeValue('gray.200', 'gray.700')

  useEffect(() => {
    if (session) {
      router.replace('/app/dashboard')
    }
  }, [session, router])

  return (
    <MainLayout>
      <Center h="full">
        {loading ? (
          <Loader size="xl" />
        ) : (
          <Stack
            spacing={8}
            rounded="xl"
            bg={bg}
            p={10}
            fontSize="xl"
            maxW="30rem"
            w="100%"
            mx={4}
            mb={8}
          >
            <Heading textAlign="center" size="xl">
              Sign In or Sign Up
            </Heading>
            <Button onClick={() => signIn('github')} leftIcon={<FiGithub />} variant="subtle">
              Sign in with Github
            </Button>
            <Button isDisabled leftIcon={<FcGoogle />} variant="subtle">
              Sign in with Google
            </Button>
          </Stack>
        )}
      </Center>
    </MainLayout>
  )
}

export default LoginPage
