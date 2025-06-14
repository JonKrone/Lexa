import { readFileSync } from 'fs'
import path from 'path'
import { Page } from 'puppeteer'

export interface Translation {
  original: string
  translation: string
  context: string
}

export interface TestFixture {
  url: string
  htmlFile: string
  translations: Translation[]
}

/**
 * Mock the Chrome extension APIs that the content script depends on
 */
export const mockChromeAPIs = async (page: Page): Promise<void> => {
  await page.evaluateOnNewDocument(() => {
    // Mock chrome.runtime
    ;(window as any).chrome = {
      runtime: {
        getURL: (path: string) =>
          `chrome-extension://test-extension-id/${path}`,
        onMessage: {
          addListener: () => {},
        },
      },
      storage: {
        local: {
          get: () => Promise.resolve({}),
          set: () => Promise.resolve(),
        },
      },
    }
  })
}

/**
 * Mock authentication and settings - bypass the Supabase auth check
 */
export const mockAuthenticationAndSettings = async (
  page: Page,
  testTranslations: Translation[],
): Promise<void> => {
  await page.evaluateOnNewDocument((translations) => {
    // Mock Supabase client
    ;(window as any).__SUPABASE_MOCK__ = {
      auth: {
        getSession: () =>
          Promise.resolve({
            data: {
              session: {
                access_token: 'mock-token',
                user: { id: 'test-user' },
              },
            },
            error: null,
          }),
        initialize: () => Promise.resolve({ error: null }),
      },
    }

    // Mock React Query responses for settings
    ;(window as any).__MOCK_QUERY_DATA__ = {
      settings: {
        target_language: 'Spanish',
        learning_goals: 'Basic conversation',
        learning_level: 'Beginner',
      },
      userPhrases: [],
    }

    // Mock the AI generatePageTranslations function
    ;(window as any).__MOCK_AI_TRANSLATIONS__ = translations

    // Mock the generatePageTranslations function to return our test data
    ;(window as any).mockGeneratePageTranslations = async function* () {
      for (const translation of translations) {
        yield translation
      }
    }
  }, testTranslations)
}

/**
 * Inject the content script and let it run naturally with mocked dependencies
 */
export const loadContentScriptWithMocks = async (
  page: Page,
  testTranslations: Translation[],
): Promise<void> => {
  // Set up mocks before loading the script
  await mockChromeAPIs(page)
  await mockAuthenticationAndSettings(page, testTranslations)

  // Read and modify the content script to use our mocks
  const contentScriptPath = path.resolve('dist/src/content.ts.js')
  let contentScript = readFileSync(contentScriptPath, 'utf-8')

  // Inject our mocks into the content script
  const mockInjection = `
    // Override Supabase client
    if (window.__SUPABASE_MOCK__) {
      window.supabase = window.__SUPABASE_MOCK__;
    }

    // Override React Query to return mock data
    if (window.__MOCK_QUERY_DATA__) {
      const originalQueryClient = window.queryClient;
      if (originalQueryClient) {
        originalQueryClient.setQueryData(['settings'], window.__MOCK_QUERY_DATA__.settings);
        originalQueryClient.setQueryData(['user-phrases'], window.__MOCK_QUERY_DATA__.userPhrases);
        originalQueryClient.setQueryData(['auth', 'user'], { user: { id: 'test-user' } });
        originalQueryClient.setQueryData(['auth', 'session'], { session: { access_token: 'mock-token' } });
      }
    }

    // Override the generatePageTranslations function
    if (window.__MOCK_AI_TRANSLATIONS__ && window.mockGeneratePageTranslations) {
      window.generatePageTranslations = function(markdown, settings) {
        return {
          elementStream: window.mockGeneratePageTranslations()
        };
      };
    }
  `

  // Inject the modified script
  await page.addScriptTag({
    content: mockInjection + '\n' + contentScript,
  })
}

/**
 * Wait for translation elements to appear
 */
export const waitForTranslations = async (
  page: Page,
  expectedCount: number,
  timeout = 5000,
): Promise<void> => {
  await page.waitForFunction(
    (count) => {
      const elements = document.querySelectorAll('.lexa-root-node')
      return elements.length >= count
    },
    { timeout },
    expectedCount,
  )
}

/**
 * Get all translation elements from the page
 */
export const getTranslationElements = async (page: Page) => {
  return await page.$$eval('.lexa-root-node', (elements) => {
    return elements.map((el) => ({
      translation: el.textContent,
      original: (el as HTMLElement).dataset.originalText,
      className: el.className,
    }))
  })
}

/**
 * Measure injection performance
 */
export const measureInjectionTime = async (
  page: Page,
  injectionFn: () => Promise<void>,
): Promise<number> => {
  const start = Date.now()
  await injectionFn()
  const end = Date.now()
  return end - start
}

/**
 * Trigger the natural translation flow
 */
export const triggerTranslationFlow = async (page: Page): Promise<void> => {
  // The content script should automatically initialize after loading
  // We just need to wait for the initialization to complete
  await waitForTimeout(page, 1000) // Give it time to initialize
}

// Helper to use setTimeout in Puppeteer
export const waitForTimeout = async (page: Page, ms: number): Promise<void> => {
  await page.evaluate((ms) => {
    return new Promise((resolve) => setTimeout(resolve, ms))
  }, ms)
}
