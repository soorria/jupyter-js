import { mode, transparentize } from '@chakra-ui/theme-tools'
import { extendTheme, keyframes, theme as defaultTheme, Theme } from '@chakra-ui/react'
import { __dev__, __is_client__ } from './constants'

interface StyleOptions {
  theme: Theme
  colorMode: 'light' | 'dark'
  colorScheme: string
  [k: string]: any
}

const { purple } = defaultTheme.colors

const bgGradientHover = keyframes`
  from {
    background-position: left;
  }
  to {
    background-position: right;
  }
`

const theme = extendTheme({
  shadows: {
    outline: `0 0 0 3px ${purple[500]}99`,
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
        gradientBorder: (props: StyleOptions) => {
          const { colorScheme: c } = props

          const afterBg = mode(`${c}.50`, `${c}.800`)(props)

          const activeStyle = {
            color: mode(`${c}.50`, `${c}.900`)(props),
            _after: {
              opacity: 0,
            },
          }

          return {
            bg: 'transparent',
            color: mode(`${c}.700`, `${c}.200`)(props),
            position: 'relative',
            zIndex: 0,
            _before: {
              content: '""',
              position: 'absolute',
              bgGradient:
                'linear(45deg, pink.400, purple.400, cyan.300, blue.300, pink.400, purple.400)',
              animation: `${bgGradientHover} 2000ms linear infinite`,
              animationPlayState: 'paused',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundSize: '600%',
              rounded: 'md',
              zIndex: -1,
              transition: 'all 200ms ease-in-out',
            },
            _hover: {
              _before: {
                animationPlayState: 'running',
              },
            },
            _active: activeStyle,
            _focus: {
              _before: {
                animationPlayState: 'running',
              },
            },
            _after: {
              content: '""',
              position: 'absolute',
              top: 'var(--bg-inset, 2px)',
              left: 'var(--bg-inset, 2px)',
              right: 'var(--bg-inset, 2px)',
              bottom: 'var(--bg-inset, 2px)',
              bg: afterBg,
              rounded: 'md',
              zIndex: -1,
              transition: 'all 200ms ease-in-out',
              opacity: 0.7,
            },
          }
        },
      },
      defaultProps: {
        variant: 'ghost',
        colorScheme: 'purple',
      },
      sizes: {
        xl: {
          h: 14,
          minW: 14,
          fontSize: 'xl',
          px: 8,
        },
        '2xl': {
          h: 16,
          minW: 16,
          fontSize: '2xl',
          px: 10,
          '--bg-inset': '4px',
        },
      },
    },
    Textarea: {
      baseStyle: {
        transition: `${defaultTheme.components.Textarea.baseStyle.transition}, height 0s`,
      },
    },
    Popover: {
      baseStyle: {
        popper: {
          width: 'auto',
        },
      },
    },
  },
  fonts: {
    heading: `'Poppins', ${defaultTheme.fonts.heading}`,
    body: `'Open Sans', ${defaultTheme.fonts.body}`,
  },
  styles: {
    global: (props: StyleOptions) => {
      const scrollTrack = mode(purple[50], purple[900])(props)
      const scrollThumb = purple[400]

      return {
        'html, body, #__next': {
          height: '100%',
          bg: mode('gray.50', 'gray.800')(props),
          overflowX: 'hidden',
          scrollBehavior: 'smooth',
        },
        '::selection': {
          bg: mode('purple.100', 'purple.800')(props),
          color: mode('purple.900', 'purple.50')(props),
        },
        // Chrome
        '*::-webkit-scrollbar': {
          base: {},
          md: {
            width: 2,
            height: 2,
          },
        },
        '*::-webkit-scrollbar-track': {
          base: {},
          md: {
            bg: scrollTrack,
          },
        },
        '.no-track::-webkit-scrollbar-track': {
          base: {},
          md: {
            bg: 'transparent',
          },
        },
        '*::-webkit-scrollbar-thumb': {
          base: {},
          md: {
            bg: 'purple.400',
            rounded: 'full',
          },
        },
        // Firefox
        '*': {
          scrollbarWidth: 'thin',
          scrollbarColor: `${scrollThumb} ${scrollTrack}`,
        },
        '.no-track': {
          scrollbarColor: `${scrollThumb} transparent`,
        },
      }
    },
  },
  config: {
    useSystemColorMode: false,
    initialColorMode: 'dark',
  },
})

if (__dev__ && __is_client__) console.log(theme)

export default theme
