import {
  As,
  Box,
  Code,
  Flex,
  Grid,
  Heading,
  Icon,
  Stack,
  Link as ChakraLink,
} from '@chakra-ui/react'
import { ReactNode } from 'react'
import { FaCss3Alt, FaMarkdown, FaReact } from 'react-icons/fa'
import { FiBox, FiClock, FiCode, FiGitBranch, FiSave } from 'react-icons/fi'

interface FeaturesListProps {}

interface IFeature {
  title: ReactNode
  description: ReactNode
  icon?: As
}

const FEATURES: readonly IFeature[] = [
  {
    title: 'NPM Packages',
    description: (
      <>
        Use any package from npm with a simple <Code>import</Code>
        {''}. Any package you import is fetched from unpkg and cached in your browser.
      </>
    ),
    icon: FiBox,
  },
  {
    title: 'Fast builds',
    description: 'Bundles are created in your browser using WebAssembly for speedy builds.',
    icon: FiClock,
  },
  {
    title: 'Auto-Saving',
    description: 'Your code is automatically saved to our databases whenever you make a change.',
    icon: FiSave,
  },
  {
    title: 'GFM Markdown',
    description:
      'Our markdown editor supports Github-flavored markdown, so you can use tables, strike-throughs and tasklists',
    icon: FaMarkdown,
  },
  {
    title: 'React',
    description:
      'Supports React (with JSX!) out of the box, so you can build your next big app in our editor (not that you should).',
    icon: FaReact,
  },
  {
    title: 'CSS',
    description: "Import css files to style your amazing UIs (CSS modules don't work though ☹).",
    icon: FaCss3Alt,
  },
  {
    title: <Code>show()</Code>,
    description: (
      <>
        Our magical <Code>show</Code> function lets you render just about anything to the screen.
      </>
    ),
    icon: FiCode,
  },
  {
    title: 'Open Source',
    description: (
      <>
        100% pure-bred, A5, open source code, so you can help make this app better, or host your
        own! See the source{' '}
        <ChakraLink color="purple.500" isExternal href="https://github.com/mo0th/jupyter-js">
          here
        </ChakraLink>
        .
      </>
    ),
    icon: FiGitBranch,
  },
]

const FeaturesList: React.FC<FeaturesListProps> = () => {
  return (
    <Box px={4} maxW="40rem" mx="auto" mb="10vh">
      <Heading as="h2" mb={8}>
        Features
      </Heading>
      <Grid templateColumns="repeat(auto-fit, 17rem)" justifyContent="space-around" gap={8}>
        {FEATURES.map(({ icon, title, description }, i) => (
          <Stack key={i} spacing={2} rounded="xl" border="1px" borderColor="gray.500" p={4}>
            <Flex align="center" fontSize="lg" fontWeight="bold">
              {icon ? <Icon mr={2} as={icon} /> : null}
              <span>{title}</span>
            </Flex>
            <Box as="p">{description}</Box>
          </Stack>
        ))}
      </Grid>
    </Box>
  )
}

export default FeaturesList
