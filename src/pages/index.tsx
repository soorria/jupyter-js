import { Box, Button } from '@chakra-ui/react'
import { signin, useSession } from 'next-auth/client'
import { FiGithub } from 'react-icons/fi'

const IndexPage: React.FC = () => {
  const [session] = useSession()

  return (
    <Box>
      <Button onClick={() => signin('github')} leftIcon={<FiGithub />}>
        Sign in with Github
      </Button>
      <Box as="pre">{JSON.stringify(session, null, 2)}</Box>
    </Box>
  )
}

export default IndexPage
