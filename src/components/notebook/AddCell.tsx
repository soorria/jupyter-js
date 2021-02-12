import ICell, { CellType, VALID_CELL_TYPES } from '#src/types/Cell'
import { Box, Button, Flex, Grid, Icon, IconButton, useColorModeValue } from '@chakra-ui/react'
import { mutate } from 'swr'
import axios, { AxiosError } from 'axios'
import { useState } from 'react'
import { FiCode, FiFileText } from 'react-icons/fi'
import { FaDiceD6 } from 'react-icons/fa'
import INote from '#src/types/Note'
import useStyledToast from '#src/hooks/use-styled-toast'

interface AddCellProps {
  noteId: string
  prevCellId: string | null
  expanded?: boolean
}

const randomType = () => [...VALID_CELL_TYPES][Math.floor(Math.random() * VALID_CELL_TYPES.size)]

const AddCell: React.FC<AddCellProps> = ({ prevCellId, noteId, expanded = false }) => {
  const [hovered, setHovered] = useState(false)
  const [loading, setLoading] = useState(false)
  const toast = useStyledToast()

  const handleClick = (type: CellType) => async () => {
    setLoading(true)
    try {
      const {
        data: { cell: newCell },
      }: { data: { cell: ICell } } = await axios.post(`/api/notes/${noteId}/cell`, {
        type,
        prevCellId,
      })
      mutate(`/api/notes/${noteId}`, (data: INote) => {
        if (data.cells) {
          data.cells[newCell._id] = newCell
          if (prevCellId) {
            data.order.splice(data.order.findIndex(id => id === prevCellId) + 1, 0, newCell._id)
          } else {
            data.order.unshift(newCell._id)
          }
        }
        return { ...data }
      })
      // await trigger(`/api/notes/${noteId}`, true)
    } catch (err) {
      if (err.isAxiosError) {
        const error = err as AxiosError
        if (error.response?.status === 403) {
          toast({
            title: 'Plan limit reached',
            description: "You've reached your plan's quota. Upgrade to create a new cell.",
            status: 'error',
          })
        }
      }
      // TODO Handle create cell errors
    } finally {
      setLoading(false)
      setTimeout(() => setHovered(false), 200)
    }
  }

  const bg = useColorModeValue('purple.500', 'purple.200')

  const showButtons = hovered || expanded || loading

  const buttonCommonProps = {
    isLoading: loading,
    variant: 'solid',
    _loading: { bg, opacity: 1, _hover: { opacity: 1 } },
  }

  return (
    <Box
      postion="relative"
      mx={20}
      my={10}
      h={1}
      bg={bg}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      opacity={showButtons ? 1 : 0.3}
      transition="all 150ms"
      cursor="pointer"
    >
      <Flex
        position="absolute"
        mt="2px"
        left={0}
        right={0}
        align="center"
        justify="center"
        transform={`translateY(-50%) scaleY(${showButtons ? 1 : 0})`}
        transition="all 150ms"
      >
        <Grid
          variant="solid"
          display="grid"
          templateColumns="1fr auto 1fr"
          gap={8}
          alignItems="center"
        >
          <Button {...buttonCommonProps} onClick={handleClick('javascript')} leftIcon={<FiCode />}>
            New Code Cell
          </Button>
          <IconButton
            {...buttonCommonProps}
            aria-label="create random cell"
            rounded="full"
            bg={bg}
            icon={<FaDiceD6 />}
            onClick={() => handleClick(randomType())()}
            size="sm"
            title="random cell"
          >
            <Icon as={FaDiceD6} />
          </IconButton>
          <Button
            {...buttonCommonProps}
            onClick={handleClick('markdown')}
            leftIcon={<FiFileText />}
          >
            New Markdown Cell
          </Button>
        </Grid>
      </Flex>
    </Box>
  )
}

export default AddCell
