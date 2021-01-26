import MainLayout from '#src/components/layout/MainLayout'
import { __is_client__ } from '#src/constants'
import {
  Box,
  Button,
  Center,
  Editable,
  EditableInput,
  EditablePreview,
  Heading,
  HStack,
  IconButton,
  Text,
  useToken,
} from '@chakra-ui/react'
import { useState } from 'react'
// import Resizable from '#src/components/shared/Resizable'
// import CodeCell from '#src/components/notebook/CodeCell'
import { useMounted } from '#src/hooks'
import Loader from '#src/components/shared/Loader'
import useSWR from 'swr'
import { useRouter } from 'next/router'
import INote from '#src/types/Note'
import fetcher from '#src/lib/fetcher'
import { FiEdit2, FiSave, FiX } from 'react-icons/fi'
import axios from 'axios'

interface NotePageProps {}

const NotePage: React.FC<NotePageProps> = () => {
  const router = useRouter()
  const id = router.query.id as string
  const headingSize = useToken('components.Heading.sizes', 'xl')
  const [disableTitleUpdate, setDisableTitleUpdate] = useState(false)

  const { data: note, error, isValidating, revalidate, mutate } = useSWR<INote>(
    id ? `/api/notes/${id}` : null,
    url => fetcher(url).then(res => res.note),
    { errorRetryCount: 0 }
  )

  const mounted = useMounted()
  const loading = !note && !error

  const handleTitleSubmit = async (title: string) => {
    try {
      await axios.patch(`/api/notes/${id}`, { title })

      mutate(data => ({ ...data!, title }))
    } catch (err) {
      console.log(err)
    }
  }

  return (
    <MainLayout>
      {mounted && !loading ? (
        note ? (
          <Box mb="30vh" mt={4} position="relative">
            <HStack p={4} align="center">
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
                      <EditablePreview as={Heading} {...headingSize} />
                      <EditableInput w="100%" m={0} fontFamily="heading" {...headingSize} />
                    </Box>
                    {props.isEditing ? (
                      <>
                        <IconButton
                          isDisabled={disableTitleUpdate}
                          aria-label="edit note title"
                          icon={<FiSave />}
                          onClick={props.onSubmit}
                        />
                        <IconButton
                          aria-label="edit note title"
                          icon={<FiX />}
                          onClick={props.onCancel}
                        />
                      </>
                    ) : (
                      <IconButton
                        aria-label="edit note title"
                        icon={<FiEdit2 />}
                        onClick={props.onEdit}
                      />
                    )}
                  </HStack>
                )}
              </Editable>
            </HStack>
            <Button onClick={() => revalidate()}>Retry</Button>
            <Box as="pre" overflow="auto" overflowWrap="anywhere">
              {JSON.stringify({ note, error, isValidating }, null, 2)}
            </Box>
          </Box>
        ) : (
          <Text>An error occurred</Text>
        )
      ) : (
        <Center h="full">
          <Loader size="xl" />
        </Center>
      )}
    </MainLayout>
  )
}

export default NotePage
