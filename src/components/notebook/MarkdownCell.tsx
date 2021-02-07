import useClickAway from '#src/hooks/use-click-away'
import useLocalStorage from '#src/hooks/use-local-storage'
import { Box, Icon, IconButton, SimpleGrid, Tooltip } from '@chakra-ui/react'
import { useEffect, useRef, useState } from 'react'
import { FiEdit2, FiFileText, FiMaximize2, FiMinimize2, FiSave } from 'react-icons/fi'
import CellShell from './CellShell'
import CodeEditor from './CodeEditor'
import MarkdownPreview from './MarkdownPreview'

interface MarkdownCellProps {
  initialValue: string
  onChange: (value: string) => any
  onDelete?: () => any
  onMove?: (direction: 'UP' | 'DOWN') => any
  cellId: string
}

const MarkdownCell: React.FC<MarkdownCellProps> = ({
  onChange,
  onDelete,
  onMove,
  initialValue,
  cellId,
}) => {
  const [input, setInput] = useState(initialValue)
  const wrapperRef = useRef<HTMLDivElement>(null)
  const [editing, setEditing] = useState(false)
  const [hasBeenOpened, setHasBeenOpened] = useState(false)
  const [maximised, setMaximised] = useLocalStorage(cellId, false)

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

  const maxH = maximised ? 'none' : '50vh'

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
          <Tooltip label={(maximised ? 'Minimise' : 'Maximise') + ' this cell'}>
            <IconButton
              icon={maximised ? <FiMinimize2 /> : <FiMaximize2 />}
              isDisabled={editing}
              onClick={() => setMaximised(!maximised)}
              aria-label="Edit this cell"
            />
          </Tooltip>
        </>
      }
      onDelete={onDelete}
      onMove={onMove}
    >
      <SimpleGrid
        w="100%"
        onDoubleClick={handleStartEditing}
        ref={wrapperRef}
        columns={2}
        gap={4}
        minH="10vh"
      >
        {hasBeenOpened ? (
          <Box display={editing ? 'block' : 'none'} maxH={maxH} h="100%">
            <CodeEditor mode="markdown" initialValue={initialValue} onChange={handleChange} />
          </Box>
        ) : null}
        <Box gridColumnStart={editing ? 2 : 1} gridColumnEnd={-1} h="100%">
          <Box overflowY="auto" className="no-track" maxH={maxH}>
            <MarkdownPreview editing={editing} markdown={input} />
          </Box>
        </Box>
      </SimpleGrid>
    </CellShell>
  )
}

export default MarkdownCell
