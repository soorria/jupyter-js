import NotesTab from '#src/components/dashboard/NotesTab'
import ProfileTab from '#src/components/dashboard/ProfileTab'
import SettingsTab from '#src/components/dashboard/SettingsTab'
import UsageTab from '#src/components/dashboard/UsageTab'
import MainLayout from '#src/components/layout/MainLayout'
import {
  Box,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
  useColorModeValue,
  useToken,
} from '@chakra-ui/react'
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

const Notes: React.FC<NotesProps> = ({ initialIndex }) => {
  const router = useRouter()
  const { submenu = [] } = router.query
  const [selected = ''] = submenu
  const [index, setIndex] = useState(initialIndex || 0)

  useEffect(() => {
    setIndex(URL_TO_TAB_INDEX[selected] || 0)
  }, [selected])

  const setTab = (tabname: string) =>
    router.push('/app/dashboard', `/app/dashboard/${tabname}`, { shallow: true })

  const gray = useToken('colors', 'gray.800')
  const tabListBg = useColorModeValue('whiteAlpha.600', `${gray}7A`)

  return (
    <MainLayout>
      <Box maxW="60rem" mx="auto">
        <Tabs
          position="relative"
          overflow="revert"
          colorScheme="purple"
          index={index}
          isFitted
          variant="line"
        >
          <TabList
            position="sticky"
            top={0}
            h="auto"
            bg={tabListBg}
            style={{ backdropFilter: 'blur(5px)' }}
            pt={4}
          >
            <Tab onClick={() => setTab('')}>Your Notes</Tab>
            <Tab onClick={() => setTab('usage')}>Usage</Tab>
            <Tab onClick={() => setTab('profile')}>Profile</Tab>
            <Tab onClick={() => setTab('settings')}>Settings</Tab>
          </TabList>
          <TabPanels>
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
  return {
    props: {
      initialIndex: URL_TO_TAB_INDEX[context.params!.submenu?.[0]] || 0,
    },
  }
}
