/**
 * I do not often use a logger but I am in this product because we'll occasionally be logging to the
 * console of the sites our users are visiting so we want it to be clear which logs are from us.
 */

// I wish it was possible to detect the devtools' dark/light theme but, alas, it is not.
// Chose some colors that are somewhat readable on both. I use dark mode everywhere, so these
// look better there.
const styles = {
  log: 'color: #A0A0A0;', // Light gray for dark mode
  info: 'color: #ADD8E6; font-weight: bold;', // Light blue
  warn: 'color: #FFA500; font-weight: bold;', // Light Orange
  error: 'color: #FF6347; font-weight: bold;', // Tomato red
} as const

type ConsoleMethod = 'log' | 'info' | 'warn' | 'error'

const createLogger = (prefix: string) => {
  const log =
    (level: ConsoleMethod) =>
    (...params: any[]) => {
      console[level](`%c[${prefix}]`, styles[level], ...params)
    }

  return {
    log: log('log'),
    info: log('info'),
    warn: log('warn'),
    error: log('error'),
  }
}

export const logger = createLogger('Lexa')

if (__DEBUG__) {
  ;(globalThis as any).logger = logger
}
