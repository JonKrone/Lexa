import '@testing-library/jest-dom'
import { afterAll, afterEach, beforeEach, vi } from 'vitest'

// Mock the global __DEBUG__ variable
declare global {
  var __DEBUG__: boolean
}

globalThis.__DEBUG__ = true

// Mock Chrome Extension APIs
const chromeMock = {
  storage: {
    local: {
      get: vi.fn((keys, callback) => {
        if (callback) callback({})
        return Promise.resolve({})
      }),
      set: vi.fn((items, callback) => {
        if (callback) callback()
        return Promise.resolve()
      }),
      remove: vi.fn((keys, callback) => {
        if (callback) callback()
        return Promise.resolve()
      }),
    },
    sync: {
      get: vi.fn((keys, callback) => {
        if (callback) callback({})
        return Promise.resolve({})
      }),
      set: vi.fn((items, callback) => {
        if (callback) callback()
        return Promise.resolve()
      }),
      remove: vi.fn((keys, callback) => {
        if (callback) callback()
        return Promise.resolve()
      }),
    },
  },
  runtime: {
    id: 'test-extension-id',
    onMessage: {
      addListener: vi.fn(),
      removeListener: vi.fn(),
    },
    sendMessage: vi.fn(),
  },
  tabs: {
    query: vi.fn((queryInfo, callback) => {
      if (callback) callback([{ id: 123 }])
      return Promise.resolve([{ id: 123 }])
    }),
    create: vi.fn(({ url }) => Promise.resolve({ id: 123, url })),
  },
  sidePanel: {
    open: vi.fn(),
  },
  commands: {
    getAll: vi.fn(() => Promise.resolve([])),
  },
}

vi.stubGlobal('chrome', chromeMock)

// Mock console methods to avoid noise in tests
const originalConsole = { ...console }

beforeEach(() => {
  // Reset console mocks before each test
  console.log = vi.fn()
  console.warn = vi.fn()
  console.error = vi.fn()
})

afterEach(() => {
  // Clean up DOM after each test
  document.body.innerHTML = ''
  document.head.innerHTML = ''
})

afterAll(() => {
  // Restore original console
  Object.assign(console, originalConsole)
})
