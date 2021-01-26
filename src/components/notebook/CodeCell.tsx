import { __is_client__ } from '#src/constants'
import { useDebounce, useMounted } from '#src/hooks'
import { bundle } from '#src/lib/bundler'
import { Box, Flex } from '@chakra-ui/react'
// import { format } from 'prettier'
// import parser from 'prettier/parser-babel'
import { useEffect, useState } from 'react'
import Resizable from '../shared/Resizable'
import CodeEditor from './CodeEditor'
import Preview from './Preview'

interface CodeCellProps {}

const CodeCell: React.FC<CodeCellProps> = () => {
  const [input, setInput] = useState(
    `import message from 'nested-test-pkg'; import 'bulma/css/bulma.css'
document.querySelector('#root').innerHTML = '<h1>' + message + '</h1>'`.trim()
  )
  const [code, setCode] = useState('')
  const [, setError] = useState('')
  const [, setLoading] = useState(false)
  const mounted = useMounted()

  const bundleInput = useDebounce(async () => {
    try {
      let bundledCode: string
      setTimeout(() => {
        if (!bundledCode) {
          setLoading(true)
        }
      }, 500)
      const result = await bundle(input)
      bundledCode = result.code
      setCode(bundledCode)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }, 750)

  // const formatInput = () => {
  //   try {
  //     setInput(
  //       format(input, {
  //         semi: true,
  //         singleQuote: true,
  //         useTabs: false,
  //         parser: 'babel',
  //         plugins: [parser],
  //       })
  //     )
  //   } catch (err) {}
  // }

  useEffect(() => {
    if (input) bundleInput()
  }, [input])

  return (
    <Box p={4}>
      <Resizable
        minWidth="100px"
        minHeight="25vh"
        maxHeight="95vh"
        left={
          <Flex direction="column" h="100%">
            {mounted ? (
              <CodeEditor initialValue={input} onChange={value => setInput(value)} />
            ) : null}
          </Flex>
        }
        right={<Preview code={code} gridRow="1 / 3" gridColumn="2" height="100%" />}
      />
    </Box>
  )
}

export default CodeCell
