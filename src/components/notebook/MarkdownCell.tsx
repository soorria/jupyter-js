import useClickAway from '#src/hooks/use-click-away'
import { Box, Icon, IconButton, SimpleGrid, Tooltip } from '@chakra-ui/react'
import { useEffect, useRef, useState } from 'react'
import { FiEdit2, FiFileText, FiSave } from 'react-icons/fi'
import CellShell from './CellShell'
import CodeEditor from './CodeEditor'
import MarkdownPreview from './MarkdownPreview'

interface MarkdownCellProps {
  initialValue: string
  onChange: (value: string) => any
  onDelete?: () => any
  onMove?: (direction: 'UP' | 'DOWN') => any
}

const MarkdownCell: React.FC<MarkdownCellProps> = ({
  onChange,
  onDelete,
  onMove,
  initialValue,
}) => {
  const [input, setInput] = useState(initialValue)
  const wrapperRef = useRef<HTMLDivElement>(null)
  const [editing, setEditing] = useState(false)
  const [hasBeenOpened, setHasBeenOpened] = useState(false)

  useEffect(() => {
    console.log({ editing, hasBeenOpened })
  }, [editing, hasBeenOpened])

  useEffect(() => {
    onChange(input)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [input])

  useClickAway(wrapperRef, () => {
    setEditing(false)
  })

  const handleChange = (value: string) => {
    setInput(value)
  }

  const handleStartEditing = () => {
    setEditing(true)
    setHasBeenOpened(true)
  }

  return (
    <CellShell
      title={
        <>
          <Icon as={FiFileText} mr={2} /> Markdown Cell
        </>
      }
      toolbarButtons={
        <>
          {editing ? (
            <Tooltip label="Save this cell">
              <IconButton icon={<FiSave />} aria-label="Save this cell" />
            </Tooltip>
          ) : null}
          <Tooltip label="Edit this cell">
            <IconButton
              icon={<FiEdit2 />}
              isDisabled={editing}
              onClick={handleStartEditing}
              aria-label="Edit this cell"
            />
          </Tooltip>
        </>
      }
      onDelete={onDelete}
      onMove={onMove}
    >
      <SimpleGrid w="100%" onClick={handleStartEditing} ref={wrapperRef} columns={2} gap={2}>
        {hasBeenOpened ? (
          <Box display={editing ? 'block' : 'none'}>
            <CodeEditor mode="markdown" initialValue={initialValue} onChange={handleChange} />
          </Box>
        ) : null}
        <Box gridColumnStart={editing ? 2 : 1} gridColumnEnd={-1}>
          <MarkdownPreview markdown={input} />
        </Box>
      </SimpleGrid>
    </CellShell>
  )
}

export default MarkdownCell
