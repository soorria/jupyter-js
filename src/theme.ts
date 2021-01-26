import { mode, transparentize } from '@chakra-ui/theme-tools'
import { extendTheme, theme as defaultTheme, Theme } from '@chakra-ui/react'
import { __dev__, __is_client__ } from './constants'

interface StyleOptions {
  theme: Theme
  colorMode: 'light' | 'dark'
  colorScheme: string
  [k: string]: any
}

const theme = extendTheme({
  shadows: {
    outline: `0 0 0 3px ${defaultTheme.colors.purple[500]}99`,
  },
  components: {
    Button: {
      variants: {
        subtle: (props: StyleOptions) => {
          const { colorScheme: c, theme } = props

          const darkBg = transparentize(`${c}.200`, 0.12)(theme)
          const darkHoverBg = transparentize(`${c}.200`, 0.24)(theme)
          const darkActiveBg = transparentize(`${c}.200`, 0.36)(theme)

          return {
            bg: mode(`${c}.50`, darkBg)(props),
            color: mode(`${c}.700`, `${c}.200`)(props),
            _hover: {
              _disabled: {
                bg: mode(`${c}.50`, darkBg)(props),
              },
              bg: mode(`${c}.100`, darkHoverBg)(props),
            },
            _active: {
              bg: mode(`${c}.200`, darkActiveBg)(props),
            },
          }
        },
      },
      defaultProps: {
        variant: 'ghost',
        colorScheme: 'purple',
      },
    },
    Textarea: {
      baseStyle: {
        transition: `${defaultTheme.components.Textarea.baseStyle.transition}, height 0s`,
      },
    },
  },
  fonts: {
    heading: `'Poppins', ${defaultTheme.fonts.heading}`,
    body: `'Open Sans', ${defaultTheme.fonts.body}`,
  },
  styles: {
    global: (props: StyleOptions) => ({
      'html, body, #__next': {
        height: '100%',
        bg: mode('gray.50', 'gray.800')(props),
      },
    }),
  },
  config: {
    initialColorMode: 'dark',
  },
})

if (__dev__ && __is_client__) console.log(theme)

export default theme
