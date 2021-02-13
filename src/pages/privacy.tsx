import MainLayout from '#src/components/layout/MainLayout'
import MarkdownRenderer from '#src/components/shared/MarkdownRenderer'
import { GetStaticProps } from 'next'
import path from 'path'
import { promises as fs } from 'fs'
import { Box } from '@chakra-ui/react'

interface PrivacyProps {
  markdown: string
}

const Privacy: React.FC<PrivacyProps> = ({ markdown }) => {
  return (
    <MainLayout>
      <Box maxW="65ch" mx="auto" my="10vh">
        <MarkdownRenderer markdown={markdown} />
      </Box>
    </MainLayout>
  )
}

export default Privacy

export const getStaticProps: GetStaticProps<PrivacyProps> = async () => {
  const filePath = path.join(process.cwd(), './data/privacy.md')
  const data = await fs.readFile(filePath)
  const markdown = data.toString()
  return { props: { markdown } }
}
