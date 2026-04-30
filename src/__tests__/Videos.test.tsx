import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { render, screen, waitFor, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter, Route, Routes } from 'react-router-dom'
import VideosList from '../pages/VideosList'
import VideoPlayer from '../pages/VideoPlayer'
import { supabase } from '../lib/supabase'

// Mock dependencies
vi.mock('../components/Layout', () => ({
  default: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="layout">{children}</div>
  ),
}))

vi.mock('../components/Cover', () => ({
  default: ({ kind }: { kind?: string }) => <div data-testid={`cover-${kind || 'rainbow'}`} />,
}))

vi.mock('../components/TopNav', () => ({
  default: () => <div data-testid="topnav" />,
}))

vi.mock('../components/AdRail', () => ({
  default: () => <div data-testid="adrail" />,
}))

vi.mock('../components/Footer', () => ({
  default: () => <div data-testid="footer" />,
}))

// ============================================================================
// VideosList Tests
// ============================================================================

describe('VideosList', () => {
  beforeEach(() => {
    document.title = ''
  })

  afterEach(() => {
    vi.clearAllMocks()
  })

  it('renders VideosList with Layout wrapper', () => {
    render(
      <MemoryRouter>
        <VideosList />
      </MemoryRouter>
    )

    expect(screen.getByTestId('layout')).toBeInTheDocument()
  })

  it('sets document title to "Videos - minesminis"', async () => {
    const mockFrom = vi.spyOn(supabase, 'from').mockReturnValue({
      select: vi.fn().mockReturnThis(),
      eq: vi.fn().mockReturnThis(),
      order: vi.fn().mockReturnThis(),
      limit: vi.fn().mockReturnThis(),
      single: vi.fn().mockResolvedValue({ data: null, error: null }),
      then: vi.fn((cb: any) => Promise.resolve(cb({ data: [], count: 0, error: null }))),
    } as any)

    render(
      <MemoryRouter>
        <VideosList />
      </MemoryRouter>
    )

    await waitFor(() => {
      expect(document.title).toBe('Videos - minesminis')
    })
  })

  it('fetches videos from mm_videos with published=true filter', async () => {
    let capturedChain: any

    const mockFrom = vi.spyOn(supabase, 'from').mockImplementation((table: string) => {
      const chain = {
        select: vi.fn().mockReturnThis(),
        eq: vi.fn().mockReturnThis(),
        order: vi.fn().mockReturnThis(),
        limit: vi.fn().mockReturnThis(),
        single: vi.fn().mockResolvedValue({ data: null, error: null }),
        then: vi.fn((cb: any) => Promise.resolve(cb({ data: [], count: 0, error: null }))),
      }
      capturedChain = chain
      return chain as any
    })

    render(
      <MemoryRouter>
        <VideosList />
      </MemoryRouter>
    )

    await waitFor(() => {
      expect(capturedChain.select).toHaveBeenCalledWith('*')
      expect(capturedChain.eq).toHaveBeenCalledWith('published', true)
      expect(capturedChain.order).toHaveBeenCalledWith('created_at', { ascending: false })
    })
  })

  it('renders all filter chips: All, Sing-Along, Dialogue, Action', async () => {
    vi.spyOn(supabase, 'from').mockReturnValue({
      select: vi.fn().mockReturnThis(),
      eq: vi.fn().mockReturnThis(),
      order: vi.fn().mockReturnThis(),
      limit: vi.fn().mockReturnThis(),
      single: vi.fn().mockResolvedValue({ data: null, error: null }),
      then: vi.fn((cb: any) => Promise.resolve(cb({ data: [], count: 0, error: null }))),
    } as any)

    render(
      <MemoryRouter>
        <VideosList />
      </MemoryRouter>
    )

    await waitFor(() => {
      expect(screen.getByRole('button', { name: 'All' })).toBeInTheDocument()
      expect(screen.getByRole('button', { name: 'Sing-Along' })).toBeInTheDocument()
      expect(screen.getByRole('button', { name: 'Dialogue' })).toBeInTheDocument()
      expect(screen.getByRole('button', { name: 'Action' })).toBeInTheDocument()
    })
  })

  it('shows loading skeleton while fetching videos', () => {
    const mockChain = {
      select: vi.fn().mockReturnThis(),
      eq: vi.fn().mockReturnThis(),
      order: vi.fn().mockReturnThis(),
      limit: vi.fn().mockReturnThis(),
      single: vi.fn().mockResolvedValue({ data: null, error: null }),
      then: vi.fn(() => new Promise(() => {})), // Never resolves
    }

    vi.spyOn(supabase, 'from').mockReturnValue(mockChain as any)

    render(
      <MemoryRouter>
        <VideosList />
      </MemoryRouter>
    )

    // Should show skeleton loading UI, not a text "Loading..."
    const skeletons = screen.getAllByRole('generic', { hidden: true }).filter((el) =>
      el.className.includes('mm-card') && el.style.opacity === '0.5'
    )
    expect(skeletons.length).toBeGreaterThan(0)
  })

  it('displays video cards with title, duration, and category when data loads', async () => {
    const mockVideos = [
      {
        id: '1',
        title: 'Hello Song',
        duration: '2:30',
        category: 'Sing-Along',
        cover_kind: 'rainbow',
        published: true,
        created_at: '2024-01-01',
      },
      {
        id: '2',
        title: 'Action Time',
        duration: '3:15',
        category: 'Action',
        cover_kind: 'farm',
        published: true,
        created_at: '2024-01-02',
      },
    ]

    const mockChain = {
      select: vi.fn().mockReturnThis(),
      eq: vi.fn().mockReturnThis(),
      order: vi.fn().mockReturnThis(),
      limit: vi.fn().mockReturnThis(),
      single: vi.fn().mockResolvedValue({ data: null, error: null }),
    }

    mockChain.then = vi.fn((cb: any) => cb({ data: mockVideos, count: 2, error: null }))

    vi.spyOn(supabase, 'from').mockReturnValue(mockChain as any)

    render(
      <MemoryRouter>
        <VideosList />
      </MemoryRouter>
    )

    await waitFor(() => {
      expect(screen.getByText('Hello Song')).toBeInTheDocument()
      expect(screen.getByText('Action Time')).toBeInTheDocument()
      expect(screen.getByText('2:30')).toBeInTheDocument()
      expect(screen.getByText('3:15')).toBeInTheDocument()
    })
  })

  it('links video cards to /videos/:id', async () => {
    const mockVideos = [
      {
        id: 'abc123',
        title: 'Test Video',
        duration: '2:00',
        category: 'Sing-Along',
        cover_kind: 'rainbow',
        published: true,
        created_at: '2024-01-01',
      },
    ]

    vi.spyOn(supabase, 'from').mockReturnValue({
      select: vi.fn().mockReturnThis(),
      eq: vi.fn().mockReturnThis(),
      order: vi.fn().mockReturnThis(),
      limit: vi.fn().mockReturnThis(),
      single: vi.fn().mockResolvedValue({ data: null, error: null }),
      then: vi.fn((cb: any) => Promise.resolve(cb({ data: mockVideos, count: 1, error: null }))),
    } as any)

    render(
      <MemoryRouter>
        <VideosList />
      </MemoryRouter>
    )

    await waitFor(() => {
      const link = screen.getByRole('link', { name: /Test Video/i })
      expect(link).toHaveAttribute('href', '/videos/abc123')
    })
  })

  it('filters videos by category when chip is clicked', async () => {
    const mockVideos = [
      {
        id: '1',
        title: 'Sing Video',
        duration: '2:00',
        category: 'Sing-Along',
        cover_kind: 'rainbow',
        published: true,
        created_at: '2024-01-01',
      },
      {
        id: '2',
        title: 'Action Video',
        duration: '3:00',
        category: 'Action',
        cover_kind: 'farm',
        published: true,
        created_at: '2024-01-02',
      },
    ]

    vi.spyOn(supabase, 'from').mockReturnValue({
      select: vi.fn().mockReturnThis(),
      eq: vi.fn().mockReturnThis(),
      order: vi.fn().mockReturnThis(),
      limit: vi.fn().mockReturnThis(),
      single: vi.fn().mockResolvedValue({ data: null, error: null }),
      then: vi.fn((cb: any) => Promise.resolve(cb({ data: mockVideos, count: 2, error: null }))),
    } as any)

    const user = userEvent.setup()

    render(
      <MemoryRouter>
        <VideosList />
      </MemoryRouter>
    )

    await waitFor(() => {
      expect(screen.getByText('Sing Video')).toBeInTheDocument()
      expect(screen.getByText('Action Video')).toBeInTheDocument()
    })

    const actionChip = screen.getByRole('button', { name: 'Action' })
    await user.click(actionChip)

    await waitFor(() => {
      expect(screen.queryByText('Sing Video')).not.toBeInTheDocument()
      expect(screen.getByText('Action Video')).toBeInTheDocument()
    })
  })

  it('shows "No content yet" message when no videos match filter', async () => {
    vi.spyOn(supabase, 'from').mockReturnValue({
      select: vi.fn().mockReturnThis(),
      eq: vi.fn().mockReturnThis(),
      order: vi.fn().mockReturnThis(),
      limit: vi.fn().mockReturnThis(),
      single: vi.fn().mockResolvedValue({ data: null, error: null }),
      then: vi.fn((cb: any) => Promise.resolve(cb({ data: [], count: 0, error: null }))),
    } as any)

    render(
      <MemoryRouter>
        <VideosList />
      </MemoryRouter>
    )

    await waitFor(() => {
      expect(screen.getByText('No content yet')).toBeInTheDocument()
      expect(screen.getByText('New videos coming soon!')).toBeInTheDocument()
    })
  })

  it('shows error state with retry button on fetch failure', async () => {
    vi.spyOn(supabase, 'from').mockReturnValue({
      select: vi.fn().mockReturnThis(),
      eq: vi.fn().mockReturnThis(),
      order: vi.fn().mockReturnThis(),
      limit: vi.fn().mockReturnThis(),
      single: vi.fn().mockResolvedValue({ data: null, error: null }),
      then: vi.fn((cb: any) => Promise.resolve(cb({ data: [], count: 0, error: new Error('Fetch failed') }))),
    } as any)

    render(
      <MemoryRouter>
        <VideosList />
      </MemoryRouter>
    )

    await waitFor(() => {
      expect(screen.getByText('Connection error')).toBeInTheDocument()
      expect(screen.getByText('Please try again later.')).toBeInTheDocument()
      expect(screen.getByRole('button', { name: 'Retry' })).toBeInTheDocument()
    })
  })

  it('shows video count in header subtitle', async () => {
    const mockVideos = [
      { id: '1', title: 'Video 1', duration: '1:00', category: 'Sing-Along', cover_kind: 'rainbow', published: true, created_at: '2024-01-01' },
      { id: '2', title: 'Video 2', duration: '2:00', category: 'Dialogue', cover_kind: 'farm', published: true, created_at: '2024-01-02' },
      { id: '3', title: 'Video 3', duration: '3:00', category: 'Action', cover_kind: 'family', published: true, created_at: '2024-01-03' },
    ]

    vi.spyOn(supabase, 'from').mockReturnValue({
      select: vi.fn().mockReturnThis(),
      eq: vi.fn().mockReturnThis(),
      order: vi.fn().mockReturnThis(),
      limit: vi.fn().mockReturnThis(),
      single: vi.fn().mockResolvedValue({ data: null, error: null }),
      then: vi.fn((cb: any) => Promise.resolve(cb({ data: mockVideos, count: 3, error: null }))),
    } as any)

    render(
      <MemoryRouter>
        <VideosList />
      </MemoryRouter>
    )

    await waitFor(() => {
      expect(screen.getByText('3 videos - elementary level')).toBeInTheDocument()
    })
  })

  it('renders Cover component for each video with correct kind', async () => {
    const mockVideos = [
      {
        id: '1',
        title: 'Video 1',
        duration: '1:00',
        category: 'Sing-Along',
        cover_kind: 'rainbow',
        published: true,
        created_at: '2024-01-01',
      },
      {
        id: '2',
        title: 'Video 2',
        duration: '2:00',
        category: 'Dialogue',
        cover_kind: 'farm',
        published: true,
        created_at: '2024-01-02',
      },
    ]

    vi.spyOn(supabase, 'from').mockReturnValue({
      select: vi.fn().mockReturnThis(),
      eq: vi.fn().mockReturnThis(),
      order: vi.fn().mockReturnThis(),
      limit: vi.fn().mockReturnThis(),
      single: vi.fn().mockResolvedValue({ data: null, error: null }),
      then: vi.fn((cb: any) => Promise.resolve(cb({ data: mockVideos, count: 2, error: null }))),
    } as any)

    render(
      <MemoryRouter>
        <VideosList />
      </MemoryRouter>
    )

    await waitFor(() => {
      expect(screen.getByTestId('cover-rainbow')).toBeInTheDocument()
      expect(screen.getByTestId('cover-farm')).toBeInTheDocument()
    })
  })
})

