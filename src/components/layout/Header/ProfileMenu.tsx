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
} from '@chakra-ui/react'
import { Session, signout } from 'next-auth/client'
import Link from 'next/link'
import { FiActivity, FiChevronDown, FiLogOut, FiSettings, FiUser } from 'react-icons/fi'

interface ProfileMenuProps {
  user: Session['user']
}

const ProfileMenu: React.FC<ProfileMenuProps> = ({ user }) => {
  return (
    <Menu placement="bottom-end">
      <MenuButton
        as={Button}
        rightIcon={<FiChevronDown />}
        alignItems="center"
        isFullWidth
        variant="subtle"
      >
        <HStack>
          <Avatar
            size="xs"
            name={user.name || 'No Name'}
            src={user.image ?? undefined}
            bgGradient="linear(45deg, pink.500, purple.500)"
          />
        </HStack>
      </MenuButton>

      <MenuList zIndex="popover">
        <MenuGroup title="Profile">
          <Link href="/app/dashboard/profile" passHref>
            <MenuItem as="a" icon={<FiUser />}>
              Your Profile
            </MenuItem>
          </Link>
          <Link href="/app/dashboard/usage" passHref>
            <MenuItem as="a" icon={<FiActivity />}>
              Usage
            </MenuItem>
          </Link>
          <Link href="/app/dashboard/settings" passHref>
            <MenuItem as="a" icon={<FiSettings />}>
              Settings
            </MenuItem>
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
