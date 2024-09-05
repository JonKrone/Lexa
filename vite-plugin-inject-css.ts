import fs from 'fs'
import path from 'path'
import { Plugin } from 'vite'

const cssInjectionKeyword = '/* @vite-plugin-inject-css */'

export function vitePluginInjectCss(): Plugin {
  let cssContent: string

  return {
    name: 'vite-plugin-inject-css',
    // Load the CSS during build or dev
    configResolved(config) {
      if (config.command === 'serve') {
        // Load the compiled CSS during dev
        cssContent = fs.readFileSync(
          path.resolve(__dirname, 'src', 'index.css'),
          'utf-8',
        )
        console.log('cssContent', cssContent)
      }
    },
    generateBundle(_, bundle) {
      const cssFiles = Object.keys(bundle).filter((key) => key.endsWith('.css'))

      // this.error(`cssFiles: ${cssFiles.join(',')}`)
      if (!cssFiles.length) return

      const cssFile = cssFiles[0]
      const output = bundle[cssFile]
      const cssContent =
        'source' in output ? ((output as any).source as string) : ''

      // Step 2: Locate the correct JS chunk and add our compiled CSS directly in there.
      Object.values(bundle).forEach((chunk) => {
        const isJSChunk =
          chunk.type === 'chunk' && chunk.fileName.endsWith('.js')
        if (!isJSChunk) return
        const isChunkToInjectCss = chunk.code.includes(cssInjectionKeyword)
        if (!isChunkToInjectCss) return

        chunk.code = chunk.code.replace(cssInjectionKeyword, cssContent)
      })
    },
    // transform(code, id) {
    //   if (id.endsWith('.css')) {
    //     return { code: `export default ${JSON.stringify(code)}` }
    //   }
    // },
  } satisfies Plugin
}
