import { Plugin, OnLoadResult } from 'esbuild-wasm'
import localForage from 'localforage'

const NAMESPACE = 'MAIN'

export const moduleCache = localForage.createInstance({
  name: 'moduleCache',
  description: 'Cache for unpkg modules for jupyter.js',
})

const unpkgPlugin = (inputCode: string): Plugin => {
  return {
    name: 'unpkg-plugin',
    setup(build) {
      build.onResolve({ filter: /(^index.js$)/ }, () => {
        return {
          namespace: NAMESPACE,
          path: 'index.js',
        }
      })

      // Handle direct urls to files e.g. import 'https://jss-css-import-tester.vercel.app/main.css'
      build.onResolve({ filter: /^http.*(\.css|\.js)$/ }, args => {
        return {
          namespace: NAMESPACE,
          path: args.path,
        }
      })

      // Relative paths e.g. import utils from './utils'
      build.onResolve({ filter: /^\.+\// }, args => {
        return {
          namespace: NAMESPACE,
          path: new URL(args.path, 'https://unpkg.com' + args.resolveDir + '/').href,
        }
      })

      // Main file of a module e.g. import React from 'react'
      build.onResolve({ filter: /.*/ }, args => {
        return {
          namespace: NAMESPACE,
          path: `https://unpkg.com/${args.path}`,
        }
      })

      // Load the index.js file (with the provided code)
      build.onLoad({ filter: /(^index\.js$)/ }, () => {
        return {
          loader: 'jsx',
          contents: inputCode,
        }
      })

      build.onLoad({ filter: /.*/ }, async args => {
        const cachedResult = await moduleCache.getItem<OnLoadResult>(args.path)

        if (cachedResult) {
          return cachedResult
        }
      })

      // Handle css imports e.g. import 'bulma/css/bulma.css'
      build.onLoad({ filter: /\.css$/ }, async args => {
        const response = await fetch(args.path)
        const text = await response.text()
        const escaped = text.replace(/\n/g, '').replace(/"/g, '').replace(/'/g, '')
        const contents = `
          const style = document.createElement('style')
          style.innerText = '${escaped}'
          document.head.appendChild(style)
        `

        // Makes @import works, but doesn't cache
        // const contents = `
        //   const link = document.createElement('link')
        //   link.rel = 'stylesheet'
        //   link.href = '${args.path}'
        //   document.head.appendChild(link)
        // `

        const result = {
          loader: 'jsx' as const,
          contents,
          resolveDir: new URL('./', response.url).pathname,
        }

        await moduleCache.setItem(args.path, result)

        return result
      })

      // Handle Other imports e.g. import React from 'react',
      build.onLoad({ filter: /.*/ }, async args => {
        const response = await fetch(args.path)
        const text = await response.text()

        const result = {
          loader: 'jsx' as const,
          contents: text,
          resolveDir: new URL('./', response.url).pathname,
        }

        await moduleCache.setItem(args.path, result)

        return result
      })
    },
  }
}

export default unpkgPlugin
