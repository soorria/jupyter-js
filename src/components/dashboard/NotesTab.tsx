import fetcher from '#src/lib/fetcher'
import INote from '#src/types/Note'
import { Box, Center, Flex, Stack, Text, useColorModeValue } from '@chakra-ui/react'
import Link from 'next/link'
import useSWR from 'swr'
import Loader from '../shared/Loader'

interface NotesTabProps {}

const bg = [
  { main: 'blackAlpha.50', hover: 'blackAlpha.100' },
  { main: 'whiteAlpha.50', hover: 'whiteAlpha.100' },
]

const NotesTab: React.FC<NotesTabProps> = () => {
  const { data: notes, error } = useSWR<INote[]>('/api/notes', url =>
    fetcher(url).then(res => res.notes)
  )

  const loading = !notes && !error

  const noteItemBg = useColorModeValue(bg[0], bg[1])

  return (
    <Stack spacing={4}>
      {notes?.map(note => (
        <Link href={`/app/note/${note._id}`} key={note._id} passHref>
          <Flex
            as="a"
            cursor="pointer"
            align="center"
            px={8}
            py={6}
            rounded="md"
            bg={noteItemBg.main}
            _hover={{ bg: noteItemBg.hover, boxShadow: 'lg' }}
            transition="all 200ms"
          >
            <Text flex="1 1" fontSize="lg">
              {note.title}
            </Text>
            <Box>{note.order.length} cells</Box>
          </Flex>
        </Link>
      ))}
      {notes && notes.length ? (
        <Center h="20vh">
          <Text>{notes.length} notebooks total</Text>
        </Center>
      ) : null}
      {loading && (
        <Center h="20vh">
          <Loader size="lg" />
        </Center>
      )}
    </Stack>
  )
}

export default NotesTab
