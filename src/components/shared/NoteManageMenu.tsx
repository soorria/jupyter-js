import {
  AlertDialog,
  AlertDialogBody,
  AlertDialogCloseButton,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogOverlay,
  Box,
  Button,
  HStack,
  IconButton,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Portal,
  useColorModeValue,
} from '@chakra-ui/react'
import axios from 'axios'
import { useRef, useState } from 'react'
import { FiMoreHorizontal, FiTrash2 } from 'react-icons/fi'

interface NoteManageMenuProps {
  noteId: string
  onDelete?: () => void
}

const NoteManageMenu: React.FC<NoteManageMenuProps> = ({ noteId, onDelete }) => {
  const [showMenu, setShowMenu] = useState(false)
  const [showAlert, setShowAlert] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)

  const alertCancelRef: any = useRef<HTMLButtonElement>()

  const deleteRed = useColorModeValue('red.600', 'red.200')

  const openAlert = () => setShowAlert(true)
  const closeAlert = () => !isDeleting && setShowAlert(false)

  const handleMenuDeleteClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault()
    openAlert()
  }

  const handleDelete = async () => {
    setIsDeleting(true)
    try {
      await axios.delete(`/api/notes/${noteId}`)
      onDelete && onDelete()
    } catch (err) {
      console.dir(err)
      // TODO handle delete note error
    } finally {
      setIsDeleting(false)
    }
  }

  return (
    <>
      <Box>
        <Menu
          isLazy
          placement="bottom-end"
          isOpen={showMenu}
          onOpen={() => {
            setShowMenu(true)
          }}
          onClose={() => setShowMenu(false)}
        >
          <MenuButton
            as={IconButton}
            icon={<FiMoreHorizontal />}
            onClick={event => {
              event.preventDefault()
              setShowMenu(true)
            }}
          />

          <Portal>
            <MenuList>
              <MenuItem icon={<FiTrash2 />} color={deleteRed} onClick={handleMenuDeleteClick}>
                Delete Notebook
              </MenuItem>
            </MenuList>
          </Portal>
        </Menu>
      </Box>

      <AlertDialog
        isOpen={showAlert}
        isCentered
        leastDestructiveRef={alertCancelRef}
        onClose={closeAlert}
      >
        <AlertDialogOverlay />
        <AlertDialogContent>
          <AlertDialogHeader>Are you sure?</AlertDialogHeader>
          <AlertDialogCloseButton isDisabled={isDeleting} />
          <AlertDialogBody>
            Are you sure you want to delete this notebook? This cannot be undone.
          </AlertDialogBody>
          <AlertDialogFooter as={HStack} spacing={4}>
            <Button isDisabled={isDeleting} ref={alertCancelRef} onClick={closeAlert}>
              Cancel
            </Button>
            <Button isLoading={isDeleting} colorScheme="red" variant="solid" onClick={handleDelete}>
              Delete
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}

export default NoteManageMenu
