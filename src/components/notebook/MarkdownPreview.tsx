import { Box, Center } from '@chakra-ui/react'
import MarkdownRenderer from '../shared/MarkdownRenderer'

interface MarkdownPreviewProps {
  markdown: string
  editing?: boolean
}

const MarkdownPreview: React.FC<MarkdownPreviewProps> = ({ markdown, editing }) => {
  return (
    <Box maxW="800px" mx="auto" p={4}>
      {markdown || editing ? (
        <MarkdownRenderer markdown={markdown} />
      ) : (
        <Center h="10vh">Double Click to edit this cell</Center>
      )}
    </Box>
  )
}

export default MarkdownPreview
