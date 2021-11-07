import {
  Box,
  Icon,
  Image,
  keyframes,
  Link,
  Spacer,
  Stack,
  StackDivider,
  Text,
  useColorModeValue,
  useToken,
} from '@chakra-ui/react'
import { memo, useEffect, useState } from 'react'
import { FiCode, FiGithub, FiHeart } from 'react-icons/fi'

const COLORS = [
  'red.500',
  'pink.500',
  'green.500',
  'cyan.500',
  'purple.500',
  'blue.500',
  'blackAlpha.500',
  'whiteAlpha.500',
  'gray.500',
  'orange.500',
  'yellow.500',
  'teal.500',
]

const cache: { color: string | null } = { color: null }

const heartPulse = keyframes`
  0% {
    transform: scale(1);
  }
  5% {
    transform: scale(1.2);
  }
  10% {
    transform: scale(1);
  }
  15% {
    transform: scale(1.3);
  }
  50% {
    transform: scale(1);
  }
  100% {
    transform: scale(1);
  }
`

const randomColor = (force = false) => {
  if (!cache.color || force) {
    cache.color = COLORS[Math.floor(Math.random() * COLORS.length)]
  }

  return cache.color
}

interface FooterProps {}

const Footer: React.FC<FooterProps> = memo(() => {
  const [heartColorToken, setHeartColorToken] = useState('transparent')
  const bg = useColorModeValue('gray.100', 'gray.900')

  const heartColor = useToken('colors', heartColorToken)

  useEffect(() => {
    setHeartColorToken(randomColor())
  }, [])

  const changeHeartColor = () => {
    setHeartColorToken(old => {
      let r
      while ((r = randomColor(true)) === old);
      return r
    })
  }

  return (
    <Box fontFamily="heading" align="center" bg={bg}>
      <Stack py={2} px={6} direction={{ base: 'column', md: 'row' }}>
        <Text userSelect="none">
          Made with{' '}
          <Icon
            transition="all 150ms ease-in-out"
            _hover={{
              filter: `drop-shadow(0 0 7px ${heartColor})`,
            }}
            animation={`${heartPulse} 2.5s infinite`}
            fill={heartColor}
            stroke={heartColor}
            as={FiHeart}
            cursor="pointer"
            onClick={changeHeartColor}
          />{' '}
          by{' '}
          <Link isExternal href="https://mooth.tech">
            Soorria Saruva
          </Link>
        </Text>
        <Spacer />
        <Stack
          direction={{ base: 'column', sm: 'row' }}
          spacing={{ base: 2, sm: 4 }}
          divider={<StackDivider />}
          justify="center"
        >
          <Link isExternal href="https://mooth.tech?ref=jjs.mooth.tech" role="group">
            <Image
              src="https://mooth.tech/logo.svg"
              w={4}
              h={4}
              display="inline-block"
              mr={2}
              transition="all 150ms ease-in-out"
              _groupHover={{ transform: 'rotate(180deg)' }}
            />
            mooth.tech
          </Link>
          <Link isExternal href="https://github.com/mo0th">
            <Icon mr={2} as={FiGithub} />
            mo0th
          </Link>
          <Link isExternal href="https://github.com/mo0th/jupyter-js">
            <Icon mr={2} as={FiCode} />
            Source Code
          </Link>
        </Stack>
      </Stack>
    </Box>
  )
})

Footer.displayName = 'Footer'

export default Footer
