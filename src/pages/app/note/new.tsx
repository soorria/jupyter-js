import MainLayout from '#src/components/layout/MainLayout'
import Loader from '#src/components/shared/Loader'
import INote from '#src/types/Note'
import { Box, Button, Center, Text } from '@chakra-ui/react'
import axios, { AxiosError } from 'axios'
import { GetServerSideProps } from 'next'
import { getSession } from 'next-auth/client'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'

interface newProps {}

const ERRORS = {
  QUOTA_EXCEEDED: 'Plan quota exceeded',
} as const

const NewNote: React.FC<newProps> = () => {
  const router = useRouter()
  const [error, setError] = useState('')

  useEffect(() => {
    const createNote = async () => {
      try {
        const response = await axios.post<{ note: INote }>('/api/notes')
        router.push(`/app/note/${response.data.note._id}`)
      } catch (err) {
        if (err.isAxiosError) {
          const error = err as AxiosError
          const status = error.response?.status

          if (status === 403) {
            setError(ERRORS.QUOTA_EXCEEDED)
          } else if (status === 401) {
            router.push(`/login`)
          }
        }
      }
    }

    createNote()
  }, [router])

  return (
    <MainLayout>
      <Center h="100%" flexDirection="column">
        {error ? (
          <Box rounded="xl" bg="gray.700" p={8} textAlign="center" fontSize="xl" maxW="30rem">
            <Text>You&apos;ve reached your plan&apos;s quota.</Text>
            <Text>Upgrade to create a new notebook.</Text>
            <Box mt={4}>
              <Link href="/app/dashboard/settings/plan" passHref>
                <Button as="a" variant="solid">
                  Go to your profile
                </Button>
              </Link>
            </Box>
          </Box>
        ) : (
          <>
            <Text fontSize="lg" mb={4}>
              Creating your new notebook
            </Text>
            <Loader size="xl" />
          </>
        )}
      </Center>
    </MainLayout>
  )
}

export default NewNote

export const getServerSideProps: GetServerSideProps = async context => {
  const session = await getSession(context)
  if (!session) return { redirect: { destination: '/login', permanent: false } }
  return {
    props: {},
  }
}
