import '@testing-library/jest-dom'
import { vi } from 'vitest'

// Mock import.meta.env
vi.stubEnv('VITE_SUPABASE_URL', 'https://test.supabase.co')
vi.stubEnv('VITE_SUPABASE_ANON_KEY', 'test-anon-key')
vi.stubEnv('VITE_ADMIN_PASS', 'testpass123')

// Mock supabase
vi.mock('./lib/supabase', () => {
  const mockFrom = vi.fn(() => ({
    select: vi.fn().mockReturnThis(),
    insert: vi.fn().mockReturnThis(),
    update: vi.fn().mockReturnThis(),
    delete: vi.fn().mockReturnThis(),
    eq: vi.fn().mockReturnThis(),
    order: vi.fn().mockReturnThis(),
    limit: vi.fn().mockReturnThis(),
    single: vi.fn().mockResolvedValue({ data: null, error: null }),
    then: vi.fn((cb: any) => cb({ data: [], count: 0, error: null })),
  }))
  return {
    supabase: { from: mockFrom },
    default: { from: mockFrom },
  }
})

// Mock window.adsbygoogle
Object.defineProperty(window, 'adsbygoogle', {
  value: [],
  writable: true,
})

// Mock IntersectionObserver
class MockIntersectionObserver {
  observe = vi.fn()
  unobserve = vi.fn()
  disconnect = vi.fn()
}
Object.defineProperty(window, 'IntersectionObserver', {
  value: MockIntersectionObserver,
})

// Mock window.confirm
window.confirm = vi.fn(() => true)

// Mock HTMLMediaElement
Object.defineProperty(HTMLMediaElement.prototype, 'play', {
  configurable: true,
  value: vi.fn().mockResolvedValue(undefined),
})
Object.defineProperty(HTMLMediaElement.prototype, 'pause', {
  configurable: true,
  value: vi.fn(),
})
Object.defineProperty(HTMLMediaElement.prototype, 'load', {
  configurable: true,
  value: vi.fn(),
})
