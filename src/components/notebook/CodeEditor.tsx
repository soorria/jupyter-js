import { Box, Flex } from '@chakra-ui/react'
import styled from '@emotion/styled'
import { UnControlled as CodeMirror } from 'react-codemirror2'
import { __is_client__ } from '#src/constants'

if (__is_client__) {
  require('codemirror/lib/codemirror.css')
  require('codemirror/theme/dracula.css')
  require('codemirror/mode/xml/xml')
  require('codemirror/mode/javascript/javascript')
  require('codemirror/mode/jsx/jsx')
  require('codemirror/keymap/vim')
}

interface CodeEditorProps {
  initialValue?: string
  onChange: (value: string) => void
}

const CodeMirrorWrapper = styled(CodeMirror)`
  height: 100%;

  .CodeMirror {
    height: 100%;
  }
`

const CodeEditor: React.FC<CodeEditorProps> = ({
  initialValue = 'console.log("hello world")',
  onChange,
}) => {
  return (
    <Flex direction="column" h="100%" position="relative">
      <Box></Box>
      <Box flex="1">
        <CodeMirrorWrapper
          value={initialValue}
          onChange={(_editor: any, _data: any, value: string) => onChange(value)}
          options={{
            theme: 'dracula',
            lineNumbers: true,
            mode: 'jsx',
            keyMap: 'vim',
            tabSize: 2,
            lineWrapping: true,
            scrollbarStyle: 'null',
          }}
        />
      </Box>
    </Flex>
  )
}

export default CodeEditor
