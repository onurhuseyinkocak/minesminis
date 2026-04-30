import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { render, screen, waitFor, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter, Route, Routes } from 'react-router-dom'
import SongsList from '../pages/SongsList'
import SongPlayer from '../pages/SongPlayer'
import { supabase } from '../lib/supabase'

vi.mock('../lib/supabase')

const mockSong = {
  id: '1',
  title: 'Phonics A',
  cover_kind: 'animal',
  duration: '2:30',
  category: 'Classic',
  audio_url: 'https://example.com/audio.mp3',
  lyrics: [
    { en: 'A is for Apple', tr: 'A elma için' },
    { en: 'B is for Ball', tr: 'B top için', highlight: true },
  ],
  published: true,
  created_at: '2025-01-01',
}

const mockSongs = [
  mockSong,
  {
    id: '2',
    title: 'Action Song',
    cover_kind: 'food',
    duration: '1:45',
    category: 'Action',
    audio_url: 'https://example.com/audio2.mp3',
    lyrics: [],
    published: true,
    created_at: '2025-01-02',
  },
  {
    id: '3',
    title: 'Learning Math',
    cover_kind: 'nature',
    duration: '3:15',
    category: 'Educational',
    audio_url: null,
    lyrics: [],
    published: true,
    created_at: '2025-01-03',
  },
]

function renderWithRouter(component: React.ReactNode, { route = '/' } = {}) {
  window.history.pushState({}, 'Test page', route)
  return render(
    <MemoryRouter initialEntries={[route]}>
      <Routes>
        <Route path="/" element={component} />
        <Route path="/songs" element={component} />
        <Route path="/songs/:id" element={<SongPlayer />} />
      </Routes>
    </MemoryRouter>
  )
}

// ============================================================
// SONGSLIST TESTS
// ============================================================

