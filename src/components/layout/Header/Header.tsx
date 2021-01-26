import {
  Box,
  Button,
  ButtonGroup,
  HStack,
  IconButton,
  Spacer,
  useColorMode,
  useColorModeValue,
} from '@chakra-ui/react'
import Link from 'next/link'
import { signin, useSession } from 'next-auth/client'
import { FiGithub, FiMoon, FiPlus, FiSun } from 'react-icons/fi'
import Logo from '../../shared/Logo'
import { memo, useEffect, useState } from 'react'
import { Router } from 'next/dist/client/router'
import Loader from '../../shared/Loader'
import ProfileMenu from './ProfileMenu'

interface HeaderProps {}

const SPACING = 3

const Header: React.FC<HeaderProps> = memo(() => {
  const [session, sessionLoading] = useSession()
  const { colorMode, toggleColorMode } = useColorMode()
  const [routeLoading, setRouteLoading] = useState(false)
  const bg = useColorModeValue('gray.100', 'gray.900')

  useEffect(() => {
    const handleLoading = () => setRouteLoading(true)
    const handleNotLoading = () => setRouteLoading(false)

    Router.events.on('routeChangeStart', handleLoading)
    Router.events.on('routeChangeComplete', handleNotLoading)
    Router.events.on('routeChangeError', handleNotLoading)

    return () => {
      Router.events.off('routeChangeStart', handleLoading)
      Router.events.off('routeChangeComplete', handleNotLoading)
      Router.events.off('routeChangeError', handleNotLoading)
    }
  }, [])

  const [short, setShort] = useState(false)
  useEffect(() => {
    const interval = setInterval(() => {
      setShort(s => !s)
    }, 3000)

    return () => {
      clearInterval(interval)
    }
  }, [])

  return (
    <HStack p={6} spacing={SPACING} bg={bg}>
      <Link href="/" passHref>
        <Logo short={short} />
      </Link>
      <Spacer />
      {routeLoading && <Loader size="sm" />}
      <ButtonGroup
        as="nav"
        variant="ghost"
        colorScheme="purple"
        spacing={SPACING}
        alignItems="center"
      >
        <Link href="/app/dashboard" passHref>
          <Button as="a">Dashboard</Button>
        </Link>
        <Link href="/app/note/new" passHref>
          <Button leftIcon={<FiPlus />} as="a">
            New Note
          </Button>
        </Link>
        <IconButton
          aria-label="toggle dark mode"
          icon={colorMode === 'light' ? <FiMoon /> : <FiSun />}
          onClick={toggleColorMode}
        >
          Toggle Dark Mode
        </IconButton>
        {session ? (
          <Box>
            <ProfileMenu user={session.user} />
          </Box>
        ) : (
          <Button
            onClick={() => signin('github')}
            leftIcon={<FiGithub />}
            isLoading={sessionLoading}
          >
            Sign In
          </Button>
        )}
      </ButtonGroup>
    </HStack>
  )
})

export default Header
