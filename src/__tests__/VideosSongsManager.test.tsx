import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router-dom'
import VideosManager from '../pages/admin/VideosManager'
import SongsManager from '../pages/admin/SongsManager'
import * as supabaseModule from '../lib/supabase'

vi.mock('react-hot-toast', () => ({
  default: {
    error: vi.fn(),
    success: vi.fn(),
  },
}))

vi.mock('../lib/supabase', () => {
  const createMockChain = () => ({
    select: vi.fn().mockReturnThis(),
    insert: vi.fn().mockResolvedValue({ error: null }),
    update: vi.fn().mockReturnThis(),
    delete: vi.fn().mockReturnThis(),
    eq: vi.fn().mockResolvedValue({ error: null }),
    order: vi.fn().mockResolvedValue({ data: [], error: null }),
  })

  return {
    supabase: {
      from: vi.fn(() => createMockChain()),
    },
  }
})

import toast from 'react-hot-toast'

const mockVideoData = {
  id: 'vid-1',
  title: 'ABC Song',
  cover_kind: 'abc',
  duration: '3:20',
  category: 'alphabet',
  youtube_url: 'https://youtube.com/watch?v=test',
  lyrics_en: 'A B C D E F G',
  lyrics_tr: 'A B C D E F G',
  published: false,
  created_at: '2026-04-30T10:00:00',
}

const mockSongData = {
  id: 'song-1',
  title: 'Twinkle Song',
  cover_kind: 'star',
  duration: '2:30',
  category: 'nursery',
  audio_url: 'https://example.com/audio.mp3',
  lyrics: [
    { en: 'Twinkle twinkle', tr: 'Parla parla', highlight: false },
    { en: 'Little star', tr: 'Kucuk yildiz', highlight: true },
  ],
  published: true,
  created_at: '2026-04-30T09:00:00',
}

