import { extendTheme } from '@chakra-ui/react'

const theme = extendTheme({
  styles: {
    global: {
      'html, body, #__next': {
        height: '100%',
      },
    },
  },
  config: {
    useSystemColorMode: false,
    initialColorMode: 'dark',
  },
})

export default theme
