import { getInstalledBrowsers } from '@puppeteer/browsers'
import { createServer } from 'http'
import { AddressInfo } from 'net'
import os from 'os'
import path from 'path'
import puppeteer, { Browser, Page } from 'puppeteer'
import serveStatic from 'serve-static'
import { afterAll, beforeAll } from 'vitest'

export let browser: Browser
export let server: ReturnType<typeof createServer>
export let serverPort: number

beforeAll(async () => {
  // Retrieve the path of the locally-installed Chrome for Testing.
  const cacheDir = path.join(os.homedir(), '.cache', 'puppeteer')
  const installed = await getInstalledBrowsers({ cacheDir })

  const chromeInstall = installed.find((b: any) => b.browser === 'chrome')

  if (!chromeInstall) {
    throw new Error(
      'Chrome for Puppeteer is not installed. Run "npm run browser:install" first.',
    )
  }

  const executablePath: string = chromeInstall.executablePath

  // Launch browser with extensions disabled
  browser = await puppeteer.launch({
    headless: true,
    executablePath,
    args: [
      '--disable-extensions',
      '--disable-web-security',
      '--disable-features=VizDisplayCompositor',
      '--no-sandbox',
      '--disable-setuid-sandbox',
    ],
  })

  // Create HTTP server for serving fixtures
  const serve = serveStatic(path.resolve('tests/fixtures'), {
    index: ['index.html', 'index.htm'],
  })

  server = createServer((req, res) => {
    serve(req, res, () => {
      res.statusCode = 404
      res.end('Not found')
    })
  })

  await new Promise<void>((resolve) => {
    server.listen(0, () => {
      const address = server.address() as AddressInfo
      serverPort = address.port
      console.log(`Test server running on port ${serverPort}`)
      resolve()
    })
  })
})

afterAll(async () => {
  await browser?.close()
  server?.close()
})

export const createTestPage = async (): Promise<Page> => {
  const page = await browser.newPage()

  // Set up console logging for debugging
  page.on('console', (msg) => {
    if (process.env.DEBUG_E2E) {
      console.log('PAGE LOG:', msg.text())
    }
  })

  return page
}

export const getFixtureUrl = (fixtureName: string): string => {
  return `http://localhost:${serverPort}/${fixtureName}`
}
