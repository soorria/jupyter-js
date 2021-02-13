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
}

const helperCode = `
import { createElement as __esbuild_createElement, Fragment as __esbuild_Fragment } from 'react'
import { render as __esbuild_render } from 'react-dom'

let __react_render_count__ = 0

const show = (...args) => {
  const root = document.querySelector('#root')

  const _show = (arg) => {
    console.dir(arg)

    if (typeof arg === 'object') {
      if (arg.$$typeof && arg.props) {
        const reactRoot = document.createElement('div')
        reactRoot.id = 'react-root-' + (++__react_render_count__)
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
`

const CodeCell: React.FC<CodeCellProps> = ({ initialValue, onChange, onMove, onDelete }) => {
  const [input, setInput] = useState(initialValue)
  const [code, setCode] = useState('')
  const [, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [formatting, setFormatting] = useState(false)
  const mounted = useMounted()
  const [showModal, setShowModal] = useState(false)

  const editor = useRef<Editor>()

  const bundleInput = useDebounce(async () => {
    try {
      // eslint-disable-next-line prefer-const
      let bundledCode: string
      setTimeout(() => {
        if (!bundledCode) {
          setLoading(true)
        }
      }, 500)
      const result = await bundle(helperCode + input)
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
        toolbarButtons={
          <>
            <Button onClick={formatInput} isLoading={formatting}>
              Format
            </Button>
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
