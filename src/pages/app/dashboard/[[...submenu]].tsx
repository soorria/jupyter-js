import NotesTab from '#src/components/dashboard/NotesTab'
import ProfileTab from '#src/components/dashboard/ProfileTab'
import SettingsTab from '#src/components/dashboard/SettingsTab'
import UsageTab from '#src/components/dashboard/UsageTab'
import MainLayout from '#src/components/layout/MainLayout'
import MotionBox from '#src/components/shared/MotionBox'
import {
  Box,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
  Text,
  useBreakpointValue,
  useColorModeValue,
  useToken,
} from '@chakra-ui/react'
import { AnimateSharedLayout } from 'framer-motion'
import { GetServerSideProps } from 'next'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'

interface NotesProps {
  initialIndex: number
}

const URL_TO_TAB_INDEX: Record<string, number> = {
  usage: 1,
  profile: 2,
  settings: 3,
}

const useSelectedTabColor = () => useColorModeValue('purple.600', 'purple.300')

const TabIndicator: React.FC<{ tabFor: string; selectedTab: string }> = ({
  tabFor,
  selectedTab,
}) => {
  const bg = useSelectedTabColor()
  return tabFor === selectedTab ? (
    <MotionBox
      layout
      layoutId="tab-indicator"
      transition={{ duration: 0.2 }}
      position="absolute"
      bottom={0}
      left={0}
      right={0}
      bg={bg}
      h="2px"
    />
  ) : null
}

const Notes: React.FC<NotesProps> = ({ initialIndex }) => {
  const router = useRouter()
  const { submenu = [] } = router.query
  const [selected = ''] = submenu
  const [index, setIndex] = useState(initialIndex || 0)
  const selectedColor = useSelectedTabColor()

  const tabProps = {
    position: 'relative',
    _selected: { borderColor: 'inherit', color: selectedColor },
    border: 'none',
  } as const

  useEffect(() => {
    setIndex(URL_TO_TAB_INDEX[selected] || 0)
  }, [selected])

  const setTab = (tabname: string) =>
    router.push('/app/dashboard', `/app/dashboard/${tabname}`, { shallow: true })

  const gray = useToken('colors', 'gray.800')
  const tabListBg = useColorModeValue('whiteAlpha.600', `${gray}7A`)

  const tabsSize = useBreakpointValue({ base: 'sm', sm: 'md' })

  return (
    <MainLayout>
      <Box maxW="60rem" mx="auto" my={{ base: 0, md: 4 }}>
        <Tabs
          position="relative"
          overflow="revert"
          colorScheme="purple"
          index={index}
          isFitted
          variant="line"
          size={tabsSize}
          isLazy
        >
          <AnimateSharedLayout>
            <TabList h="auto" bg={tabListBg} pt={4}>
              <Tab {...tabProps} onClick={() => setTab('')}>
                <Text as="span" display={{ base: 'none', sm: 'inline' }}>
                  Your&nbsp;
                </Text>
                Notes
                <TabIndicator tabFor="" selectedTab={selected} />
              </Tab>
              <Tab {...tabProps} onClick={() => setTab('usage')}>
                Usage
                <TabIndicator tabFor="usage" selectedTab={selected} />
              </Tab>
              <Tab {...tabProps} onClick={() => setTab('profile')}>
                Profile
                <TabIndicator tabFor="profile" selectedTab={selected} />
              </Tab>
              <Tab {...tabProps} onClick={() => setTab('settings')}>
                Settings
                <TabIndicator tabFor="settings" selectedTab={selected} />
              </Tab>
            </TabList>
          </AnimateSharedLayout>
          <TabPanels mt={4}>
            <TabPanel>
              <NotesTab />
            </TabPanel>
            <TabPanel>
              <UsageTab />
            </TabPanel>
            <TabPanel>
              <ProfileTab />
            </TabPanel>
            <TabPanel>
              <SettingsTab />
            </TabPanel>
          </TabPanels>
        </Tabs>
      </Box>
    </MainLayout>
  )
}

export default Notes

export const getServerSideProps: GetServerSideProps<Partial<NotesProps>> = async context => {
  const submenu = context.params?.submenu?.[0]
  const selectedIndex = URL_TO_TAB_INDEX[context.params!.submenu?.[0]] ?? 0

  if (!submenu || (submenu && selectedIndex)) {
    return {
      props: {
        initialIndex: selectedIndex,
      },
    }
  }

  return {
    redirect: {
      destination: '/app/dashboard',
      permanent: false,
    },
  }
}
