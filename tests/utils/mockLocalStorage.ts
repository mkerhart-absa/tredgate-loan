import { vi } from 'vitest'

/**
 * Creates a mock localStorage implementation for testing
 * Provides in-memory storage that mimics the localStorage API
 */
export const createLocalStorageMock = () => {
  let store: Record<string, string> = {}
  return {
    getItem: vi.fn((key: string) => store[key] || null),
    setItem: vi.fn((key: string, value: string) => {
      store[key] = value
    }),
    clear: vi.fn(() => {
      store = {}
    }),
    removeItem: vi.fn((key: string) => {
      delete store[key]
    }),
    get length() {
      return Object.keys(store).length
    },
    key: vi.fn((index: number) => Object.keys(store)[index] || null)
  }
}

/**
 * Sets up localStorage mock for tests
 * Call this in your test file to mock localStorage globally
 */
export const setupLocalStorageMock = () => {
  const localStorageMock = createLocalStorageMock()
  Object.defineProperty(globalThis, 'localStorage', { value: localStorageMock })
  return localStorageMock
}
