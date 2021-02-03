import { __is_client__ } from '#src/constants'
import { useDebounce, useMounted } from '#src/hooks'
import { bundle } from '#src/lib/bundler'
import { Button, Flex, Icon } from '@chakra-ui/react'
import type { Editor } from 'codemirror'
import { format } from 'prettier'
import parser from 'prettier/parser-babel'
import { useEffect, useRef, useState } from 'react'
import { FiCode } from 'react-icons/fi'
import Resizable from '../shared/Resizable'
import CellShell from './CellShell'
import CodeEditor from './CodeEditor'
import Preview from './Preview'

interface CodeCellProps {
  initialValue: string
  onChange: (value: string) => any
  onDelete?: () => any
  onMove?: (direction: 'UP' | 'DOWN') => any
}

const CodeCell: React.FC<CodeCellProps> = ({ initialValue, onChange, onMove, onDelete }) => {
  const [input, setInput] = useState(initialValue)
  const [code, setCode] = useState('')
  const [, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [formatting, setFormatting] = useState(false)
  const mounted = useMounted()

  const editor = useRef<Editor>()

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

  const formatInput = () => {
    setFormatting(true)
    try {
      const formatted = format(input, {
        semi: true,
        singleQuote: true,
        useTabs: false,
        parser: 'babel',
        plugins: [parser],
      })

      setInput(formatted)
      editor.current?.setValue(formatted)
    } catch (err) {
    } finally {
      setFormatting(false)
    }
  }

  useEffect(() => {
    if (input) {
      onChange && onChange(input)
      bundleInput()
    }
  }, [input])

  const handleChange = (nextValue: string) => {
    setInput(nextValue)
  }

  return (
    <>
      <CellShell
        title={
          <>
            <Icon as={FiCode} mr={2} /> Code Cell
          </>
        }
        toolbarButtons={
          <>
            <Button onClick={formatInput} isLoading={formatting}>
              Format
            </Button>
          </>
        }
        onDelete={onDelete}
        onMove={onMove}
      >
        <Resizable
          minWidth="100px"
          minHeight="25vh"
          maxHeight="90vh"
          left={
            <Flex direction="column" h="100%">
              {mounted ? (
                <CodeEditor
                  mode="jsx"
                  initialValue={input}
                  onChange={handleChange}
                  onEditorDidMount={editorInstance => (editor.current = editorInstance)}
                />
              ) : null}
            </Flex>
          }
          right={
            <Preview loading={loading} code={code} gridRow="1 / 3" gridColumn="2" height="100%" />
          }
        />
      </CellShell>
    </>
  )
}

export default CodeCell
