import Link from 'next/link'
import { CELL_LIMITS, NOTE_LIMITS } from '#src/config'
import fetcher from '#src/lib/fetcher'
import { UserRole } from '#src/types/User'
import {
  Box,
  Button,
  HStack,
  keyframes,
  Spacer,
  Stack,
  Text,
  Link as ChakraLink,
  useColorModeValue,
} from '@chakra-ui/react'
import useSWR from 'swr'
interface UsageTabProps {}

const expand = keyframes`
  0% {
    transform: scaleX(0);
  }

  100% {
    transform: scaleX(100%);
  }
`

const Usage: React.FC<any> = ({ label, used, quota, isLoading }) => {
  const usagePercent = Math.max(Math.round(Math.min(used / quota, 1) * 100), 1)
  const clipPath = `polygon(0% 0%, 0% 100%, ${usagePercent}% 100%, ${usagePercent}% 0%)`
  const bg = useColorModeValue('gray.200', 'gray.600')

  const quotaDisplay = quota >= Number.MAX_SAFE_INTEGER ? '∞' : quota

  const quotaReachedColor = useColorModeValue('red.500', 'red.300')
  const quotaReached = !isLoading && used >= quota

  return (
    <HStack position="relative" p={4} pb={6}>
      <Text fontSize="lg">{label}</Text>
      <Spacer />
      <Text>
        {isLoading ? (
          <Text as="span">Loading...</Text>
        ) : (
          <>
            <Text
              as="span"
              fontSize="lg"
              color={quotaReached ? quotaReachedColor : 'inherit'}
              fontWeight="bold"
            >
              {used}
            </Text>{' '}
            <Text as="span" fontSize="sm">
              / {quotaDisplay}
            </Text>
          </>
        )}
      </Text>
      <Box position="absolute" left={0} bottom={0} right={0} height={2} bg={bg} borderRadius="full">
        {isLoading ? null : (
          <Box
            h="full"
            bgGradient="linear(45deg, pink.500, purple.500, cyan.400, blue.400)"
            clipPath={clipPath}
            borderRadius="full"
            transformOrigin="left"
            transition="clip-path 200ms ease-in-out"
            animation={`${expand} 1s ease-in-out forwards`}
          />
        )}
      </Box>
    </HStack>
  )
}

const UsageTab: React.FC<UsageTabProps> = () => {
  const { data } = useSWR<{
    usage: { notes: number; cells: number }
    role: UserRole
  }>('/api/usage', url => fetcher(url))

  return (
    <Box>
      <Stack direction="column" spacing={8}>
        <Usage
          label="Notes"
          used={data ? data.usage.notes : 0}
          quota={data ? NOTE_LIMITS[data.role] : -1}
          isLoading={!data}
        />
        <Usage
          label="Cells"
          used={data ? data.usage.cells : 0}
          quota={data ? CELL_LIMITS[data.role] : -1}
          isLoading={!data}
        />
      </Stack>
      <HStack spacing={4} mt={16} justify="center">
        <Text>Need more space?</Text>
        {data?.role === 'basic' ? (
          <Link href="/app/dashboard/billing" passHref>
            <Button as="a" variant="gradientBorder">
              Upgrade
            </Button>
          </Link>
        ) : (
          <Button as={ChakraLink} variant="gradientBorder" href="https://soorria.com/#contact">
            Contact Me
          </Button>
        )}
      </HStack>
    </Box>
  )
}

export default UsageTab