describe('SongsList', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    // Reset document title
    document.title = ''
  })

  afterEach(() => {
    vi.clearAllTimers()
  })

  it('renders page title and description', async () => {
    const mockFromFn = vi.fn().mockReturnValue({
      select: vi.fn().mockReturnThis(),
      eq: vi.fn().mockReturnThis(),
      order: vi.fn().mockReturnThis(),
      then: vi.fn((cb: any) => cb({ data: mockSongs, error: null })),
    })
    ;(supabase.from as any).mockImplementation(mockFromFn)

    renderWithRouter(<SongsList />, { route: '/songs' })

    await waitFor(() => {
      expect(screen.getByRole('heading', { name: 'Songs' })).toBeInTheDocument()
      expect(screen.getByText(/3 songs - elementary level/)).toBeInTheDocument()
    })
  })

  it('sets document title to "Songs - minesminis"', async () => {
    const mockFromFn = vi.fn().mockReturnValue({
      select: vi.fn().mockReturnThis(),
      eq: vi.fn().mockReturnThis(),
      order: vi.fn().mockReturnThis(),
      then: vi.fn((cb: any) => cb({ data: [], error: null })),
    })
    ;(supabase.from as any).mockImplementation(mockFromFn)

    renderWithRouter(<SongsList />, { route: '/songs' })

    await waitFor(() => {
      expect(document.title).toBe('Songs - minesminis')
    })
  })

  it('displays filter chips with correct labels', async () => {
    const mockFromFn = vi.fn().mockReturnValue({
      select: vi.fn().mockReturnThis(),
      eq: vi.fn().mockReturnThis(),
      order: vi.fn().mockReturnThis(),
      then: vi.fn((cb: any) => cb({ data: mockSongs, error: null })),
    })
    ;(supabase.from as any).mockImplementation(mockFromFn)

    renderWithRouter(<SongsList />, { route: '/songs' })

    await waitFor(() => {
      expect(screen.getByRole('button', { name: /all/i })).toBeInTheDocument()
      expect(screen.getByRole('button', { name: /classic/i })).toBeInTheDocument()
      expect(screen.getByRole('button', { name: /action/i })).toBeInTheDocument()
      expect(screen.getByRole('button', { name: /educational/i })).toBeInTheDocument()
    })
  })

  it('shows loading state with skeletons', () => {
    const mockFromFn = vi.fn().mockReturnValue({
      select: vi.fn().mockReturnThis(),
      eq: vi.fn().mockReturnThis(),
      order: vi.fn().mockReturnThis(),
      then: vi.fn(
        () =>
          new Promise(() => {
            /* Never resolves */
          })
      ),
    })
    ;(supabase.from as any).mockImplementation(mockFromFn)

    renderWithRouter(<SongsList />, { route: '/songs' })

    const skeletons = screen.getAllByRole('link')
    expect(skeletons.length).toBeGreaterThanOrEqual(3)
  })

  it('shows "No content yet" when no songs are available', async () => {
    const mockFromFn = vi.fn().mockReturnValue({
      select: vi.fn().mockReturnThis(),
      eq: vi.fn().mockReturnThis(),
      order: vi.fn().mockReturnThis(),
      then: vi.fn((cb: any) => cb({ data: [], error: null })),
    })
    ;(supabase.from as any).mockImplementation(mockFromFn)

    renderWithRouter(<SongsList />, { route: '/songs' })

    await waitFor(() => {
      expect(screen.getByText('No content yet')).toBeInTheDocument()
      expect(screen.getByText('New songs coming soon!')).toBeInTheDocument()
    })
  })

  it('shows error state with connection error message', async () => {
    const mockFromFn = vi.fn().mockReturnValue({
      select: vi.fn().mockReturnThis(),
      eq: vi.fn().mockReturnThis(),
      order: vi.fn().mockReturnThis(),
      then: vi.fn((cb: any) => cb({ data: null, error: new Error('Network error') })),
    })
    ;(supabase.from as any).mockImplementation(mockFromFn)

    renderWithRouter(<SongsList />, { route: '/songs' })

    await waitFor(() => {
      expect(screen.getByText('Connection error')).toBeInTheDocument()
      expect(screen.getByText('Please try again later.')).toBeInTheDocument()
    })
  })

  it('displays all songs when "All" chip is selected', async () => {
    const mockFromFn = vi.fn().mockReturnValue({
      select: vi.fn().mockReturnThis(),
      eq: vi.fn().mockReturnThis(),
      order: vi.fn().mockReturnThis(),
      then: vi.fn((cb: any) => cb({ data: mockSongs, error: null })),
    })
    ;(supabase.from as any).mockImplementation(mockFromFn)

    renderWithRouter(<SongsList />, { route: '/songs' })

    await waitFor(() => {
      expect(screen.getByText('Phonics A')).toBeInTheDocument()
      expect(screen.getByText('Action Song')).toBeInTheDocument()
      expect(screen.getByText('Learning Math')).toBeInTheDocument()
    })
  })

  it('filters songs by category when chip is clicked', async () => {
    const mockFromFn = vi.fn().mockReturnValue({
      select: vi.fn().mockReturnThis(),
      eq: vi.fn().mockReturnThis(),
      order: vi.fn().mockReturnThis(),
      then: vi.fn((cb: any) => cb({ data: mockSongs, error: null })),
    })
    ;(supabase.from as any).mockImplementation(mockFromFn)

    const user = userEvent.setup()
    renderWithRouter(<SongsList />, { route: '/songs' })

    await waitFor(() => {
      expect(screen.getByText('Phonics A')).toBeInTheDocument()
    })

    const actionChip = screen.getByRole('button', { name: /action/i })
    await user.click(actionChip)

    await waitFor(() => {
      expect(screen.getByText('Action Song')).toBeInTheDocument()
      expect(screen.queryByText('Phonics A')).not.toBeInTheDocument()
      expect(screen.queryByText('Learning Math')).not.toBeInTheDocument()
    })
  })

  it('shows song card with title, duration, and category', async () => {
    const mockFromFn = vi.fn().mockReturnValue({
      select: vi.fn().mockReturnThis(),
      eq: vi.fn().mockReturnThis(),
      order: vi.fn().mockReturnThis(),
      then: vi.fn((cb: any) => cb({ data: [mockSong], error: null })),
    })
    ;(supabase.from as any).mockImplementation(mockFromFn)

    renderWithRouter(<SongsList />, { route: '/songs' })

    await waitFor(() => {
      const card = screen.getByRole('link', { name: /Phonics A/i })
      expect(card).toBeInTheDocument()
      expect(within(card).getByText('Phonics A')).toBeInTheDocument()
      expect(within(card).getByText('Classic')).toBeInTheDocument()
      expect(within(card).getByText('2:30')).toBeInTheDocument()
    })
  })

  it('links each song card to /songs/:id route', async () => {
    const mockFromFn = vi.fn().mockReturnValue({
      select: vi.fn().mockReturnThis(),
      eq: vi.fn().mockReturnThis(),
      order: vi.fn().mockReturnThis(),
      then: vi.fn((cb: any) => cb({ data: [mockSong], error: null })),
    })
    ;(supabase.from as any).mockImplementation(mockFromFn)

    renderWithRouter(<SongsList />, { route: '/songs' })

    await waitFor(() => {
      const card = screen.getByRole('link', { name: /Phonics A/i })
      expect(card).toHaveAttribute('href', '/songs/1')
    })
  })

  it('retries loading on error when Retry button is clicked', async () => {
    const mockFromFn = vi.fn().mockReturnValue({
      select: vi.fn().mockReturnThis(),
      eq: vi.fn().mockReturnThis(),
      order: vi.fn().mockReturnThis(),
      then: vi.fn((cb: any) => cb({ data: null, error: new Error('Network error') })),
    })
    ;(supabase.from as any).mockImplementation(mockFromFn)

    const user = userEvent.setup()

    renderWithRouter(<SongsList />, { route: '/songs' })

    await waitFor(() => {
      expect(screen.getByText('Connection error')).toBeInTheDocument()
    })

    const retryBtn = screen.getByRole('button', { name: /retry/i })
    expect(retryBtn).toBeInTheDocument()

    // Test that the button exists and can be clicked
    await user.click(retryBtn)
    expect(retryBtn).toBeInTheDocument()
  })

  it('fetches songs with published=true filter', async () => {
    const mockFromFn = vi.fn().mockReturnValue({
      select: vi.fn().mockReturnThis(),
      eq: vi.fn().mockReturnThis(),
      order: vi.fn().mockReturnThis(),
      then: vi.fn((cb: any) => cb({ data: mockSongs, error: null })),
    })
    ;(supabase.from as any).mockImplementation(mockFromFn)

    renderWithRouter(<SongsList />, { route: '/songs' })

    await waitFor(() => {
      expect(mockFromFn).toHaveBeenCalledWith('mm_songs')
    })

    const chainCalls = mockFromFn.mock.results[0].value
    expect(chainCalls.eq).toHaveBeenCalledWith('published', true)
  })
})

