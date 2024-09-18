declare global {
  var __DEBUG__: boolean
}
globalThis.__DEBUG__ = import.meta.env.VITE_LEXA_DEBUG === 'true'
