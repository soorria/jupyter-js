/* eslint-disable react/display-name */
/* eslint-disable react-hooks/rules-of-hooks */
import { __is_client__ } from '#src/constants'
import capitalise from '#src/utils/capitalise'
import {
  Box,
  Button,
  Checkbox,
  Code,
  Divider,
  Heading,
  HeadingProps,
  HStack,
  Image,
  Link,
  ListItem,
  OrderedList,
  Spacer,
  Table,
  Tbody,
  Td,
  Text,
  Th,
  Thead,
  Tr,
  UnorderedList,
  useClipboard,
  useColorModeValue,
  useToken,
} from '@chakra-ui/react'
import styled from '@emotion/styled'
import ReactMarkdown from 'react-markdown'
import gfm from 'remark-gfm'
import { PrismLight as SyntaxHighlighter } from 'react-syntax-highlighter'

interface MarkdownRendererProps {
  markdown: string
}

let dracula: any
if (__is_client__) {
  /* eslint-disable @typescript-eslint/no-var-requires */
  dracula = require('react-syntax-highlighter/dist/cjs/styles/prism/dracula').default
  const jsx = require('react-syntax-highlighter/dist/cjs/languages/prism/jsx').default
  const json = require('react-syntax-highlighter/dist/cjs/languages/prism/json').default
  const markdown = require('react-syntax-highlighter/dist/cjs/languages/prism/markdown').default
  const javascript = require('react-syntax-highlighter/dist/cjs/languages/prism/javascript').default
  SyntaxHighlighter.registerLanguage('jsx', jsx)
  SyntaxHighlighter.registerLanguage('json', json)
  SyntaxHighlighter.registerLanguage('markdown', markdown)
  SyntaxHighlighter.registerLanguage('javascript', javascript)
  /* eslint-enable @typescript-eslint/no-var-requires */
}

const Root = styled.div`
  line-height: 1.75rem;

  ul ul,
  ul ol,
  ol ul,
  ol ol,
  li p {
    margin-top: 0.75rem !important;
    margin-bottom: 0.75rem !important;
  }

  > ul > li > *:first-of-type:not(.task-checkbox),
  > ol > li > *:first-of-type:not(.task-checkbox) {
    margin-top: 1.25rem;
  }

  > ul > li > *:last-child,
  > ol > li > *:last-child {
    margin-bottom: 1.25rem;
  }

  [data-code] + [data-code] {
    margin-top: 1.5rem;
  }
`

const usePurple = () => useColorModeValue('purple.700', 'purple.300')

const HEADING_LEVEL_TO_PROPS = {
  1: {
    size: '2xl',
    mb: '2rem',
    lineHeight: '1',
    sx: {
      '&:not(:first-of-type)': {
        mt: '2.5rem',
      },
    },
  },
  2: {
    size: 'xl',
    mt: '2rem',
    mb: '1.5rem',
    lineHeight: '2rem',
  },
  3: {
    size: 'lg',
    mt: '1.5rem',
    mb: '0.75rem',
    lineHeight: '2rem',
  },
  4: {
    size: 'md',
    mt: '1.25rem',
    mb: '0.5rem',
    lineHeight: '1.5rem',
  },
  5: {
    size: 'sm',
  },
  6: {
    size: 'xs',
  },
} as Record<number, HeadingProps>

const LIST_PROPS = {
  ml: 0,
  my: 5,
}

const ALLOWED_CODE_BLOCK_LANGUAGES = ['javascript', 'jsx', 'markdown', 'json']

const LinkRenderer: React.FC<any> = props => (
  <Link href={props.href} isExternal color={usePurple()}>
    {props.children}
  </Link>
)

const ImageRenderer: React.FC<any> = props => (
  <Image src={props.src} alt={props.alt} w="100%" my={8} />
)

const Break: React.FC<any> = () => (
  <Divider borderBottomWidth="2px" borderColor={usePurple()} my={8} />
)

