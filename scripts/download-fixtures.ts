#!/usr/bin/env node

import { mkdirSync, writeFileSync } from 'fs'
import { join } from 'path'

interface FixtureConfig {
  name: string
  url: string
  description: string
}

const fixtures: FixtureConfig[] = [
  {
    name: 'crxjs-docs',
    url: 'https://crxjs.dev/vite-plugin/concepts/content-scripts',
    description: 'CRXJS Content Scripts documentation page',
  },
]

/**
 * Download a webpage and save it as an HTML fixture
 */
async function downloadFixture(config: FixtureConfig): Promise<void> {
  console.log(`Downloading ${config.description}...`)

  try {
    const response = await fetch(config.url)

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`)
    }

    const html = await response.text()

    // Create fixtures directory if it doesn't exist
    const fixturesDir = join(process.cwd(), 'tests', 'fixtures')
    mkdirSync(fixturesDir, { recursive: true })

    // Save the HTML file
    const filePath = join(fixturesDir, `${config.name}.html`)
    writeFileSync(filePath, html, 'utf-8')

    console.log(`✅ Saved ${config.name}.html (${html.length} bytes)`)

    // Create a manifest file with metadata
    const manifest = {
      name: config.name,
      url: config.url,
      description: config.description,
      downloadedAt: new Date().toISOString(),
      size: html.length,
    }

    const manifestPath = join(fixturesDir, `${config.name}.json`)
    writeFileSync(manifestPath, JSON.stringify(manifest, null, 2), 'utf-8')
  } catch (error) {
    console.error(`❌ Failed to download ${config.name}:`, error)
    process.exit(1)
  }
}

/**
 * Main function to download all fixtures
 */
async function main() {
  console.log('📥 Downloading test fixtures...\n')

  for (const fixture of fixtures) {
    await downloadFixture(fixture)
  }

  console.log('\n🎉 All fixtures downloaded successfully!')
  console.log('\nNext steps:')
  console.log('1. Run `npm install` to install dependencies')
  console.log('2. Run `npm run build` to build the extension')
  console.log('3. Run `npm run test:e2e` to run E2E tests')
}

// Run the script
main().catch((error) => {
  console.error('Script failed:', error)
  process.exit(1)
})
