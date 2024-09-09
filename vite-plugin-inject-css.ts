import { Plugin } from 'vite'

const cssInjectionKeyword = '/* @vite-plugin-inject-css */'

export function vitePluginInjectCss(): Plugin {
  let cssContent: string

  return {
    name: 'vite-plugin-inject-css',

    // Use Vite's 'transform' hook during development
    // transform(code, id) {
    //   this.warn(`id: ${id}`)
    //   if (id.includes('YourShadowDOMComponentFile')) {
    //     console.log(`Injecting CSS into ${id} during dev...`)

    //     // Use Vite's CSS loader to ensure we get the processed CSS
    //     const cssVirtualModule = `/src/style.css` // Path to your main Tailwind CSS entry file

    //     // Inject the processed CSS via dynamic import for dev
    //     return code.replace(
    //       '/* @inject-css */',
    //       `import('${cssVirtualModule}').then(module => {
    //           const style = document.createElement('style');
    //           style.textContent = module.default;
    //           shadowRoot.appendChild(style);
    //       });`,
    //     )
    //   }
    //   return code
    // },
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
  } satisfies Plugin
}
