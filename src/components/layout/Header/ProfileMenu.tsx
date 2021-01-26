import {
  Avatar,
  Button,
  HStack,
  Menu,
  MenuButton,
  MenuDivider,
  MenuGroup,
  MenuItem,
  MenuList,
  Text,
} from '@chakra-ui/react'
import { Session, signout } from 'next-auth/client'
import Link from 'next/link'
import { FiChevronDown, FiLogOut } from 'react-icons/fi'

interface ProfileMenuProps {
  user: Session['user']
}

const ProfileMenu: React.FC<ProfileMenuProps> = ({ user }) => {
  return (
    <Menu placement="bottom-end">
      <MenuButton as={Button} rightIcon={<FiChevronDown />} alignItems="center">
        <HStack display="inline-flex">
          <Avatar
            size="xs"
            name={user.name || 'No Name'}
            src={user.image ?? undefined}
            bgGradient="linear(45deg, pink.500, purple.500)"
          />
          {user.username && (
            <Text as="span" ml={2}>
              {user.username}
            </Text>
          )}
        </HStack>
      </MenuButton>

      <MenuList>
        <MenuGroup title="Profile">
          <Link href="/profile" passHref>
            <MenuItem as="a">Your Profile</MenuItem>
          </Link>
          <Link href="/profile/settings" passHref>
            <MenuItem as="a">Settings</MenuItem>
          </Link>
        </MenuGroup>
        <MenuDivider />
        <MenuItem icon={<FiLogOut />} onClick={() => signout()}>
          Sign out
        </MenuItem>
      </MenuList>
    </Menu>
  )
}

export default ProfileMenu
