import '@testing-library/jest-dom';
import { vi } from 'vitest';

// Mock lottie-react (depends on lottie-web which crashes in jsdom due to canvas)
vi.mock('lottie-react', () => ({
  default: () => null,
  __esModule: true,
}));

// Mock @lottiefiles/react-lottie-player
vi.mock('@lottiefiles/react-lottie-player', () => ({
  Player: () => null,
}));


// Mock localStorage
const localStorageMock = (() => {
  let store: Record<string, string> = {};
  return {
    getItem: vi.fn((key: string) => store[key] ?? null),
    setItem: vi.fn((key: string, value: string) => { store[key] = value; }),
    removeItem: vi.fn((key: string) => { delete store[key]; }),
    clear: vi.fn(() => { store = {}; }),
    get length() { return Object.keys(store).length; },
    key: vi.fn((i: number) => Object.keys(store)[i] ?? null),
  };
})();
Object.defineProperty(window, 'localStorage', { value: localStorageMock });

// Mock sessionStorage
const sessionStorageMock = (() => {
  let store: Record<string, string> = {};
  return {
    getItem: vi.fn((key: string) => store[key] ?? null),
    setItem: vi.fn((key: string, value: string) => { store[key] = value; }),
    removeItem: vi.fn((key: string) => { delete store[key]; }),
    clear: vi.fn(() => { store = {}; }),
    get length() { return Object.keys(store).length; },
    key: vi.fn((i: number) => Object.keys(store)[i] ?? null),
  };
})();
Object.defineProperty(window, 'sessionStorage', { value: sessionStorageMock });

// Mock matchMedia
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: vi.fn().mockImplementation((query: string) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(),
    removeListener: vi.fn(),
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })),
});

// Mock crypto
Object.defineProperty(globalThis, 'crypto', {
  value: {
    getRandomValues: (arr: Uint8Array) => {
      for (let i = 0; i < arr.length; i++) arr[i] = Math.floor(Math.random() * 256);
      return arr;
    },
    subtle: {} as SubtleCrypto,
    randomUUID: () => 'test-uuid-1234',
  },
});

// Mock IntersectionObserver
class MockIntersectionObserver {
  observe = vi.fn();
  unobserve = vi.fn();
  disconnect = vi.fn();
}
Object.defineProperty(window, 'IntersectionObserver', { value: MockIntersectionObserver });

// Mock ResizeObserver
class MockResizeObserver {
  observe = vi.fn();
  unobserve = vi.fn();
  disconnect = vi.fn();
}
Object.defineProperty(window, 'ResizeObserver', { value: MockResizeObserver });

// Mock AudioContext
class MockAudioContext {
  createOscillator = vi.fn(() => ({
    connect: vi.fn(), start: vi.fn(), stop: vi.fn(),
    frequency: { value: 0, setValueAtTime: vi.fn(), linearRampToValueAtTime: vi.fn(), exponentialRampToValueAtTime: vi.fn() },
    type: 'sine',
  }));
  createGain = vi.fn(() => ({
    connect: vi.fn(),
    gain: { value: 0, setValueAtTime: vi.fn(), linearRampToValueAtTime: vi.fn(), exponentialRampToValueAtTime: vi.fn() },
  }));
  createBufferSource = vi.fn(() => ({
    connect: vi.fn(), start: vi.fn(), stop: vi.fn(), buffer: null,
  }));
  createBuffer = vi.fn(() => ({
    getChannelData: vi.fn(() => new Float32Array(44100)),
  }));
  destination = {};
  currentTime = 0;
  sampleRate = 44100;
  close = vi.fn();
}
Object.defineProperty(window, 'AudioContext', { value: MockAudioContext });
Object.defineProperty(window, 'webkitAudioContext', { value: MockAudioContext });

// Mock import.meta.env
vi.stubGlobal('import', { meta: { env: { DEV: true, PROD: false, MODE: 'test' } } });

// Reset mocks between tests
beforeEach(() => {
  localStorageMock.clear();
  sessionStorageMock.clear();
  vi.clearAllMocks();
});
