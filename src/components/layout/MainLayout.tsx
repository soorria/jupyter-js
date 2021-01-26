import { Box, Flex } from '@chakra-ui/react'
import Footer from './Footer'
import Header from './Header'

interface MainLayoutProps {}

const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
  return (
    <Flex direction="column" h="100%" style={{ scrollBehavior: 'smooth' }}>
      <Box minH={1} bgGradient="linear(45deg, pink.400, purple.400, cyan.300, blue.300)" />
      <Header />
      <Box as="main" flex="1">
        {children}
      </Box>
      <Footer />
    </Flex>
  )
}

export default MainLayout
