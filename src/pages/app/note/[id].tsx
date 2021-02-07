import {
  Box,
  Center,
  Editable,
  EditableInput,
  EditablePreview,
  Heading,
  HStack,
  Icon,
  IconButton,
  Spacer,
  Text,
  Tooltip,
  useToken,
} from '@chakra-ui/react'
import axios from 'axios'
import { useRouter } from 'next/router'
import { Fragment, useRef, useState } from 'react'
import { FiCheckCircle, FiEdit2, FiSave, FiX } from 'react-icons/fi'
import useSWR from 'swr'

import MainLayout from '#src/components/layout/MainLayout'
import AddCell from '#src/components/notebook/AddCell'
import AddFirstCell from '#src/components/notebook/AddFirstCell'
import CodeCell from '#src/components/notebook/CodeCell'
import Loader, { useLoaderColor } from '#src/components/shared/Loader'
import NoteManageMenu from '#src/components/shared/NoteManageMenu'
import { useDebounce, useMounted } from '#src/hooks'
import fetcher from '#src/lib/fetcher'
import INote from '#src/types/Note'
import allSettled from '#src/utils/allSettled'
import MarkdownCell from '#src/components/notebook/MarkdownCell'

interface NotePageProps {}

const TOOLTIPS = {
  edit: 'Edit notebook title',
  save: 'Save notebook title',
  cancel: 'Cancel changes',
}