// ============================================================================
// VideoPlayer Tests
// ============================================================================

describe('VideoPlayer', () => {
  beforeEach(() => {
    document.title = ''
  })

  afterEach(() => {
    vi.clearAllMocks()
  })

  it('renders VideoPlayer with Layout wrapper', () => {
    render(
      <MemoryRouter initialEntries={['/videos/test-id']}>
        <Routes>
          <Route path="/videos/:id" element={<VideoPlayer />} />
        </Routes>
      </MemoryRouter>
    )

    expect(screen.getByTestId('layout')).toBeInTheDocument()
  })

  it('fetches video by id from mm_videos', async () => {
    let capturedChain: any

    vi.spyOn(supabase, 'from').mockImplementation((table: string) => {
      const chain = {
        select: vi.fn().mockReturnThis(),
        eq: vi.fn().mockReturnThis(),
        order: vi.fn().mockReturnThis(),
        limit: vi.fn().mockReturnThis(),
        single: vi.fn().mockResolvedValue({
          data: {
            id: 'test-id',
            title: 'Test Video',
            category: 'Sing-Along',
            duration: '2:30',
            cover_kind: 'rainbow',
            youtube_url: '',
            lyrics_en: '',
            lyrics_tr: '',
          },
          error: null,
        }),
        then: vi.fn((cb: any) => Promise.resolve(cb({ data: [], count: 0, error: null }))),
      }
      capturedChain = chain
      return chain as any
    })

    render(
      <MemoryRouter initialEntries={['/videos/test-id']}>
        <Routes>
          <Route path="/videos/:id" element={<VideoPlayer />} />
        </Routes>
      </MemoryRouter>
    )

    await waitFor(() => {
      expect(capturedChain.select).toHaveBeenCalledWith('*')
      expect(capturedChain.eq).toHaveBeenCalledWith('id', 'test-id')
      expect(capturedChain.single).toHaveBeenCalled()
    })
  })

  it('sets document title to "{title} - minesminis" when video loads', async () => {
    vi.spyOn(supabase, 'from').mockReturnValue({
      select: vi.fn().mockReturnThis(),
      eq: vi.fn().mockReturnThis(),
      order: vi.fn().mockReturnThis(),
      limit: vi.fn().mockReturnThis(),
      single: vi.fn().mockResolvedValue({
        data: {
          id: '123',
          title: 'Amazing Song',
          category: 'Sing-Along',
          duration: '2:30',
          cover_kind: 'rainbow',
          youtube_url: '',
          lyrics_en: '',
          lyrics_tr: '',
        },
        error: null,
      }),
      then: vi.fn((cb: any) => Promise.resolve(cb({ data: [], count: 0, error: null }))),
    } as any)

    render(
      <MemoryRouter initialEntries={['/videos/123']}>
        <Routes>
          <Route path="/videos/:id" element={<VideoPlayer />} />
        </Routes>
      </MemoryRouter>
    )

    await waitFor(() => {
      expect(document.title).toBe('Amazing Song - minesminis')
    })
  })

  it('shows title and metadata in header', async () => {
    vi.spyOn(supabase, 'from').mockReturnValue({
      select: vi.fn().mockReturnThis(),
      eq: vi.fn().mockReturnThis(),
      order: vi.fn().mockReturnThis(),
      limit: vi.fn().mockReturnThis(),
      single: vi.fn().mockResolvedValue({
        data: {
          id: '123',
          title: 'Hello World',
          category: 'Dialogue',
          duration: '3:45',
          cover_kind: 'family',
          youtube_url: '',
          lyrics_en: '',
          lyrics_tr: '',
        },
        error: null,
      }),
      then: vi.fn((cb: any) => Promise.resolve(cb({ data: [], count: 0, error: null }))),
    } as any)

    render(
      <MemoryRouter initialEntries={['/videos/123']}>
        <Routes>
          <Route path="/videos/:id" element={<VideoPlayer />} />
        </Routes>
      </MemoryRouter>
    )

    await waitFor(() => {
      expect(screen.getByText('Hello World')).toBeInTheDocument()
      expect(screen.getByText('Dialogue - 3:45')).toBeInTheDocument()
    })
  })

  it('renders YouTube iframe when youtube_url is present', async () => {
    vi.spyOn(supabase, 'from').mockReturnValue({
      select: vi.fn().mockReturnThis(),
      eq: vi.fn().mockReturnThis(),
      order: vi.fn().mockReturnThis(),
      limit: vi.fn().mockReturnThis(),
      single: vi.fn().mockResolvedValue({
        data: {
          id: '123',
          title: 'Video with YouTube',
          category: 'Sing-Along',
          duration: '2:00',
          cover_kind: 'rainbow',
          youtube_url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
          lyrics_en: '',
          lyrics_tr: '',
        },
        error: null,
      }),
      then: vi.fn((cb: any) => Promise.resolve(cb({ data: [], count: 0, error: null }))),
    } as any)

    render(
      <MemoryRouter initialEntries={['/videos/123']}>
        <Routes>
          <Route path="/videos/:id" element={<VideoPlayer />} />
        </Routes>
      </MemoryRouter>
    )

    await waitFor(() => {
      const iframe = screen.getByTitle('Video with YouTube') as HTMLIFrameElement
      expect(iframe).toBeInTheDocument()
      expect(iframe.src).toContain('https://www.youtube.com/embed/dQw4w9WgXcQ')
    })
  })

  it('extracts video ID from youtu.be short URL', async () => {
    vi.spyOn(supabase, 'from').mockReturnValue({
      select: vi.fn().mockReturnThis(),
      eq: vi.fn().mockReturnThis(),
      order: vi.fn().mockReturnThis(),
      limit: vi.fn().mockReturnThis(),
      single: vi.fn().mockResolvedValue({
        data: {
          id: '123',
          title: 'Short URL Video',
          category: 'Action',
          duration: '1:30',
          cover_kind: 'farm',
          youtube_url: 'https://youtu.be/abc123xyz',
          lyrics_en: '',
          lyrics_tr: '',
        },
        error: null,
      }),
      then: vi.fn((cb: any) => Promise.resolve(cb({ data: [], count: 0, error: null }))),
    } as any)

    render(
      <MemoryRouter initialEntries={['/videos/123']}>
        <Routes>
          <Route path="/videos/:id" element={<VideoPlayer />} />
        </Routes>
      </MemoryRouter>
    )

    await waitFor(() => {
      const iframe = screen.getByTitle('Short URL Video') as HTMLIFrameElement
      expect(iframe.src).toContain('https://www.youtube.com/embed/abc123xyz')
    })
  })

  it('extracts video ID from youtube.com/embed/ URL', async () => {
    vi.spyOn(supabase, 'from').mockReturnValue({
      select: vi.fn().mockReturnThis(),
      eq: vi.fn().mockReturnThis(),
      order: vi.fn().mockReturnThis(),
      limit: vi.fn().mockReturnThis(),
      single: vi.fn().mockResolvedValue({
        data: {
          id: '123',
          title: 'Embed URL Video',
          category: 'Dialogue',
          duration: '2:15',
          cover_kind: 'hello',
          youtube_url: 'https://www.youtube.com/embed/embed123xyz',
          lyrics_en: '',
          lyrics_tr: '',
        },
        error: null,
      }),
      then: vi.fn((cb: any) => Promise.resolve(cb({ data: [], count: 0, error: null }))),
    } as any)

    render(
      <MemoryRouter initialEntries={['/videos/123']}>
        <Routes>
          <Route path="/videos/:id" element={<VideoPlayer />} />
        </Routes>
      </MemoryRouter>
    )

    await waitFor(() => {
      const iframe = screen.getByTitle('Embed URL Video') as HTMLIFrameElement
      expect(iframe.src).toBe('https://www.youtube.com/embed/embed123xyz')
    })
  })

  it('shows Cover with play button when no youtube_url', async () => {
    vi.spyOn(supabase, 'from').mockReturnValue({
      select: vi.fn().mockReturnThis(),
      eq: vi.fn().mockReturnThis(),
      order: vi.fn().mockReturnThis(),
      limit: vi.fn().mockReturnThis(),
      single: vi.fn().mockResolvedValue({
        data: {
          id: '123',
          title: 'No YouTube Video',
          category: 'Sing-Along',
          duration: '2:00',
          cover_kind: 'duck',
          youtube_url: '',
          lyrics_en: '',
          lyrics_tr: '',
        },
        error: null,
      }),
      then: vi.fn((cb: any) => Promise.resolve(cb({ data: [], count: 0, error: null }))),
    } as any)

    render(
      <MemoryRouter initialEntries={['/videos/123']}>
        <Routes>
          <Route path="/videos/:id" element={<VideoPlayer />} />
        </Routes>
      </MemoryRouter>
    )

    await waitFor(() => {
      expect(screen.getByTestId('cover-duck')).toBeInTheDocument()
      expect(screen.getByText('YouTube link not added yet')).toBeInTheDocument()
    })
  })

  it('renders English and Turkish lyrics when present', async () => {
    vi.spyOn(supabase, 'from').mockReturnValue({
      select: vi.fn().mockReturnThis(),
      eq: vi.fn().mockReturnThis(),
      order: vi.fn().mockReturnThis(),
      limit: vi.fn().mockReturnThis(),
      single: vi.fn().mockResolvedValue({
        data: {
          id: '123',
          title: 'Lyric Video',
          category: 'Sing-Along',
          duration: '3:00',
          cover_kind: 'rainbow',
          youtube_url: '',
          lyrics_en: 'Hello\nWorld\nHow are you?',
          lyrics_tr: 'Merhaba\nDünya\nNasılsın?',
        },
        error: null,
      }),
      then: vi.fn((cb: any) => Promise.resolve(cb({ data: [], count: 0, error: null }))),
    } as any)

    render(
      <MemoryRouter initialEntries={['/videos/123']}>
        <Routes>
          <Route path="/videos/:id" element={<VideoPlayer />} />
        </Routes>
      </MemoryRouter>
    )

    await waitFor(() => {
      expect(screen.getByText('ENGLISH')).toBeInTheDocument()
      expect(screen.getByText('TURKISH')).toBeInTheDocument()
      expect(screen.getByText(/Hello/)).toBeInTheDocument()
      expect(screen.getByText(/Merhaba/)).toBeInTheDocument()
    })
  })

  it('shows "Content not found" when video fetch fails', async () => {
    vi.spyOn(supabase, 'from').mockReturnValue({
      select: vi.fn().mockReturnThis(),
      eq: vi.fn().mockReturnThis(),
      order: vi.fn().mockReturnThis(),
      limit: vi.fn().mockReturnThis(),
      single: vi.fn().mockResolvedValue({
        data: null,
        error: new Error('Not found'),
      }),
      then: vi.fn((cb: any) => Promise.resolve(cb({ data: [], count: 0, error: null }))),
    } as any)

    render(
      <MemoryRouter initialEntries={['/videos/invalid-id']}>
        <Routes>
          <Route path="/videos/:id" element={<VideoPlayer />} />
          <Route path="/videos" element={<div>Videos List</div>} />
        </Routes>
      </MemoryRouter>
    )

    await waitFor(() => {
      expect(screen.getByText('Content not found')).toBeInTheDocument()
    })
  })

  it('shows "Back to Videos" link when video not found', async () => {
    vi.spyOn(supabase, 'from').mockReturnValue({
      select: vi.fn().mockReturnThis(),
      eq: vi.fn().mockReturnThis(),
      order: vi.fn().mockReturnThis(),
      limit: vi.fn().mockReturnThis(),
      single: vi.fn().mockResolvedValue({
        data: null,
        error: new Error('Not found'),
      }),
      then: vi.fn((cb: any) => Promise.resolve(cb({ data: [], count: 0, error: null }))),
    } as any)

    render(
      <MemoryRouter initialEntries={['/videos/invalid-id']}>
        <Routes>
          <Route path="/videos/:id" element={<VideoPlayer />} />
          <Route path="/videos" element={<div>Videos List</div>} />
        </Routes>
      </MemoryRouter>
    )

    await waitFor(() => {
      const backLink = screen.getByRole('link', { name: /Back to Videos/i })
      expect(backLink).toHaveAttribute('href', '/videos')
    })
  })

  it('shows "Loading..." while video fetches', () => {
    vi.spyOn(supabase, 'from').mockReturnValue({
      select: vi.fn().mockReturnThis(),
      eq: vi.fn().mockReturnThis(),
      order: vi.fn().mockReturnThis(),
      limit: vi.fn().mockReturnThis(),
      single: vi.fn(() => new Promise(() => {})), // Never resolves
      then: vi.fn((cb: any) => Promise.resolve(cb({ data: [], count: 0, error: null }))),
    } as any)

    render(
      <MemoryRouter initialEntries={['/videos/123']}>
        <Routes>
          <Route path="/videos/:id" element={<VideoPlayer />} />
        </Routes>
      </MemoryRouter>
    )

    expect(screen.getByText('Loading...')).toBeInTheDocument()
  })

  it('shows back arrow link to /videos', async () => {
    vi.spyOn(supabase, 'from').mockReturnValue({
      select: vi.fn().mockReturnThis(),
      eq: vi.fn().mockReturnThis(),
      order: vi.fn().mockReturnThis(),
      limit: vi.fn().mockReturnThis(),
      single: vi.fn().mockResolvedValue({
        data: {
          id: '123',
          title: 'Test Video',
          category: 'Sing-Along',
          duration: '2:00',
          cover_kind: 'rainbow',
          youtube_url: '',
          lyrics_en: '',
          lyrics_tr: '',
        },
        error: null,
      }),
      then: vi.fn((cb: any) => Promise.resolve(cb({ data: [], count: 0, error: null }))),
    } as any)

    render(
      <MemoryRouter initialEntries={['/videos/123']}>
        <Routes>
          <Route path="/videos/:id" element={<VideoPlayer />} />
        </Routes>
      </MemoryRouter>
    )

    await waitFor(() => {
      const backButton = screen.getByRole('link', { name: /Back to Videos/i })
      expect(backButton).toHaveAttribute('href', '/videos')
    })
  })

  it('does not show lyrics section when both lyrics are empty', async () => {
    vi.spyOn(supabase, 'from').mockReturnValue({
      select: vi.fn().mockReturnThis(),
      eq: vi.fn().mockReturnThis(),
      order: vi.fn().mockReturnThis(),
      limit: vi.fn().mockReturnThis(),
      single: vi.fn().mockResolvedValue({
        data: {
          id: '123',
          title: 'No Lyrics Video',
          category: 'Action',
          duration: '1:45',
          cover_kind: 'farm',
          youtube_url: 'https://www.youtube.com/watch?v=abc123',
          lyrics_en: '',
          lyrics_tr: '',
        },
        error: null,
      }),
      then: vi.fn((cb: any) => Promise.resolve(cb({ data: [], count: 0, error: null }))),
    } as any)

    render(
      <MemoryRouter initialEntries={['/videos/123']}>
        <Routes>
          <Route path="/videos/:id" element={<VideoPlayer />} />
        </Routes>
      </MemoryRouter>
    )

    await waitFor(() => {
      expect(screen.queryByText('ENGLISH')).not.toBeInTheDocument()
      expect(screen.queryByText('TURKISH')).not.toBeInTheDocument()
    })
  })

  it('shows lyrics section when only English lyrics present', async () => {
    vi.spyOn(supabase, 'from').mockReturnValue({
      select: vi.fn().mockReturnThis(),
      eq: vi.fn().mockReturnThis(),
      order: vi.fn().mockReturnThis(),
      limit: vi.fn().mockReturnThis(),
      single: vi.fn().mockResolvedValue({
        data: {
          id: '123',
          title: 'English Only',
          category: 'Sing-Along',
          duration: '2:30',
          cover_kind: 'rainbow',
          youtube_url: '',
          lyrics_en: 'One, two, three',
          lyrics_tr: '',
        },
        error: null,
      }),
      then: vi.fn((cb: any) => Promise.resolve(cb({ data: [], count: 0, error: null }))),
    } as any)

    render(
      <MemoryRouter initialEntries={['/videos/123']}>
        <Routes>
          <Route path="/videos/:id" element={<VideoPlayer />} />
        </Routes>
      </MemoryRouter>
    )

    await waitFor(() => {
      expect(screen.getByText('ENGLISH')).toBeInTheDocument()
      expect(screen.getByText('TURKISH')).toBeInTheDocument()
      expect(screen.getByText('One, two, three')).toBeInTheDocument()
    })
  })
})