const renderers: Record<string, React.ComponentType<any>> = {
  thematicBreak: Break,
  paragraph: props => <Text {...props} my={4} />,
  heading: props => (
    <Heading as={`h${props.level}` as any} {...HEADING_LEVEL_TO_PROPS[props.level]}>
      {props.children}
    </Heading>
  ),
  link: LinkRenderer,
  image: ImageRenderer,
  linkReference: LinkRenderer,
  imageReference: ImageRenderer,
  blockquote: props => (
    <Box
      as="blockquote"
      borderLeft="2px"
      borderLeftColor={usePurple()}
      fontStyle="italic"
      pl={6}
      my={6}
    >
      {props.children}
    </Box>
  ),
  table: props => <Table>{props.children}</Table>,
  tableHead: props => <Thead>{props.children}</Thead>,
  tableBody: props => <Tbody>{props.children}</Tbody>,
  tableRow: props => <Tr>{props.children}</Tr>,
  tableCell: props => {
    if (props.isHeader) return <Th textAlign={props.align ?? 'left'}>{props.children}</Th>
    return <Td textAlign={props.align ?? 'left'}>{props.children}</Td>
  },
  root: Root,
  list: props => {
    if (props.ordered) {
      return <OrderedList {...LIST_PROPS}>{props.children}</OrderedList>
    }
    return <UnorderedList {...LIST_PROPS}>{props.children}</UnorderedList>
  },
  listItem: props => {
    const dotColor = usePurple()
    const isTask = props.checked !== null
    const beforeStyles = props.ordered
      ? {
          content: 'counter(list-item, decimal) "."',
        }
      : !isTask
      ? { content: '""', bg: dotColor, top: 3, width: '6px', height: '6px', rounded: 'full' }
      : {}

    return (
      <ListItem
        _before={{
          position: 'absolute',
          left: 0,
          ...beforeStyles,
        }}
        position="relative"
        pl={8}
        listStyleType="none"
      >
        {isTask && (
          <Box className="task-checkbox" position="absolute" left={0} top="0.375rem">
            <Checkbox isChecked={props.checked} isReadOnly />
          </Box>
        )}
        {props.children}
      </ListItem>
    )
  },
  inlineCode: props => (
    <Code
      lineHeight={6}
      _before={{ content: '"`"' }}
      _after={{ content: '"`"' }}
      colorScheme="purple"
    >
      {props.children}
    </Code>
  ),
  code: props => {
    const language = props.language.toLowerCase()

    const purpleToken = usePurple()
    const purpleColor = useToken('colors', purpleToken)
    const highlighterWrapperStyles = dracula['pre[class*="language-"]']

    const { hasCopied, onCopy } = useClipboard(props.value, 10000)

    return (
      <Box
        bg={highlighterWrapperStyles.background}
        position="relative"
        p={4}
        pt={12}
        borderRadius={highlighterWrapperStyles.borderRadius}
        // border={`1px solid ${purpleColor}`}
        boxShadow={`0 0 0 1px ${purpleColor}`}
        // _focusWithin={`0 0 0 2px ${purpleColor}`}
        data-code
      >
        <code>
          {!props.value || !ALLOWED_CODE_BLOCK_LANGUAGES.includes(language) ? (
            <Box as="pre">{props.value}</Box>
          ) : (
            <SyntaxHighlighter language={language} style={dracula} customStyle={{ padding: 0 }}>
              {props.value}
            </SyntaxHighlighter>
          )}
        </code>
        <HStack position="absolute" top={4} left={4} right={4} spacing={2}>
          <Text>{capitalise(props.language)}</Text>
          {props.value ? null : (
            <Text fontSize="sm" fontStyle="italic" opacity={0.7}>
              (empty)
            </Text>
          )}
          <Spacer />
          <Button
            h="1.5rem"
            size="sm"
            colorScheme="purple"
            variant="subtle"
            onClick={onCopy}
            w="4rem"
          >
            {hasCopied ? 'Copied' : 'Copy'}
          </Button>
        </HStack>
      </Box>
    )
  },
} as Record<string, React.ComponentType<any>>

const plugins = [gfm]
const MarkdownRenderer: React.FC<MarkdownRendererProps> = ({ markdown }) => {
  return (
    <ReactMarkdown
      linkTarget={() => '_blank'}
      source={markdown}
      plugins={plugins}
      renderers={renderers}
    />
  )
}

export default MarkdownRenderer