describe('VideosManager', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    window.confirm = vi.fn(() => true)
  })

  afterEach(() => {
    vi.clearAllMocks()
  })

  it('renders Videos heading and New Video button', async () => {
    const mockFrom = supabaseModule.supabase.from as any
    mockFrom.mockReturnValue({
      select: vi.fn().mockReturnValue({
        order: vi.fn().mockResolvedValue({ data: [], error: null }),
      }),
    })

    render(
      <MemoryRouter>
        <VideosManager />
      </MemoryRouter>
    )

    expect(screen.getByText('Videos')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /New Video/i })).toBeInTheDocument()
  })

  it('shows loading state initially', () => {
    const mockFrom = supabaseModule.supabase.from as any
    mockFrom.mockReturnValue({
      select: vi.fn().mockReturnValue({
        order: vi.fn().mockImplementation(() => new Promise(() => {})), // Never resolves
      }),
    })

    render(
      <MemoryRouter>
        <VideosManager />
      </MemoryRouter>
    )

    expect(screen.getByText('Loading...')).toBeInTheDocument()
  })

  it('shows empty state when no videos', async () => {
    const mockFrom = supabaseModule.supabase.from as any
    mockFrom.mockReturnValue({
      select: vi.fn().mockReturnValue({
        order: vi.fn().mockResolvedValue({ data: [], error: null }),
      }),
    })

    render(
      <MemoryRouter>
        <VideosManager />
      </MemoryRouter>
    )

    await waitFor(() => {
      expect(screen.getByText('No videos yet. Add a new one.')).toBeInTheDocument()
    })
  })

  it('loads and displays videos in table', async () => {
    const mockFrom = supabaseModule.supabase.from as any
    mockFrom.mockReturnValue({
      select: vi.fn().mockReturnValue({
        order: vi.fn().mockResolvedValue({ data: [mockVideoData], error: null }),
      }),
    })

    render(
      <MemoryRouter>
        <VideosManager />
      </MemoryRouter>
    )

    await waitFor(() => {
      expect(screen.getByText('ABC Song')).toBeInTheDocument()
      expect(screen.getByText('3:20')).toBeInTheDocument()
    })
  })

  it('shows Draft status for unpublished videos', async () => {
    const mockFrom = supabaseModule.supabase.from as any
    mockFrom.mockReturnValue({
      select: vi.fn().mockReturnValue({
        order: vi.fn().mockResolvedValue({ data: [mockVideoData], error: null }),
      }),
    })

    render(
      <MemoryRouter>
        <VideosManager />
      </MemoryRouter>
    )

    await waitFor(() => {
      expect(screen.getByText('Draft')).toBeInTheDocument()
    })
  })

  it('shows Published status for published videos', async () => {
    const publishedVideo = { ...mockVideoData, published: true }
    const mockFrom = supabaseModule.supabase.from as any
    mockFrom.mockReturnValue({
      select: vi.fn().mockReturnValue({
        order: vi.fn().mockResolvedValue({ data: [publishedVideo], error: null }),
      }),
    })

    render(
      <MemoryRouter>
        <VideosManager />
      </MemoryRouter>
    )

    await waitFor(() => {
      expect(screen.getByText('Published')).toBeInTheDocument()
    })
  })

  it('opens editor when clicking New Video', async () => {
    const mockFrom = supabaseModule.supabase.from as any
    mockFrom.mockReturnValue({
      select: vi.fn().mockReturnValue({
        order: vi.fn().mockResolvedValue({ data: [], error: null }),
      }),
    })

    render(
      <MemoryRouter>
        <VideosManager />
      </MemoryRouter>
    )

    await waitFor(() => {
      const newBtn = screen.getByRole('button', { name: /New Video/i })
      fireEvent.click(newBtn)
    })

    expect(screen.getByText('New Video')).toBeInTheDocument()
    expect(screen.getByText('Title')).toBeInTheDocument()
  })

  it('validates title on save - empty title shows error', async () => {
    const mockFrom = supabaseModule.supabase.from as any
    mockFrom.mockReturnValue({
      select: vi.fn().mockReturnValue({
        order: vi.fn().mockResolvedValue({ data: [], error: null }),
      }),
    })

    render(
      <MemoryRouter>
        <VideosManager />
      </MemoryRouter>
    )

    await waitFor(() => {
      fireEvent.click(screen.getByRole('button', { name: /New Video/i }))
    })

    const saveBtn = screen.getByRole('button', { name: /Save/i })
    fireEvent.click(saveBtn)

    expect(toast.error).toHaveBeenCalledWith('Title is required')
  })

  it('saves new video with title', async () => {
    const mockChain = {
      select: vi.fn().mockReturnThis(),
      order: vi.fn().mockResolvedValue({ data: [], error: null }),
      insert: vi.fn().mockResolvedValue({ error: null }),
    }

    const mockFrom = supabaseModule.supabase.from as any
    mockFrom.mockReturnValue(mockChain)

    const user = userEvent.setup()

    render(
      <MemoryRouter>
        <VideosManager />
      </MemoryRouter>
    )

    await waitFor(() => {
      fireEvent.click(screen.getByRole('button', { name: /New Video/i }))
    })

    const titleInputs = screen.getAllByDisplayValue('')
    await user.type(titleInputs[0], 'New Video')

    const saveBtn = screen.getByRole('button', { name: /Save/i })
    fireEvent.click(saveBtn)

    await waitFor(() => {
      expect(mockChain.insert).toHaveBeenCalled()
      expect(toast.success).toHaveBeenCalledWith('Saved')
    })
  })

  it('edits existing video', async () => {
    const mockChain = {
      select: vi.fn().mockReturnThis(),
      order: vi.fn().mockResolvedValue({ data: [mockVideoData], error: null }),
      update: vi.fn().mockReturnThis(),
      eq: vi.fn().mockResolvedValue({ error: null }),
    }

    const mockFrom = supabaseModule.supabase.from as any
    mockFrom.mockReturnValue(mockChain)

    const user = userEvent.setup()

    render(
      <MemoryRouter>
        <VideosManager />
      </MemoryRouter>
    )

    await waitFor(() => {
      const editBtn = screen.getAllByTitle('Edit')[0]
      fireEvent.click(editBtn)
    })

    expect(screen.getByText('Edit Video')).toBeInTheDocument()

    const titleInput = screen.getByDisplayValue('ABC Song')
    await user.clear(titleInput)
    await user.type(titleInput, 'Updated ABC Song')

    const saveBtn = screen.getByRole('button', { name: /Save/i })
    fireEvent.click(saveBtn)

    await waitFor(() => {
      expect(mockChain.update).toHaveBeenCalled()
      expect(mockChain.eq).toHaveBeenCalledWith('id', 'vid-1')
    })
  })

  it('deletes video after confirmation', async () => {
    const mockChain = {
      select: vi.fn().mockReturnThis(),
      order: vi.fn().mockResolvedValue({ data: [mockVideoData], error: null }),
      delete: vi.fn().mockReturnThis(),
      eq: vi.fn().mockResolvedValue({ error: null }),
    }

    const mockFrom = supabaseModule.supabase.from as any
    mockFrom.mockReturnValue(mockChain)

    render(
      <MemoryRouter>
        <VideosManager />
      </MemoryRouter>
    )

    await waitFor(() => {
      const deleteBtn = screen.getAllByTitle('Delete')[0]
      fireEvent.click(deleteBtn)
    })

    expect(window.confirm).toHaveBeenCalledWith('Are you sure you want to delete this?')

    await waitFor(() => {
      expect(mockChain.delete).toHaveBeenCalled()
    })
  })

  it('cancels delete if user declines confirmation', () => {
    window.confirm = vi.fn(() => false)

    const mockChain = {
      select: vi.fn().mockReturnThis(),
      order: vi.fn().mockResolvedValue({ data: [mockVideoData], error: null }),
      delete: vi.fn().mockReturnThis(),
      eq: vi.fn().mockResolvedValue({ error: null }),
    }

    const mockFrom = supabaseModule.supabase.from as any
    mockFrom.mockReturnValue(mockChain)

    render(
      <MemoryRouter>
        <VideosManager />
      </MemoryRouter>
    )

    waitFor(() => {
      const deleteBtn = screen.getAllByTitle('Delete')[0]
      fireEvent.click(deleteBtn)
    })

    expect(mockChain.delete).not.toHaveBeenCalled()
  })

  it('toggles video publish status', async () => {
    const mockChain = {
      select: vi.fn().mockReturnThis(),
      order: vi.fn().mockResolvedValue({ data: [mockVideoData], error: null }),
      update: vi.fn().mockReturnThis(),
      eq: vi.fn().mockResolvedValue({ error: null }),
    }

    const mockFrom = supabaseModule.supabase.from as any
    mockFrom.mockReturnValue(mockChain)

    render(
      <MemoryRouter>
        <VideosManager />
      </MemoryRouter>
    )

    await waitFor(() => {
      const publishBtn = screen.getAllByTitle('Publish')[0]
      fireEvent.click(publishBtn)
    })

    expect(mockChain.update).toHaveBeenCalledWith({ published: true })
  })

  it('cancels editing and returns to list', async () => {
    const mockFrom = supabaseModule.supabase.from as any
    mockFrom.mockReturnValue({
      select: vi.fn().mockReturnValue({
        order: vi.fn().mockResolvedValue({ data: [], error: null }),
      }),
    })

    render(
      <MemoryRouter>
        <VideosManager />
      </MemoryRouter>
    )

    await waitFor(() => {
      fireEvent.click(screen.getByRole('button', { name: /New Video/i }))
    })

    expect(screen.getByRole('heading', { name: /New Video/i })).toBeInTheDocument()

    const cancelBtn = screen.getByRole('button', { name: /Cancel/i })
    fireEvent.click(cancelBtn)

    expect(screen.getByText('Videos')).toBeInTheDocument()
    expect(screen.queryByRole('heading', { name: /New Video/i })).not.toBeInTheDocument()
  })

  it('shows error toast on save failure', async () => {
    const mockChain = {
      select: vi.fn().mockReturnThis(),
      order: vi.fn().mockResolvedValue({ data: [], error: null }),
      insert: vi.fn().mockResolvedValue({ error: new Error('DB error') }),
    }

    const mockFrom = supabaseModule.supabase.from as any
    mockFrom.mockReturnValue(mockChain)

    const user = userEvent.setup()

    render(
      <MemoryRouter>
        <VideosManager />
      </MemoryRouter>
    )

    await waitFor(() => {
      fireEvent.click(screen.getByRole('button', { name: /New Video/i }))
    })

    const titleInputs = screen.getAllByDisplayValue('')
    await user.type(titleInputs[0], 'New Video')

    const saveBtn = screen.getByRole('button', { name: /Save/i })
    fireEvent.click(saveBtn)

    await waitFor(() => {
      expect(toast.error).toHaveBeenCalled()
    })
  })
})

