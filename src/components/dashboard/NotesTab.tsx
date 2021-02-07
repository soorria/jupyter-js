import fetcher from '#src/lib/fetcher'
import INote from '#src/types/Note'
import {
  Box,
  Button,
  Center,
  Divider,
  Flex,
  Grid,
  HStack,
  Icon,
  InputGroup,
  InputLeftElement,
  InputRightElement,
  Menu,
  MenuButton,
  MenuItemOption,
  MenuList,
  MenuOptionGroup,
  Stack,
  Text,
  useColorModeValue,
} from '@chakra-ui/react'
import Link from 'next/link'
import { FiClock, FiEdit, FiPlus, FiSearch } from 'react-icons/fi'
import { FaSort } from 'react-icons/fa'
import useSWR from 'swr'
import Loader from '../shared/Loader'
import NoteManageMenu from '../shared/NoteManageMenu'
import StyledInput from '../shared/StyledInput'
import { useMemo, useState } from 'react'
import { format } from 'date-fns'
import SortDirectionIcon from '../shared/SortDirectionIcon'

interface NotesTabProps {}

const bg = [
  { main: 'gray.100', hover: 'gray.200' },
  { main: 'whiteAlpha.50', hover: 'whiteAlpha.100' },
]

const cmpFns: Record<string, (a: INote, b: INote) => number> = {
  Name: (a, b) =>
    a.title.localeCompare(b.title, ['en'], { ignorePunctuation: true, sensitivity: 'base' }),
  Size: (a, b) => a.order.length - b.order.length,
  'Created At': (a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime(),
  'Updated At': (a, b) => new Date(a.updatedAt).getTime() - new Date(b.updatedAt).getTime(),
}

const NotesTab: React.FC<NotesTabProps> = () => {
  const noteItemBg = useColorModeValue(bg[0], bg[1])

  const { data, error, mutate } = useSWR<INote[]>('/api/notes', url =>
    fetcher(url).then(res => res.notes)
  )
  const loading = !data && !error

  const [search, setSearch] = useState('')
  const [sortKey, setSortKey] = useState('')
  const [sortAsc, setSortAsc] = useState(true)

  const notes = useMemo(() => {
    if (!data) return data
    if (!search && !sortKey) return data

    let result = data

    if (search) {
      result = result.filter(note => note.title.toLowerCase().includes(search.trim().toLowerCase()))
    }

    if (sortKey) {
      const mult = sortAsc ? 1 : -1
      result = result.sort((a, b) => mult * cmpFns[sortKey](a, b))
    }

    return result
  }, [search, sortKey, sortAsc, data])

  const hoverShadow = useColorModeValue('lg', 'dark-lg')

  const handleDeleteNote = (noteId: string) => () => {
    mutate(data => data?.filter(note => note._id !== noteId))
  }

  return (
    <Stack spacing={6}>
      {data ? (
        <>
          <Grid gap={{ base: 2, md: 4 }} templateColumns={{ base: '1fr', sm: '1fr auto' }}>
            <InputGroup>
              <InputLeftElement pointerEvents="none">
                <FiSearch />
              </InputLeftElement>
              <StyledInput
                pl={10}
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder="Search Notes"
                variant="filled"
              />
              <InputRightElement width="4.5rem">
                <Button h="1.75rem" size="sm" onClick={() => setSearch('')} isDisabled={!search}>
                  Clear
                </Button>
              </InputRightElement>
            </InputGroup>

            <Box>
              <Menu closeOnSelect={false} placement="bottom-end">
                <MenuButton
                  as={Button}
                  variant="subtle"
                  rightIcon={<FaSort />}
                  w={{ base: 'full', md: '10rem' }}
                  leftIcon={!sortKey ? null : <SortDirectionIcon isAscending={sortAsc} />}
                >
                  {sortKey ? sortKey : 'Sort Notes'}
                </MenuButton>

                <MenuList>
                  <MenuOptionGroup
                    value={sortKey}
                    onChange={value => setSortKey(value as string)}
                    title="Sort By"
                    type="radio"
                  >
                    <MenuItemOption value="">None</MenuItemOption>
                    <MenuItemOption value="Name">Name</MenuItemOption>
                    <MenuItemOption value="Size">Size</MenuItemOption>
                    <MenuItemOption value="Created At">Created At</MenuItemOption>
                    <MenuItemOption value="Updated At">Updated At</MenuItemOption>
                  </MenuOptionGroup>
                  <MenuOptionGroup
                    value={sortAsc ? 'asc' : 'desc'}
                    onChange={value => setSortAsc(value === 'asc')}
                    title="Sort Direction"
                    type="radio"
                  >
                    <MenuItemOption isDisabled={sortKey === ''} value="asc">
                      Ascending
                    </MenuItemOption>
                    <MenuItemOption isDisabled={sortKey === ''} value="desc">
                      Descending
                    </MenuItemOption>
                  </MenuOptionGroup>
                </MenuList>
              </Menu>
            </Box>
          </Grid>
          <Divider />
        </>
      ) : null}

      {notes?.map(note => (
        <Link href={`/app/note/${note._id}`} key={note._id} passHref>
          <HStack
            as="a"
            cursor="pointer"
            px={8}
            py={6}
            rounded="md"
            bg={noteItemBg.main}
            _hover={{ bg: noteItemBg.hover, boxShadow: hoverShadow }}
            transition="all 200ms"
            spacing={6}
          >
            <Box flex="1 1">
              <Text fontize="xl" fontWeight="bold" mb={{ base: 2, md: 4 }}>
                {note.title}
              </Text>
              <Stack direction={{ base: 'column', sm: 'row' }} fontSize={{ base: 'xs', md: 'sm' }}>
                <Flex align="center">
                  <Icon as={FiClock} mr={2} />
                  <Text>{format(new Date(note.createdAt), 'hh:mm dd/MM/yyyy')}</Text>
                </Flex>
                <Flex align="center">
                  <Icon as={FiEdit} mr={2} />
                  <Text>{format(new Date(note.updatedAt), 'hh:mm dd/MM/yyyy')}</Text>
                </Flex>
              </Stack>
            </Box>
            <Box textAlign="right">
              <Text>{note.order.length} cells</Text>
            </Box>
            <NoteManageMenu noteId={note._id} onDelete={handleDeleteNote(note._id)} />
          </HStack>
        </Link>
      ))}

      {data ? (
        <Center h="20vh">
          <Text>
            {notes!.length} notebook{notes!.length === 1 ? '' : 's'}{' '}
            {search ? `matching ${JSON.stringify(search)}` : 'total'}
          </Text>
        </Center>
      ) : null}

      {data?.length === 0 ? (
        <Center h="30vh">
          <Link href="/app/note/new" passHref>
            <Button as="a" leftIcon={<FiPlus />} variant="solid">
              Create your first notebook
            </Button>
          </Link>
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
