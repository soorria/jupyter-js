import { CELL_LIMITS, NOTE_LIMITS } from '#src/config'
import { Box, Heading, SimpleGrid, Stack, Text, useColorModeValue } from '@chakra-ui/react'
import commaNumber from 'comma-number'

const FeaturesList: React.FC = () => {
  const sectionBg = useColorModeValue('purple.300', 'purple.800')
  const proBg = useColorModeValue('purple.200', 'purple.600')
  const proPriceColor = useColorModeValue('purple.800', 'purple.200')

  return (
    <Box as="section" bg={sectionBg} my={24}>
      <SimpleGrid columns={{ base: 1, md: 2 }} px={4} maxW="40rem" mx="auto">
        <Heading as="h2" py={12}>
          Pricing
        </Heading>

        <Stack p={4} bg={proBg} my={-8} rounded="md">
          <Box pb={4}>
            <Heading as="h3">Pro</Heading>
            <Text color={proPriceColor}>$10 / month</Text>
            <Text>{commaNumber(CELL_LIMITS.premium)} cells</Text>
            <Text>{commaNumber(NOTE_LIMITS.premium)} notes</Text>
          </Box>
          <Box borderTop="1px" borderTopColor="purple.400" pt={4}>
            <Heading as="h3" size="md">
              Free
            </Heading>
            <Text>
              {commaNumber(CELL_LIMITS.basic)} cells &amp; {commaNumber(NOTE_LIMITS.basic)} note
            </Text>
          </Box>
        </Stack>
      </SimpleGrid>
    </Box>
  )
}

export default FeaturesList