describe('SongsManager', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    window.confirm = vi.fn(() => true)
  })

  afterEach(() => {
    vi.clearAllMocks()
  })

  it('renders Songs heading and New Song button', async () => {
    const mockFrom = supabaseModule.supabase.from as any
    mockFrom.mockReturnValue({
      select: vi.fn().mockReturnValue({
        order: vi.fn().mockResolvedValue({ data: [], error: null }),
      }),
    })

    render(
      <MemoryRouter>
        <SongsManager />
      </MemoryRouter>
    )

    expect(screen.getByText('Songs')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /New Song/i })).toBeInTheDocument()
  })

  it('shows loading state initially', () => {
    const mockFrom = supabaseModule.supabase.from as any
    mockFrom.mockReturnValue({
      select: vi.fn().mockReturnValue({
        order: vi.fn().mockImplementation(() => new Promise(() => {})), // Never resolves
      }),
    })

    render(
      <MemoryRouter>
        <SongsManager />
      </MemoryRouter>
    )

    expect(screen.getByText('Loading...')).toBeInTheDocument()
  })

  it('shows empty state when no songs', async () => {
    const mockFrom = supabaseModule.supabase.from as any
    mockFrom.mockReturnValue({
      select: vi.fn().mockReturnValue({
        order: vi.fn().mockResolvedValue({ data: [], error: null }),
      }),
    })

    render(
      <MemoryRouter>
        <SongsManager />
      </MemoryRouter>
    )

    await waitFor(() => {
      expect(screen.getByText('No songs yet. Add a new one.')).toBeInTheDocument()
    })
  })

  it('loads and displays songs in table', async () => {
    const mockFrom = supabaseModule.supabase.from as any
    mockFrom.mockReturnValue({
      select: vi.fn().mockReturnValue({
        order: vi.fn().mockResolvedValue({ data: [mockSongData], error: null }),
      }),
    })

    render(
      <MemoryRouter>
        <SongsManager />
      </MemoryRouter>
    )

    await waitFor(() => {
      expect(screen.getByText('Twinkle Song')).toBeInTheDocument()
      expect(screen.getByText('2:30')).toBeInTheDocument()
    })
  })

  it('shows Published status for published songs', async () => {
    const mockFrom = supabaseModule.supabase.from as any
    mockFrom.mockReturnValue({
      select: vi.fn().mockReturnValue({
        order: vi.fn().mockResolvedValue({ data: [mockSongData], error: null }),
      }),
    })

    render(
      <MemoryRouter>
        <SongsManager />
      </MemoryRouter>
    )

    await waitFor(() => {
      expect(screen.getByText('Published')).toBeInTheDocument()
    })
  })

  it('opens editor when clicking New Song', async () => {
    const mockFrom = supabaseModule.supabase.from as any
    mockFrom.mockReturnValue({
      select: vi.fn().mockReturnValue({
        order: vi.fn().mockResolvedValue({ data: [], error: null }),
      }),
    })

    render(
      <MemoryRouter>
        <SongsManager />
      </MemoryRouter>
    )

    await waitFor(() => {
      const newBtn = screen.getByRole('button', { name: /New Song/i })
      fireEvent.click(newBtn)
    })

    expect(screen.getByText('New Song')).toBeInTheDocument()
    expect(screen.getByText('Title')).toBeInTheDocument()
  })

  it('validates title on save - empty title shows error', async () => {
    const mockFrom = supabaseModule.supabase.from as any
    mockFrom.mockReturnValue({
      select: vi.fn().mockReturnValue({
        order: vi.fn().mockResolvedValue({ data: [], error: null }),
      }),
    })

    render(
      <MemoryRouter>
        <SongsManager />
      </MemoryRouter>
    )

    await waitFor(() => {
      fireEvent.click(screen.getByRole('button', { name: /New Song/i }))
    })

    const saveBtn = screen.getByRole('button', { name: /Save/i })
    fireEvent.click(saveBtn)

    expect(toast.error).toHaveBeenCalledWith('Title is required')
  })

  it('saves new song with title', async () => {
    const mockChain = {
      select: vi.fn().mockReturnThis(),
      order: vi.fn().mockResolvedValue({ data: [], error: null }),
      insert: vi.fn().mockResolvedValue({ error: null }),
    }

    const mockFrom = supabaseModule.supabase.from as any
    mockFrom.mockReturnValue(mockChain)

    const user = userEvent.setup()

    render(
      <MemoryRouter>
        <SongsManager />
      </MemoryRouter>
    )

    await waitFor(() => {
      fireEvent.click(screen.getByRole('button', { name: /New Song/i }))
    })

    const titleInputs = screen.getAllByDisplayValue('')
    await user.type(titleInputs[0], 'New Song')

    const saveBtn = screen.getByRole('button', { name: /Save/i })
    fireEvent.click(saveBtn)

    await waitFor(() => {
      expect(mockChain.insert).toHaveBeenCalled()
      expect(toast.success).toHaveBeenCalledWith('Saved')
    })
  })

  it('adds lyric line to song', async () => {
    const mockFrom = supabaseModule.supabase.from as any
    mockFrom.mockReturnValue({
      select: vi.fn().mockReturnValue({
        order: vi.fn().mockResolvedValue({ data: [], error: null }),
      }),
    })

    render(
      <MemoryRouter>
        <SongsManager />
      </MemoryRouter>
    )

    await waitFor(() => {
      fireEvent.click(screen.getByRole('button', { name: /New Song/i }))
    })

    const addLineBtn = screen.getByRole('button', { name: /Add Line/i })
    fireEvent.click(addLineBtn)

    expect(screen.getByText('Lyrics (1)')).toBeInTheDocument()
    expect(screen.getByPlaceholderText('English')).toBeInTheDocument()
  })

  it('updates lyric line text', async () => {
    const mockFrom = supabaseModule.supabase.from as any
    mockFrom.mockReturnValue({
      select: vi.fn().mockReturnValue({
        order: vi.fn().mockResolvedValue({ data: [], error: null }),
      }),
    })

    const user = userEvent.setup()

    render(
      <MemoryRouter>
        <SongsManager />
      </MemoryRouter>
    )

    await waitFor(() => {
      fireEvent.click(screen.getByRole('button', { name: /New Song/i }))
    })

    fireEvent.click(screen.getByRole('button', { name: /Add Line/i }))

    const englishInput = screen.getByPlaceholderText('English')
    await user.type(englishInput, 'Twinkle twinkle')

    expect(englishInput).toHaveValue('Twinkle twinkle')
  })

  it('toggles highlight checkbox on lyric', async () => {
    const mockFrom = supabaseModule.supabase.from as any
    mockFrom.mockReturnValue({
      select: vi.fn().mockReturnValue({
        order: vi.fn().mockResolvedValue({ data: [], error: null }),
      }),
    })

    render(
      <MemoryRouter>
        <SongsManager />
      </MemoryRouter>
    )

    await waitFor(() => {
      fireEvent.click(screen.getByRole('button', { name: /New Song/i }))
    })

    fireEvent.click(screen.getByRole('button', { name: /Add Line/i }))

    const checkbox = screen.getByRole('checkbox')
    fireEvent.click(checkbox)

    expect(checkbox).toBeChecked()
  })

  it('updates existing song with lyrics', async () => {
    const mockChain = {
      select: vi.fn().mockReturnThis(),
      order: vi.fn().mockResolvedValue({ data: [mockSongData], error: null }),
      update: vi.fn().mockReturnThis(),
      eq: vi.fn().mockResolvedValue({ error: null }),
    }

    const mockFrom = supabaseModule.supabase.from as any
    mockFrom.mockReturnValue(mockChain)

    render(
      <MemoryRouter>
        <SongsManager />
      </MemoryRouter>
    )

    await waitFor(() => {
      const editBtn = screen.getAllByTitle('Edit')[0]
      fireEvent.click(editBtn)
    })

    expect(screen.getByText('Edit Song')).toBeInTheDocument()
    expect(screen.getByText('Lyrics (2)')).toBeInTheDocument()

    const saveBtn = screen.getByRole('button', { name: /Save/i })
    fireEvent.click(saveBtn)

    await waitFor(() => {
      expect(mockChain.update).toHaveBeenCalled()
    })
  })

  it('deletes song after confirmation', async () => {
    const mockChain = {
      select: vi.fn().mockReturnThis(),
      order: vi.fn().mockResolvedValue({ data: [mockSongData], error: null }),
      delete: vi.fn().mockReturnThis(),
      eq: vi.fn().mockResolvedValue({ error: null }),
    }

    const mockFrom = supabaseModule.supabase.from as any
    mockFrom.mockReturnValue(mockChain)

    render(
      <MemoryRouter>
        <SongsManager />
      </MemoryRouter>
    )

    await waitFor(() => {
      const deleteBtn = screen.getAllByTitle('Delete')[0]
      fireEvent.click(deleteBtn)
    })

    expect(window.confirm).toHaveBeenCalledWith('Are you sure you want to delete this?')

    await waitFor(() => {
      expect(mockChain.delete).toHaveBeenCalled()
    })
  })

  it('toggles song publish status', async () => {
    const mockChain = {
      select: vi.fn().mockReturnThis(),
      order: vi.fn().mockResolvedValue({ data: [mockSongData], error: null }),
      update: vi.fn().mockReturnThis(),
      eq: vi.fn().mockResolvedValue({ error: null }),
    }

    const mockFrom = supabaseModule.supabase.from as any
    mockFrom.mockReturnValue(mockChain)

    render(
      <MemoryRouter>
        <SongsManager />
      </MemoryRouter>
    )

    await waitFor(() => {
      const unpublishBtn = screen.getAllByTitle('Unpublish')[0]
      fireEvent.click(unpublishBtn)
    })

    expect(mockChain.update).toHaveBeenCalledWith({ published: false })
  })

  it('cancels editing and returns to list', async () => {
    const mockFrom = supabaseModule.supabase.from as any
    mockFrom.mockReturnValue({
      select: vi.fn().mockReturnValue({
        order: vi.fn().mockResolvedValue({ data: [], error: null }),
      }),
    })

    render(
      <MemoryRouter>
        <SongsManager />
      </MemoryRouter>
    )

    await waitFor(() => {
      fireEvent.click(screen.getByRole('button', { name: /New Song/i }))
    })

    expect(screen.getByRole('heading', { name: /New Song/i })).toBeInTheDocument()

    const cancelBtn = screen.getByRole('button', { name: /Cancel/i })
    fireEvent.click(cancelBtn)

    expect(screen.getByText('Songs')).toBeInTheDocument()
    expect(screen.queryByRole('heading', { name: /New Song/i })).not.toBeInTheDocument()
  })

  it('shows error toast on save failure', async () => {
    const mockChain = {
      select: vi.fn().mockReturnThis(),
      order: vi.fn().mockResolvedValue({ data: [], error: null }),
      insert: vi.fn().mockResolvedValue({ error: new Error('DB error') }),
    }

    const mockFrom = supabaseModule.supabase.from as any
    mockFrom.mockReturnValue(mockChain)

    const user = userEvent.setup()

    render(
      <MemoryRouter>
        <SongsManager />
      </MemoryRouter>
    )

    await waitFor(() => {
      fireEvent.click(screen.getByRole('button', { name: /New Song/i }))
    })

    const titleInputs = screen.getAllByDisplayValue('')
    await user.type(titleInputs[0], 'New Song')

    const saveBtn = screen.getByRole('button', { name: /Save/i })
    fireEvent.click(saveBtn)

    await waitFor(() => {
      expect(toast.error).toHaveBeenCalled()
    })
  })

  it('displays multiple songs in table', async () => {
    const song2 = { ...mockSongData, id: 'song-2', title: 'Bingo' }
    const mockFrom = supabaseModule.supabase.from as any
    mockFrom.mockReturnValue({
      select: vi.fn().mockReturnValue({
        order: vi.fn().mockResolvedValue({ data: [mockSongData, song2], error: null }),
      }),
    })

    render(
      <MemoryRouter>
        <SongsManager />
      </MemoryRouter>
    )

    await waitFor(() => {
      expect(screen.getByText('Twinkle Song')).toBeInTheDocument()
      expect(screen.getByText('Bingo')).toBeInTheDocument()
    })
  })
})