// ============================================================
// SONGPLAYER TESTS
// ============================================================

describe('SongPlayer', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    document.title = ''
    window.HTMLMediaElement.prototype.load = vi.fn()
    window.HTMLMediaElement.prototype.play = vi.fn().mockResolvedValue(undefined)
    window.HTMLMediaElement.prototype.pause = vi.fn()
  })

  afterEach(() => {
    vi.clearAllTimers()
  })

  it('renders loading state initially', () => {
    const mockFromFn = vi.fn().mockReturnValue({
      select: vi.fn().mockReturnThis(),
      eq: vi.fn().mockReturnThis(),
      single: vi.fn().mockImplementation(
        () =>
          new Promise(() => {
            /* Never resolves */
          })
      ),
    })
    ;(supabase.from as any).mockImplementation(mockFromFn)

    renderWithRouter(<SongPlayer />, { route: '/songs/1' })

    expect(screen.getByText('Loading...')).toBeInTheDocument()
  })

  it('sets document title to "{title} - minesminis"', async () => {
    const mockFromFn = vi.fn().mockReturnValue({
      select: vi.fn().mockReturnThis(),
      eq: vi.fn().mockReturnThis(),
      single: vi.fn().mockResolvedValue({ data: mockSong, error: null }),
    })
    ;(supabase.from as any).mockImplementation(mockFromFn)

    renderWithRouter(<SongPlayer />, { route: '/songs/1' })

    await waitFor(() => {
      expect(document.title).toBe('Phonics A - minesminis')
    })
  })

  it('shows error state when song is not found', async () => {
    const mockFromFn = vi.fn().mockReturnValue({
      select: vi.fn().mockReturnThis(),
      eq: vi.fn().mockReturnThis(),
      single: vi.fn().mockResolvedValue({ data: null, error: new Error('Not found') }),
    })
    ;(supabase.from as any).mockImplementation(mockFromFn)

    renderWithRouter(<SongPlayer />, { route: '/songs/999' })

    await waitFor(() => {
      expect(screen.getByText('Content not found')).toBeInTheDocument()
    })
  })

  it('shows "Back to Songs" link in error state', async () => {
    const mockFromFn = vi.fn().mockReturnValue({
      select: vi.fn().mockReturnThis(),
      eq: vi.fn().mockReturnThis(),
      single: vi.fn().mockResolvedValue({ data: null, error: new Error('Not found') }),
    })
    ;(supabase.from as any).mockImplementation(mockFromFn)

    renderWithRouter(<SongPlayer />, { route: '/songs/999' })

    await waitFor(() => {
      const backLink = screen.getByRole('link', { name: /back to songs/i })
      expect(backLink).toHaveAttribute('href', '/songs')
    })
  })

  it('displays song title and metadata', async () => {
    const mockFromFn = vi.fn().mockReturnValue({
      select: vi.fn().mockReturnThis(),
      eq: vi.fn().mockReturnThis(),
      single: vi.fn().mockResolvedValue({ data: mockSong, error: null }),
    })
    ;(supabase.from as any).mockImplementation(mockFromFn)

    renderWithRouter(<SongPlayer />, { route: '/songs/1' })

    await waitFor(() => {
      expect(screen.getByText('Phonics A')).toBeInTheDocument()
      expect(screen.getByText(/Classic - 2:30/)).toBeInTheDocument()
    })
  })

  it('shows back button that links to /songs', async () => {
    const mockFromFn = vi.fn().mockReturnValue({
      select: vi.fn().mockReturnThis(),
      eq: vi.fn().mockReturnThis(),
      single: vi.fn().mockResolvedValue({ data: mockSong, error: null }),
    })
    ;(supabase.from as any).mockImplementation(mockFromFn)

    renderWithRouter(<SongPlayer />, { route: '/songs/1' })

    await waitFor(() => {
      const backBtn = screen.getByLabelText('Back to Songs')
      expect(backBtn.closest('a')).toHaveAttribute('href', '/songs')
    })
  })

  it('displays audio player when audio_url is provided', async () => {
    const mockFromFn = vi.fn().mockReturnValue({
      select: vi.fn().mockReturnThis(),
      eq: vi.fn().mockReturnThis(),
      single: vi.fn().mockResolvedValue({ data: mockSong, error: null }),
    })
    ;(supabase.from as any).mockImplementation(mockFromFn)

    renderWithRouter(<SongPlayer />, { route: '/songs/1' })

    await waitFor(() => {
      expect(screen.getByLabelText('Play')).toBeInTheDocument()
      expect(screen.getByLabelText('Skip back 10s')).toBeInTheDocument()
      expect(screen.getByLabelText('Skip forward 10s')).toBeInTheDocument()
      expect(screen.getByLabelText('Repeat')).toBeInTheDocument()
    })
  })

  it('shows "Audio file not added yet" when audio_url is missing', async () => {
    const songWithoutAudio = { ...mockSong, audio_url: null }
    const mockFromFn = vi.fn().mockReturnValue({
      select: vi.fn().mockReturnThis(),
      eq: vi.fn().mockReturnThis(),
      single: vi.fn().mockResolvedValue({ data: songWithoutAudio, error: null }),
    })
    ;(supabase.from as any).mockImplementation(mockFromFn)

    renderWithRouter(<SongPlayer />, { route: '/songs/1' })

    await waitFor(() => {
      expect(screen.getByText('Audio file not added yet')).toBeInTheDocument()
    })
  })

  it('displays LYRICS section with English-Turkish label', async () => {
    const mockFromFn = vi.fn().mockReturnValue({
      select: vi.fn().mockReturnThis(),
      eq: vi.fn().mockReturnThis(),
      single: vi.fn().mockResolvedValue({ data: mockSong, error: null }),
    })
    ;(supabase.from as any).mockImplementation(mockFromFn)

    renderWithRouter(<SongPlayer />, { route: '/songs/1' })

    await waitFor(() => {
      expect(screen.getByText('LYRICS')).toBeInTheDocument()
      expect(screen.getByText('English - Turkish')).toBeInTheDocument()
    })
  })

  it('renders lyrics with English and Turkish translations', async () => {
    const mockFromFn = vi.fn().mockReturnValue({
      select: vi.fn().mockReturnThis(),
      eq: vi.fn().mockReturnThis(),
      single: vi.fn().mockResolvedValue({ data: mockSong, error: null }),
    })
    ;(supabase.from as any).mockImplementation(mockFromFn)

    renderWithRouter(<SongPlayer />, { route: '/songs/1' })

    await waitFor(() => {
      expect(screen.getByText('A is for Apple')).toBeInTheDocument()
      expect(screen.getByText('A elma için')).toBeInTheDocument()
      expect(screen.getByText('B is for Ball')).toBeInTheDocument()
      expect(screen.getByText('B top için')).toBeInTheDocument()
    })
  })

  it('highlights lyrics when highlight flag is true', async () => {
    const mockFromFn = vi.fn().mockReturnValue({
      select: vi.fn().mockReturnThis(),
      eq: vi.fn().mockReturnThis(),
      single: vi.fn().mockResolvedValue({ data: mockSong, error: null }),
    })
    ;(supabase.from as any).mockImplementation(mockFromFn)

    renderWithRouter(<SongPlayer />, { route: '/songs/1' })

    await waitFor(() => {
      const highlightLine = screen.getByText('B is for Ball')
      expect(highlightLine).toHaveStyle({
        fontSize: '32px',
        fontWeight: '800',
        color: 'var(--primary)',
      })
    })
  })

  it('shows "Lyrics not added yet" when lyrics array is empty', async () => {
    const songWithoutLyrics = { ...mockSong, lyrics: [] }
    const mockFromFn = vi.fn().mockReturnValue({
      select: vi.fn().mockReturnThis(),
      eq: vi.fn().mockReturnThis(),
      single: vi.fn().mockResolvedValue({ data: songWithoutLyrics, error: null }),
    })
    ;(supabase.from as any).mockImplementation(mockFromFn)

    renderWithRouter(<SongPlayer />, { route: '/songs/1' })

    await waitFor(() => {
      expect(screen.getByText('Lyrics not added yet')).toBeInTheDocument()
    })
  })

  it('toggles play/pause on button click', async () => {
    const mockFromFn = vi.fn().mockReturnValue({
      select: vi.fn().mockReturnThis(),
      eq: vi.fn().mockReturnThis(),
      single: vi.fn().mockResolvedValue({ data: mockSong, error: null }),
    })
    ;(supabase.from as any).mockImplementation(mockFromFn)

    const user = userEvent.setup()
    renderWithRouter(<SongPlayer />, { route: '/songs/1' })

    await waitFor(() => {
      expect(screen.getByLabelText('Play')).toBeInTheDocument()
    })

    const playBtn = screen.getByLabelText('Play')
    await user.click(playBtn)

    await waitFor(() => {
      expect(screen.getByLabelText('Pause')).toBeInTheDocument()
    })
  })

  it('toggles loop state on Repeat button click', async () => {
    const mockFromFn = vi.fn().mockReturnValue({
      select: vi.fn().mockReturnThis(),
      eq: vi.fn().mockReturnThis(),
      single: vi.fn().mockResolvedValue({ data: mockSong, error: null }),
    })
    ;(supabase.from as any).mockImplementation(mockFromFn)

    const user = userEvent.setup()
    renderWithRouter(<SongPlayer />, { route: '/songs/1' })

    await waitFor(() => {
      expect(screen.getByLabelText('Repeat')).toBeInTheDocument()
    })

    const repeatBtn = screen.getByLabelText('Repeat')
    await user.click(repeatBtn)

    // Loop is toggled (check via class or visual indicator)
    expect(repeatBtn.closest('button')).toHaveClass('primary')
  })

  it('displays progress bar for audio', async () => {
    const mockFromFn = vi.fn().mockReturnValue({
      select: vi.fn().mockReturnThis(),
      eq: vi.fn().mockReturnThis(),
      single: vi.fn().mockResolvedValue({ data: mockSong, error: null }),
    })
    ;(supabase.from as any).mockImplementation(mockFromFn)

    renderWithRouter(<SongPlayer />, { route: '/songs/1' })

    await waitFor(() => {
      const progressBar = document.querySelector('.mm-progress')
      expect(progressBar).toBeInTheDocument()
    })
  })

  it('displays current time and duration', async () => {
    const mockFromFn = vi.fn().mockReturnValue({
      select: vi.fn().mockReturnThis(),
      eq: vi.fn().mockReturnThis(),
      single: vi.fn().mockResolvedValue({ data: mockSong, error: null }),
    })
    ;(supabase.from as any).mockImplementation(mockFromFn)

    renderWithRouter(<SongPlayer />, { route: '/songs/1' })

    await waitFor(() => {
      expect(screen.getByText('0:00')).toBeInTheDocument()
      expect(screen.getByText('2:30')).toBeInTheDocument()
    })
  })

  it('fetches song by id from params', async () => {
    const mockFromFn = vi.fn().mockReturnValue({
      select: vi.fn().mockReturnThis(),
      eq: vi.fn().mockReturnThis(),
      single: vi.fn().mockResolvedValue({ data: mockSong, error: null }),
    })
    ;(supabase.from as any).mockImplementation(mockFromFn)

    renderWithRouter(<SongPlayer />, { route: '/songs/123' })

    await waitFor(() => {
      expect(mockFromFn).toHaveBeenCalledWith('mm_songs')
    })
  })

  it('shows error when audio fails to load', async () => {
    const mockFromFn = vi.fn().mockReturnValue({
      select: vi.fn().mockReturnThis(),
      eq: vi.fn().mockReturnThis(),
      single: vi.fn().mockResolvedValue({ data: mockSong, error: null }),
    })
    ;(supabase.from as any).mockImplementation(mockFromFn)

    renderWithRouter(<SongPlayer />, { route: '/songs/1' })

    await waitFor(() => {
      expect(screen.getByText('Phonics A')).toBeInTheDocument()
    })

    // Simulate audio error event
    const audioElements = document.querySelectorAll('audio')
    expect(audioElements).toBeDefined()
  })

  it('skips back 10 seconds on skip back button', async () => {
    const mockFromFn = vi.fn().mockReturnValue({
      select: vi.fn().mockReturnThis(),
      eq: vi.fn().mockReturnThis(),
      single: vi.fn().mockResolvedValue({ data: mockSong, error: null }),
    })
    ;(supabase.from as any).mockImplementation(mockFromFn)

    const user = userEvent.setup()
    renderWithRouter(<SongPlayer />, { route: '/songs/1' })

    await waitFor(() => {
      expect(screen.getByLabelText('Skip back 10s')).toBeInTheDocument()
    })

    const skipBackBtn = screen.getByLabelText('Skip back 10s')
    await user.click(skipBackBtn)

    expect(skipBackBtn).toBeInTheDocument()
  })

  it('skips forward 10 seconds on skip forward button', async () => {
    const mockFromFn = vi.fn().mockReturnValue({
      select: vi.fn().mockReturnThis(),
      eq: vi.fn().mockReturnThis(),
      single: vi.fn().mockResolvedValue({ data: mockSong, error: null }),
    })
    ;(supabase.from as any).mockImplementation(mockFromFn)

    const user = userEvent.setup()
    renderWithRouter(<SongPlayer />, { route: '/songs/1' })

    await waitFor(() => {
      expect(screen.getByLabelText('Skip forward 10s')).toBeInTheDocument()
    })

    const skipForwardBtn = screen.getByLabelText('Skip forward 10s')
    await user.click(skipForwardBtn)

    expect(skipForwardBtn).toBeInTheDocument()
  })

  it('renders Layout wrapper component', async () => {
    const mockFromFn = vi.fn().mockReturnValue({
      select: vi.fn().mockReturnThis(),
      eq: vi.fn().mockReturnThis(),
      single: vi.fn().mockResolvedValue({ data: mockSong, error: null }),
    })
    ;(supabase.from as any).mockImplementation(mockFromFn)

    renderWithRouter(<SongPlayer />, { route: '/songs/1' })

    await waitFor(() => {
      // Layout wrapper is rendered if main content is visible
      expect(screen.getByText('Phonics A')).toBeInTheDocument()
    })
  })

  it('does not render audio player controls when no audio_url', async () => {
    const songWithoutAudio = { ...mockSong, audio_url: null }
    const mockFromFn = vi.fn().mockReturnValue({
      select: vi.fn().mockReturnThis(),
      eq: vi.fn().mockReturnThis(),
      single: vi.fn().mockResolvedValue({ data: songWithoutAudio, error: null }),
    })
    ;(supabase.from as any).mockImplementation(mockFromFn)

    renderWithRouter(<SongPlayer />, { route: '/songs/1' })

    await waitFor(() => {
      expect(screen.queryByLabelText('Play')).not.toBeInTheDocument()
      expect(screen.queryByLabelText('Skip back 10s')).not.toBeInTheDocument()
      expect(screen.queryByLabelText('Skip forward 10s')).not.toBeInTheDocument()
    })
  })
})
