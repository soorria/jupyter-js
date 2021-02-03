import { Box } from '@chakra-ui/react'
import styled from '@emotion/styled'
import { UnControlled as CodeMirror } from 'react-codemirror2'
import type { Editor } from 'codemirror'
import { __is_client__ } from '#src/constants'
import { useEffect, useState } from 'react'

if (__is_client__) {
  require('codemirror/lib/codemirror.css')
  require('codemirror/theme/dracula.css')
  require('codemirror/mode/xml/xml')
  require('codemirror/mode/javascript/javascript')
  require('codemirror/mode/jsx/jsx')
  require('codemirror/mode/markdown/markdown')
  require('codemirror/addon/scroll/simplescrollbars')
  require('codemirror/addon/scroll/simplescrollbars.css')
}

interface CodeEditorProps {
  initialValue?: string
  onChange: (value: string) => void
  onEditorDidMount?: (editor: Editor) => void
  mode: 'jsx' | 'markdown'
}

const CodeMirrorWrapper = styled(CodeMirror)`
  height: 100%;

  .CodeMirror {
    height: 100%;
    font-size: 1.25rem;
  }

  .CodeMirror-overlayscroll-horizontal div {
    bottom: 2px;
  }

  .CodeMirror-overlayscroll-vertical div {
    right: 2px;
  }

  .CodeMirror-overlayscroll-horizontal div,
  .CodeMirror-overlayscroll-vertical div {
    background: ${(props: any) => {
      return props.theme.colors.purple[400]
    }};
    opacity: 0.8;
  }
`

const CodeEditor: React.FC<CodeEditorProps> = ({
  initialValue = 'console.log("hello world")',
  onChange,
  onEditorDidMount,
  mode,
}) => {
  const [initVal, setInitVal] = useState<string | undefined>()

  useEffect(() => {
    if (typeof initVal === 'undefined') {
      setInitVal(initialValue)
    }
  }, [initVal, initialValue])

  return (
    <Box h="100%" zIndex={1}>
      <CodeMirrorWrapper
        value={initVal}
        onChange={(_editor, _data, value: string) => onChange(value)}
        editorDidMount={onEditorDidMount}
        options={{
          theme: 'dracula',
          lineNumbers: mode === 'jsx',
          mode,
          tabSize: 2,
          lineWrapping: true,
          scrollbarStyle: 'overlay',
        }}
      />
    </Box>
  )
}

export default CodeEditor