const NotePage: React.FC<NotePageProps> = () => {
  const router = useRouter()
  const id = router.query.id as string
  const headingSize = useToken('components.Heading.sizes', 'xl')
  const loaderColor = useLoaderColor()
  const [disableTitleUpdate, setDisableTitleUpdate] = useState(false)
  const updatedSet = useRef(new Set<string>())
  const [saving, setSaving] = useState(false)

  const { data: note, error, isValidating, revalidate, mutate } = useSWR<INote>(
    id ? `/api/notes/${id}` : null,
    url => fetcher(url).then(res => res.note),
    { errorRetryCount: 0, focusThrottleInterval: 10000 }
  )

  const mounted = useMounted()
  const loading = !note && !error

  const debouncedUpdate = useDebounce(async () => {
    setSaving(true)
    const toUpdate = Array.from(updatedSet.current)
    updatedSet.current.clear()

    await allSettled(
      toUpdate.map(cellId =>
        axios.patch(`/api/notes/${id}/cell/${cellId}`, {
          contents: note?.cells?.[cellId]?.contents ?? '',
        })
      )
    )

    setSaving(false)

    revalidate()
  }, 1000)

  const handleTitleSubmit = async (title: string) => {
    try {
      await axios.patch(`/api/notes/${id}`, { title })

      mutate(data => ({ ...data!, title }))
    } catch (err) {
      console.log(err)
    }
  }

  const handleCellUpdate = (cellId: string) => (value: string) => {
    mutate(data => {
      const cell = data!.cells![cellId]

      if (!cell) return

      data!.cells![cellId] = { ...cell, contents: value }

      updatedSet.current.add(cellId)

      return data
    }, false)
    debouncedUpdate()
  }

  const handleCellMove = (cellId: string) => async (direction: 'UP' | 'DOWN') => {
    try {
      if (!note) return

      const order = note.order

      const index = order.findIndex(id => id === cellId)
      const targetIndex = direction === 'UP' ? index - 1 : index + 1
      if (targetIndex < 0 || targetIndex >= order.length) return

      order[index] = order[targetIndex]
      order[targetIndex] = cellId

      await axios.patch(`/api/notes/${id}`, { order })

      mutate(data => data && { ...data, order })
    } catch (err) {
      console.dir(err)
    }

    debouncedUpdate()
  }

  const handleCellDelete = (cellId: string) => async () => {
    if (!note?.cells?.[cellId]) return

    try {
      await axios.delete(`/api/notes/${id}/cell/${cellId}`)
      mutate(data => data && { ...data, order: data.order.filter(id => id !== cellId) })
    } catch (err) {
      console.dir(err)
    }
  }

  return (
    <MainLayout>
      {mounted && !loading ? (
        note ? (
          <Box mb="30vh" mt={4} mx={{ base: 4, md: 8 }} position="relative">
            {/* Editable Cell Title */}
            <HStack py={4} align="center" spacing={4}>
              <Editable
                onSubmit={handleTitleSubmit}
                isPreviewFocusable={false}
                submitOnBlur={false}
                defaultValue={note.title}
                onChange={value => setDisableTitleUpdate(!value)}
              >
                {props => (
                  <HStack spacing={4}>
                    <Box flexShrink={1}>
                      <EditablePreview fontWeight="bold" as={Heading} {...headingSize} />
                      <EditableInput
                        fontWeight="bold"
                        w="100%"
                        m={0}
                        fontFamily="heading"
                        {...headingSize}
                      />
                    </Box>
                    {props.isEditing ? (
                      <>
                        <Tooltip label={TOOLTIPS.save}>
                          <IconButton
                            isDisabled={disableTitleUpdate}
                            aria-label={TOOLTIPS.save}
                            icon={<FiSave />}
                            onClick={props.onSubmit}
                          />
                        </Tooltip>
                        <Tooltip label={TOOLTIPS.cancel}>
                          <IconButton
                            aria-label={TOOLTIPS.cancel}
                            icon={<FiX />}
                            onClick={props.onCancel}
                          />
                        </Tooltip>
                      </>
                    ) : (
                      <Tooltip label={TOOLTIPS.edit}>
                        <IconButton
                          aria-label={TOOLTIPS.edit}
                          icon={<FiEdit2 />}
                          onClick={props.onEdit}
                        />
                      </Tooltip>
                    )}
                  </HStack>
                )}
              </Editable>
              <Spacer />
              <Text as="span" display="inline-flex" alignItems="center" color={loaderColor} mr={4}>
                {isValidating ?? saving ? (
                  <>
                    <Loader size="sm" mr={2} /> {saving ? 'Saving' : 'Syncing'}
                  </>
                ) : (
                  <>
                    <Icon as={FiCheckCircle} mr={2} /> Changes Saved
                  </>
                )}
              </Text>
              <NoteManageMenu noteId={note._id} onDelete={() => router.push('/app/dashboard')} />
            </HStack>

            {/* No Cells in note */}
            {note.order.length === 0 && <AddFirstCell noteId={note._id} />}

            {note.order.length >= 1 && (
              <Box>
                <AddCell noteId={note._id} prevCellId={null} />
                {note.order.map(cellId => {
                  const cell = note.cells![cellId]
                  return (
                    <Fragment key={cellId}>
                      {cell.type === 'javascript' ? (
                        <CodeCell
                          initialValue={cell.contents}
                          onChange={handleCellUpdate(cellId)}
                          onMove={handleCellMove(cellId)}
                          onDelete={handleCellDelete(cellId)}
                          cellId={cellId}
                        />
                      ) : (
                        <>
                          <MarkdownCell
                            initialValue={cell.contents}
                            onChange={handleCellUpdate(cellId)}
                            onMove={handleCellMove(cellId)}
                            onDelete={handleCellDelete(cellId)}
                            cellId={cellId}
                          />
                        </>
                      )}
                      <AddCell noteId={note._id} prevCellId={cellId} />
                    </Fragment>
                  )
                })}
              </Box>
            )}
            {/* <Button onClick={() => revalidate()}>Retry</Button>
            <Box as="pre" overflow="auto" overflowWrap="anywhere">
              {JSON.stringify({ note, error, isValidating }, null, 2)}
            </Box> */}
          </Box>
        ) : (
          <Text>An error occurred</Text>
        )
      ) : (
        <Center h="full" flexDirection="column">
          <Text fontSize="lg" mb={4}>
            Loading your notebook
          </Text>
          <Loader size="xl" />
        </Center>
      )}
    </MainLayout>
  )
}

export default NotePage
