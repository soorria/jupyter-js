import { useDebounce, useMounted } from '#src/hooks'
import { bundle } from '#src/lib/bundler'
import {
  Button,
  Flex,
  Icon,
  IconButton,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  Tooltip,
} from '@chakra-ui/react'
import type { Editor } from 'codemirror'
import { format } from 'prettier'
import parser from 'prettier/parser-babel'
import { useEffect, useRef, useState } from 'react'
import { FiBox, FiCode } from 'react-icons/fi'
import Resizable from '../shared/Resizable'
import CellShell from './CellShell'
import CodeEditor from './CodeEditor'
import Preview from './Preview'

interface CodeCellProps {
  initialValue: string
  onChange: (value: string) => any
  onDelete?: () => any
  onMove?: (direction: 'UP' | 'DOWN') => any
  cellId: string
  startHeight?: number
}

const helperCode = `
import { createElement as __esbuild_createElement, Fragment as __esbuild_Fragment } from 'react'
import { render as __esbuild_render } from 'react-dom'

let __el_count__ = 0

const show = (...args) => {
  const root = document.querySelector('#root')

  const _show = (arg) => {
    console.dir(arg)

    if (typeof arg === 'object') {
      if (arg.$$typeof && arg.props) {
        const reactRoot = document.createElement('div')
        reactRoot.id = 'jupyter-el-' + (++__el_count__)
        root.appendChild(reactRoot)
        __esbuild_render(arg, reactRoot)
      } else if (Array.isArray(arg)) {
        arg.forEach(el => _show(el))
      } else {
        root.innerHTML += '\\n' + JSON.stringify(arg)
      }
    } else {
      root.innerHTML += '\\n' + arg
    }
  }

  args.forEach(arg => _show(arg))
}

const css = (literals, ...args) => {
  if (typeof literals === 'string') {
    literals = [literals]
  }

  let styleText = literals[0]

  args.forEach((arg, i) => {
    styleText += arg.toString() + literals[i + 1]
  })

  const styleElement = document.createElement('style')
  styleElement.innerText = styleText
  styleElement.id = 'jupyter-el-' + (++__el_count__)

  const add = () => document.head.appendChild(styleElement)
  const remove = () => document.head.removeChild(styleElement)

  add()

  return {add, remove}
}

window.jjs = { show, css }
`

const formatMs = (ms: number) => {
  return Math.round(ms).toString()
}

const CodeCell: React.FC<CodeCellProps> = ({
  initialValue,
  onChange,
  onMove,
  onDelete,
  startHeight,
}) => {
  const [input, setInput] = useState(initialValue)
  const [code, setCode] = useState('')
  const [time, setTime] = useState<number | null>(null)
  const [, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [formatting, setFormatting] = useState(false)
  const mounted = useMounted()
  const [showModal, setShowModal] = useState(false)

  const editor = useRef<Editor>()

  const bundleInput = useDebounce(async () => {
    try {
      setLoading(true)
      const result = await bundle(helperCode + input)
      setTime(result.time ?? null)
      setCode(curr => {
        if (curr === result.code) {
          setLoading(false)
        }
        return result.code
      })
    } catch (err: any) {
      setError(err.message)
    }
  }, 750)

  const formatInput = () => {
    setFormatting(true)
    try {
      const formatted = format(input, {
        semi: false,
        singleQuote: true,
        useTabs: false,
        parser: 'babel',
        plugins: [parser],
      })

      setInput(formatted)
      editor.current?.setValue(formatted)
    } catch (err) {
      console.log('format err', err)
    } finally {
      setFormatting(false)
    }
  }

  useEffect(() => {
    if (input) {
      onChange && onChange(input)
      bundleInput()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
        info={time !== null ? <span>Done in {formatMs(time)}ms</span> : null}
        toolbarButtons={
          <>
            <Tooltip label="Format with prettier">
              <Button onClick={formatInput} isLoading={formatting}>
                Format
              </Button>
            </Tooltip>
            <Tooltip label="View bundle">
              <IconButton
                aria-label="show bundle"
                icon={<FiBox />}
                onClick={() => setShowModal(true)}
              />
            </Tooltip>
          </>
        }
        onDelete={onDelete}
        onMove={onMove}
      >
        <Resizable
          minWidth="100px"
          minHeight="25vh"
          maxHeight="90vh"
          startHeight={startHeight}
          left={
            <Flex direction="column" h="100%">
              {mounted ? (
                <CodeEditor
                  mode="jsx"
                  initialValue={input}
                  onChange={handleChange}
                  onEditorDidMount={editorInstance => {
                    editor.current = editorInstance
                  }}
                />
              ) : null}
            </Flex>
          }
          right={
            <Preview loading={loading} onDone={() => setLoading(false)} code={code} height="100%" />
          }
        />
      </CellShell>

      <Modal
        scrollBehavior="inside"
        size="6xl"
        isOpen={showModal}
        onClose={() => setShowModal(false)}
      >
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Bundled Code</ModalHeader>
          <ModalCloseButton />
          <ModalBody as="code" overflowX="auto">
            <pre>{code}</pre>
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  )
}

export default CodeCell
