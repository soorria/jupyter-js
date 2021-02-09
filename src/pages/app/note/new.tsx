import MainLayout from '#src/components/layout/MainLayout'
import Loader from '#src/components/shared/Loader'
import INote from '#src/types/Note'
import { Center, Text } from '@chakra-ui/react'
import axios from 'axios'
import { GetServerSideProps } from 'next'
import { getSession } from 'next-auth/client'
import { useRouter } from 'next/router'
import { useEffect } from 'react'

interface newProps {}

const NewNote: React.FC<newProps> = () => {
  const router = useRouter()

  useEffect(() => {
    const createNote = async () => {
      const response = await axios.post<{ note: INote }>('/api/notes')

      // console.log({ response })
      router.push(`/app/note/${response.data.note._id}`)
    }

    createNote()
  }, [router])

  return (
    <MainLayout>
      <Center h="100%" flexDirection="column">
        <Text fontSize="lg" mb={4}>
          Creating your new notebook
        </Text>
        <Loader size="xl" />
      </Center>
    </MainLayout>
  )
}

export default NewNote

export const getServerSideProps: GetServerSideProps = async context => {
  const session = await getSession(context)
  if (!session) return { redirect: { destination: '/', permanent: false } }
  return {
    props: {},
  }
}
