import { Box, BoxProps, Center } from '@chakra-ui/react'
import { useEffect, useRef } from 'react'
import Loader from '../shared/Loader'

type PreviewProps = {
  code: string
  loading?: boolean
} & BoxProps

const BASE_HTML = `
  <!doctype html>
  <html>
    <head>
      <style>html { background-color: white }</style>
    </head>
    <body>
      <div id="root"></div>
      <script>
        var show = () => {};
        var handleError = (err) => {
          console.dir(document)
          console.dir(document.body)
          document.body.innerHTML = '<h1 style="color: red; font-family: sans-serif">Runtime Error: ' + err.message + '</h1>'
          document.body.innerHTML += '<pre style="color: red; font-family: sans-serif">Runtime Error: ' + err.stack + '</pre>'
          console.error(err)
        }

        window.addEventListener('message', (event) => {
          try {
            document.querySelector('#__script').innerText = event.data
            eval(event.data)
          } catch (err) {
            handleError(err)
          }
        }, false)

        window.addEventListener('error', (event) => {
          event.preventDefault()
          handleError(event.error)
        })
      </script>
    </body>
    <div hidden id="__script"></div>
  </html>
`.trim()

const Preview: React.FC<PreviewProps> = ({ code, loading = false, ...rest }) => {
  const iframeRef = useRef<HTMLIFrameElement>()

  useEffect(() => {
    if (iframeRef.current) {
      const iframe = iframeRef.current
      iframe.srcdoc = BASE_HTML
      setTimeout(() => {
        iframe.contentWindow?.postMessage(code, '*')
      }, 100)
    }
  }, [code])

  return (
    <Box position="relative" w="100%" h="100%" {...rest}>
      <Box
        as="iframe"
        ref={iframeRef as any}
        sandbox="allow-scripts"
        title="preview"
        w="100%"
        h="100%"
      />
      <Center
        position="absolute"
        bg="whiteAlpha.500"
        style={{ backdropFilter: 'blur(5px)' }}
        top={0}
        left={0}
        bottom={0}
        right={0}
        display={loading ? 'flex' : 'none'}
      >
        <Loader size="xl" thickness="4px" />
      </Center>
    </Box>
  )
}

export default Preview
