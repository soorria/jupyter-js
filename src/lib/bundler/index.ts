import * as esbuild from 'esbuild-wasm'
import unpkgPlugin from './unpkg-plugin'

const ESBUILD_VERSION = '0.8.27'

const cache: {
  service?: esbuild.Service
  promise?: Promise<esbuild.Service>
} = {}

export type BuildResult = {
  code: string
  time?: number
  error?: string
  warnings?: string[]
}

const bundle = async (inputCode: string): Promise<BuildResult> => {
  if (!cache.service) {
    if (cache.promise) {
      cache.service = await cache.promise
    } else {
      cache.promise = esbuild.startService({
        worker: true,
        wasmURL: `https://unpkg.com/esbuild-wasm@${ESBUILD_VERSION}/esbuild.wasm`,
      })
      cache.service = await cache.promise
    }
  }

  const service = cache.service

  try {
    const start = Date.now()
    const result = await service.build({
      target: ['es2015'],
      plugins: [unpkgPlugin(inputCode)],
      entryPoints: ['index.js'],
      bundle: true,
      write: false,
      define: {
        'process.env.NODE_ENV': '"production"',
        global: 'window',
      },
      jsxFactory: '__esbuild_React.createElement',
      jsxFragment: '__esbuild_React.Fragment',
    })

    return {
      time: Date.now() - start,
      code: result.outputFiles[0].text,
    }
  } catch (err) {
    return {
      code: '',
      error: err.message,
    }
  }
}

export { bundle }
