import theme from '#src/theme'
import { ChakraProvider } from '@chakra-ui/react'
import { Provider } from 'next-auth/client'
import { AppProps } from 'next/app'
import Head from 'next/head'
import { SWRConfig } from 'swr'
import fetcher from '#lib/fetcher'

const App = ({ Component, pageProps }: AppProps): React.ReactNode => {
  return (
    <>
      <Head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <script
          async
          defer
          data-domain="jjs.mooth.tech"
          data-api="https://mooth.tech/proxy/api/event"
          src="https://mooth.tech/js/potato.js"
        />
        <title>jupyter.js</title>
      </Head>
      <ChakraProvider theme={theme}>
        <Provider session={pageProps.session}>
          <SWRConfig value={{ fetcher }}>
            <Component {...pageProps} />
          </SWRConfig>
        </Provider>
      </ChakraProvider>
    </>
  )
}

export default App
