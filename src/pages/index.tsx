import MainLayout from '#src/components/layout/MainLayout'
import { Box } from '@chakra-ui/react'
import { useSession } from 'next-auth/client'

const IndexPage: React.FC = () => {
  const [session, loading] = useSession()

  return (
    <MainLayout>
      <Box p={4}>
        <Box as="pre">{JSON.stringify({ session, loading }, null, 2)}</Box>
      </Box>
    </MainLayout>
  )
}

export default IndexPage
