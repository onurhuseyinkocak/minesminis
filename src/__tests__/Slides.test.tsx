import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { render, screen, waitFor, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter, Route, Routes } from 'react-router-dom'
import SlidesList from '../pages/SlidesList'
import SlidePlayer from '../pages/SlidePlayer'
import { supabase } from '../lib/supabase'

// Mock Layout component to simplify testing
vi.mock('../components/Layout', () => ({
  default: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
}))

// Mock Cover component
vi.mock('../components/Cover', () => ({
  default: ({ kind }: { kind: string }) => <div data-testid={`cover-${kind}`} />,
}))

// ========== SlidesList Tests ==========

describe('SlidesList', () => {
  const mockSlides = [
    {
      id: '1',
      title: 'Numbers 1-10',
      level: 'Easy',
      category: 'Easy',
      slide_count: 10,
      cover_kind: 'rainbow',
      published: true,
      created_at: '2026-04-30',
      slides_data: [],
    },
    {
      id: '2',
      title: 'Colors and Shapes',
      level: 'Medium',
      category: 'Medium',
      slide_count: 8,
      cover_kind: 'ocean',
      published: true,
      created_at: '2026-04-29',
      slides_data: [],
    },
    {
      id: '3',
      title: 'Advanced Math',
      level: 'Medium',
      category: 'Medium',
      slide_count: 15,
      cover_kind: 'forest',
      published: true,
      created_at: '2026-04-28',
      slides_data: [],
    },
  ]

  beforeEach(() => {
    vi.clearAllMocks()
    document.title = ''
  })

  afterEach(() => {
    vi.clearAllMocks()
  })

  it('renders SlidesList with Layout wrapper', () => {
    const mockChain = {
      select: vi.fn().mockReturnThis(),
      eq: vi.fn().mockReturnThis(),
      order: vi.fn().mockReturnThis(),
      then: vi.fn((cb: any) => Promise.resolve(cb({ data: [], error: null }))),
    }
    ;(supabase.from as any).mockReturnValue(mockChain)

    render(
      <MemoryRouter>
        <SlidesList />
      </MemoryRouter>
    )

    expect(screen.getByText('Slides')).toBeInTheDocument()
  })

  it('sets document title to "Slides - minesminis"', async () => {
    const mockChain = {
      select: vi.fn().mockReturnThis(),
      eq: vi.fn().mockReturnThis(),
      order: vi.fn().mockReturnThis(),
      then: vi.fn((cb: any) => Promise.resolve(cb({ data: [], error: null }))),
    }
    ;(supabase.from as any).mockReturnValue(mockChain)

    render(
      <MemoryRouter>
        <SlidesList />
      </MemoryRouter>
    )

    await waitFor(() => {
      expect(document.title).toBe('Slides - minesminis')
    })
  })

  it('shows loading state initially', () => {
    const mockChain = {
      select: vi.fn().mockReturnThis(),
      eq: vi.fn().mockReturnThis(),
      order: vi.fn().mockReturnThis(),
      then: vi.fn(() => new Promise(() => {})), // Never resolves
    }
    ;(supabase.from as any).mockReturnValue(mockChain)

    render(
      <MemoryRouter>
        <SlidesList />
      </MemoryRouter>
    )

    const skeletons = document.querySelectorAll('.mm-card')
    expect(skeletons.length).toBeGreaterThan(0)
  })

  it('displays slides with all filter active', async () => {
    const mockChain = {
      select: vi.fn().mockReturnThis(),
      eq: vi.fn().mockReturnThis(),
      order: vi.fn().mockReturnThis(),
      then: vi.fn((cb: any) => Promise.resolve(cb({ data: mockSlides, error: null }))),
    }
    ;(supabase.from as any).mockReturnValue(mockChain)

    render(
      <MemoryRouter>
        <SlidesList />
      </MemoryRouter>
    )

    await waitFor(() => {
      expect(screen.getByText('Numbers 1-10')).toBeInTheDocument()
      expect(screen.getByText('Colors and Shapes')).toBeInTheDocument()
      expect(screen.getByText('Advanced Math')).toBeInTheDocument()
    })

    expect(mockChain.select).toHaveBeenCalledWith('*')
    expect(mockChain.eq).toHaveBeenCalledWith('published', true)
  })

  it('filters slides by Easy level', async () => {
    const mockChain = {
      select: vi.fn().mockReturnThis(),
      eq: vi.fn().mockReturnThis(),
      order: vi.fn().mockReturnThis(),
      then: vi.fn((cb: any) => Promise.resolve(cb({ data: mockSlides, error: null }))),
    }
    ;(supabase.from as any).mockReturnValue(mockChain)

    render(
      <MemoryRouter>
        <SlidesList />
      </MemoryRouter>
    )

    await waitFor(() => {
      expect(screen.getByText('Numbers 1-10')).toBeInTheDocument()
    })

    const easyChip = screen.getByRole('button', { name: /Easy/i })
    await userEvent.click(easyChip)

    await waitFor(() => {
      expect(screen.getByText('Numbers 1-10')).toBeInTheDocument()
      expect(screen.queryByText('Colors and Shapes')).not.toBeInTheDocument()
      expect(screen.queryByText('Advanced Math')).not.toBeInTheDocument()
    })
  })

  it('filters slides by Medium level', async () => {
    const mockChain = {
      select: vi.fn().mockReturnThis(),
      eq: vi.fn().mockReturnThis(),
      order: vi.fn().mockReturnThis(),
      then: vi.fn((cb: any) => Promise.resolve(cb({ data: mockSlides, error: null }))),
    }
    ;(supabase.from as any).mockReturnValue(mockChain)

    render(
      <MemoryRouter>
        <SlidesList />
      </MemoryRouter>
    )

    await waitFor(() => {
      expect(screen.getByText('Numbers 1-10')).toBeInTheDocument()
    })

    const mediumChip = screen.getByRole('button', { name: /Medium/i })
    await userEvent.click(mediumChip)

    await waitFor(() => {
      expect(screen.queryByText('Numbers 1-10')).not.toBeInTheDocument()
      expect(screen.getByText('Colors and Shapes')).toBeInTheDocument()
      expect(screen.getByText('Advanced Math')).toBeInTheDocument()
    })
  })

  it('shows "No content yet" when empty', async () => {
    const mockChain = {
      select: vi.fn().mockReturnThis(),
      eq: vi.fn().mockReturnThis(),
      order: vi.fn().mockReturnThis(),
      then: vi.fn((cb: any) => Promise.resolve(cb({ data: [], error: null }))),
    }
    ;(supabase.from as any).mockReturnValue(mockChain)

    render(
      <MemoryRouter>
        <SlidesList />
      </MemoryRouter>
    )

    await waitFor(() => {
      expect(screen.getByText('No content yet')).toBeInTheDocument()
      expect(screen.getByText('New slides coming soon!')).toBeInTheDocument()
    })
  })

  it('shows error state when fetch fails', async () => {
    const mockChain = {
      select: vi.fn().mockReturnThis(),
      eq: vi.fn().mockReturnThis(),
      order: vi.fn().mockReturnThis(),
      then: vi.fn((cb: any) =>
        Promise.resolve(cb({ data: null, error: new Error('DB Error') }))
      ),
    }
    ;(supabase.from as any).mockReturnValue(mockChain)

    render(
      <MemoryRouter>
        <SlidesList />
      </MemoryRouter>
    )

    await waitFor(() => {
      expect(screen.getByText('Connection error')).toBeInTheDocument()
      expect(screen.getByText('Please try again later.')).toBeInTheDocument()
      expect(screen.getByRole('button', { name: /Retry/i })).toBeInTheDocument()
    })
  })

  it('displays slide metadata correctly', async () => {
    const mockChain = {
      select: vi.fn().mockReturnThis(),
      eq: vi.fn().mockReturnThis(),
      order: vi.fn().mockReturnThis(),
      then: vi.fn((cb: any) => Promise.resolve(cb({ data: [mockSlides[0]], error: null }))),
    }
    ;(supabase.from as any).mockReturnValue(mockChain)

    render(
      <MemoryRouter>
        <SlidesList />
      </MemoryRouter>
    )

    await waitFor(
      () => {
        expect(screen.getByText('Numbers 1-10')).toBeInTheDocument()
      },
      { timeout: 3000 }
    )
    // Find the specific "Easy" in the card meta
    const easyTags = screen.getAllByText('Easy')
    expect(easyTags.some(el => el.className.includes('mm-tag'))).toBe(true)
    expect(screen.getByText('10 slides')).toBeInTheDocument()
  })

  it('links to individual slide player', async () => {
    const mockChain = {
      select: vi.fn().mockReturnThis(),
      eq: vi.fn().mockReturnThis(),
      order: vi.fn().mockReturnThis(),
      then: vi.fn((cb: any) => Promise.resolve(cb({ data: [mockSlides[0]], error: null }))),
    }
    ;(supabase.from as any).mockReturnValue(mockChain)

    render(
      <MemoryRouter>
        <SlidesList />
      </MemoryRouter>
    )

    await waitFor(() => {
      const link = screen.getByText('Numbers 1-10').closest('a')
      expect(link).toHaveAttribute('href', '/slides/1')
    })
  })

  // ========== SlidePlayer Tests ==========

  describe('SlidePlayer', () => {
    const mockSlideData = {
      id: 'slide-1',
      title: 'Alphabet',
      slide_count: 3,
      cover_kind: 'rainbow',
      published: true,
      slides_data: [
        { label: 'Apple', translation: 'Elma', cover_kind: 'red' },
        { label: 'Ball', translation: 'Top', cover_kind: 'blue' },
        { label: 'Cat', translation: 'Kedi', cover_kind: 'yellow' },
      ],
    }

    beforeEach(() => {
      vi.clearAllMocks()
      document.title = ''
    })

    it('renders SlidePlayer with Layout wrapper', async () => {
      const mockChain = {
        select: vi.fn().mockReturnThis(),
        eq: vi.fn().mockReturnThis(),
        single: vi.fn().mockResolvedValue({ data: mockSlideData, error: null }),
      }
      ;(supabase.from as any).mockReturnValue(mockChain)

      render(
        <MemoryRouter initialEntries={['/slides/slide-1']}>
          <Routes>
            <Route path="/slides/:id" element={<SlidePlayer />} />
          </Routes>
        </MemoryRouter>
      )

      await waitFor(() => {
        expect(screen.getByText('Alphabet')).toBeInTheDocument()
      })
    })

    it('sets document title to "{title} - minesminis"', async () => {
      const mockChain = {
        select: vi.fn().mockReturnThis(),
        eq: vi.fn().mockReturnThis(),
        single: vi.fn().mockResolvedValue({ data: mockSlideData, error: null }),
      }
      ;(supabase.from as any).mockReturnValue(mockChain)

      render(
        <MemoryRouter initialEntries={['/slides/slide-1']}>
          <Routes>
            <Route path="/slides/:id" element={<SlidePlayer />} />
          </Routes>
        </MemoryRouter>
      )

      await waitFor(() => {
        expect(document.title).toBe('Alphabet - minesminis')
      })
    })

    it('shows loading state initially', async () => {
      const mockChain = {
        select: vi.fn().mockReturnThis(),
        eq: vi.fn().mockReturnThis(),
        single: vi.fn(() => new Promise(() => {})), // Never resolves
      }
      ;(supabase.from as any).mockReturnValue(mockChain)

      render(
        <MemoryRouter initialEntries={['/slides/slide-1']}>
          <Routes>
            <Route path="/slides/:id" element={<SlidePlayer />} />
          </Routes>
        </MemoryRouter>
      )

      await waitFor(() => {
        expect(screen.getByText('Loading...')).toBeInTheDocument()
      })
    })

    it('shows "Content not found" when slide not found', async () => {
      const mockChain = {
        select: vi.fn().mockReturnThis(),
        eq: vi.fn().mockReturnThis(),
        single: vi.fn().mockResolvedValue({ data: null, error: new Error('Not found') }),
      }
      ;(supabase.from as any).mockReturnValue(mockChain)

      render(
        <MemoryRouter initialEntries={['/slides/nonexistent']}>
          <Routes>
            <Route path="/slides/:id" element={<SlidePlayer />} />
          </Routes>
        </MemoryRouter>
      )

      await waitFor(() => {
        expect(screen.getByText('Content not found')).toBeInTheDocument()
        expect(screen.getByText('Back to Slides')).toBeInTheDocument()
      })
    })

    it('displays current slide with label and translation', async () => {
      const mockChain = {
        select: vi.fn().mockReturnThis(),
        eq: vi.fn().mockReturnThis(),
        single: vi.fn().mockResolvedValue({ data: mockSlideData, error: null }),
      }
      ;(supabase.from as any).mockReturnValue(mockChain)

      render(
        <MemoryRouter initialEntries={['/slides/slide-1']}>
          <Routes>
            <Route path="/slides/:id" element={<SlidePlayer />} />
          </Routes>
        </MemoryRouter>
      )

      await waitFor(() => {
        expect(screen.getByText('Apple')).toBeInTheDocument()
        expect(screen.getByText('= Elma')).toBeInTheDocument()
      })
    })

    it('shows slide counter "1 / 3"', async () => {
      const mockChain = {
        select: vi.fn().mockReturnThis(),
        eq: vi.fn().mockReturnThis(),
        single: vi.fn().mockResolvedValue({ data: mockSlideData, error: null }),
      }
      ;(supabase.from as any).mockReturnValue(mockChain)

      render(
        <MemoryRouter initialEntries={['/slides/slide-1']}>
          <Routes>
            <Route path="/slides/:id" element={<SlidePlayer />} />
          </Routes>
        </MemoryRouter>
      )

      await waitFor(() => {
        expect(screen.getByText('Slide 1 / 3')).toBeInTheDocument()
      })
    })

    it('navigates to next slide', async () => {
      const mockChain = {
        select: vi.fn().mockReturnThis(),
        eq: vi.fn().mockReturnThis(),
        single: vi.fn().mockResolvedValue({ data: mockSlideData, error: null }),
      }
      ;(supabase.from as any).mockReturnValue(mockChain)

      render(
        <MemoryRouter initialEntries={['/slides/slide-1']}>
          <Routes>
            <Route path="/slides/:id" element={<SlidePlayer />} />
          </Routes>
        </MemoryRouter>
      )

      await waitFor(() => {
        expect(screen.getByText('Apple')).toBeInTheDocument()
      })

      const nextBtn = screen.getByRole('button', { name: /Next slide/i })
      await userEvent.click(nextBtn)

      await waitFor(() => {
        expect(screen.getByText('Ball')).toBeInTheDocument()
        expect(screen.getByText('= Top')).toBeInTheDocument()
        expect(screen.getByText('Slide 2 / 3')).toBeInTheDocument()
      })
    })

    it('navigates to previous slide', async () => {
      const mockChain = {
        select: vi.fn().mockReturnThis(),
        eq: vi.fn().mockReturnThis(),
        single: vi.fn().mockResolvedValue({ data: mockSlideData, error: null }),
      }
      ;(supabase.from as any).mockReturnValue(mockChain)

      render(
        <MemoryRouter initialEntries={['/slides/slide-1']}>
          <Routes>
            <Route path="/slides/:id" element={<SlidePlayer />} />
          </Routes>
        </MemoryRouter>
      )

      await waitFor(() => {
        expect(screen.getByText('Apple')).toBeInTheDocument()
      })

      // Go to second slide first
      const nextBtn = screen.getByRole('button', { name: /Next slide/i })
      await userEvent.click(nextBtn)

      await waitFor(() => {
        expect(screen.getByText('Ball')).toBeInTheDocument()
      })

      // Now go back
      const prevBtn = screen.getByRole('button', { name: /Previous slide/i })
      await userEvent.click(prevBtn)

      await waitFor(() => {
        expect(screen.getByText('Apple')).toBeInTheDocument()
        expect(screen.getByText('Slide 1 / 3')).toBeInTheDocument()
      })
    })

    it('prevents going before first slide', async () => {
      const mockChain = {
        select: vi.fn().mockReturnThis(),
        eq: vi.fn().mockReturnThis(),
        single: vi.fn().mockResolvedValue({ data: mockSlideData, error: null }),
      }
      ;(supabase.from as any).mockReturnValue(mockChain)

      render(
        <MemoryRouter initialEntries={['/slides/slide-1']}>
          <Routes>
            <Route path="/slides/:id" element={<SlidePlayer />} />
          </Routes>
        </MemoryRouter>
      )

      await waitFor(() => {
        expect(screen.getByText('Apple')).toBeInTheDocument()
      })

      const prevBtn = screen.getByRole('button', { name: /Previous slide/i })
      await userEvent.click(prevBtn)

      // Should still be on slide 1
      expect(screen.getByText('Slide 1 / 3')).toBeInTheDocument()
      expect(screen.getByText('Apple')).toBeInTheDocument()
    })

    it('prevents going past last slide', async () => {
      const mockChain = {
        select: vi.fn().mockReturnThis(),
        eq: vi.fn().mockReturnThis(),
        single: vi.fn().mockResolvedValue({ data: mockSlideData, error: null }),
      }
      ;(supabase.from as any).mockReturnValue(mockChain)

      render(
        <MemoryRouter initialEntries={['/slides/slide-1']}>
          <Routes>
            <Route path="/slides/:id" element={<SlidePlayer />} />
          </Routes>
        </MemoryRouter>
      )

      await waitFor(() => {
        expect(screen.getByText('Slide 1 / 3')).toBeInTheDocument()
      })

      const nextBtn = screen.getByRole('button', { name: /Next slide/i })

      // Go to slide 2
      await userEvent.click(nextBtn)
      await waitFor(() => {
        expect(screen.getByText('Slide 2 / 3')).toBeInTheDocument()
      })

      // Go to slide 3
      await userEvent.click(nextBtn)
      await waitFor(() => {
        expect(screen.getByText('Slide 3 / 3')).toBeInTheDocument()
      })

      // Try to go past
      await userEvent.click(nextBtn)

      // Should still be on slide 3
      expect(screen.getByText('Slide 3 / 3')).toBeInTheDocument()
      expect(screen.getByText('Cat')).toBeInTheDocument()
    })

    it('toggles play button', async () => {
      const mockChain = {
        select: vi.fn().mockReturnThis(),
        eq: vi.fn().mockReturnThis(),
        single: vi.fn().mockResolvedValue({ data: mockSlideData, error: null }),
      }
      ;(supabase.from as any).mockReturnValue(mockChain)

      render(
        <MemoryRouter initialEntries={['/slides/slide-1']}>
          <Routes>
            <Route path="/slides/:id" element={<SlidePlayer />} />
          </Routes>
        </MemoryRouter>
      )

      await waitFor(() => {
        expect(screen.getByText('Apple')).toBeInTheDocument()
      })

      const playBtn = screen.getByRole('button', { name: /Auto-play/i })
      expect(playBtn).toBeInTheDocument()

      await userEvent.click(playBtn)

      // After clicking, should show Pause
      await waitFor(() => {
        expect(screen.getByRole('button', { name: /Pause/i })).toBeInTheDocument()
      })
    })

    it('selects slide from thumbnail', async () => {
      const mockChain = {
        select: vi.fn().mockReturnThis(),
        eq: vi.fn().mockReturnThis(),
        single: vi.fn().mockResolvedValue({ data: mockSlideData, error: null }),
      }
      ;(supabase.from as any).mockReturnValue(mockChain)

      render(
        <MemoryRouter initialEntries={['/slides/slide-1']}>
          <Routes>
            <Route path="/slides/:id" element={<SlidePlayer />} />
          </Routes>
        </MemoryRouter>
      )

      await waitFor(() => {
        expect(screen.getByText('Apple')).toBeInTheDocument()
      })

      // Find thumbnail for slide 3
      const thumbnails = screen.getAllByText(/\d/)
      const slide3Thumbnail = thumbnails.find(el => el.textContent === '3')
      expect(slide3Thumbnail).toBeInTheDocument()

      if (slide3Thumbnail?.closest('div')) {
        await userEvent.click(slide3Thumbnail.closest('div')!)
      }

      await waitFor(() => {
        expect(screen.getByText('Cat')).toBeInTheDocument()
        expect(screen.getByText('Slide 3 / 3')).toBeInTheDocument()
      })
    })

    it('shows "Slide content not added yet" when slides_data is empty', async () => {
      const emptySlide = {
        ...mockSlideData,
        slides_data: [],
      }

      const mockChain = {
        select: vi.fn().mockReturnThis(),
        eq: vi.fn().mockReturnThis(),
        single: vi.fn().mockResolvedValue({ data: emptySlide, error: null }),
      }
      ;(supabase.from as any).mockReturnValue(mockChain)

      render(
        <MemoryRouter initialEntries={['/slides/slide-1']}>
          <Routes>
            <Route path="/slides/:id" element={<SlidePlayer />} />
          </Routes>
        </MemoryRouter>
      )

      await waitFor(() => {
        expect(screen.getByText('Slide content not added yet')).toBeInTheDocument()
      })
    })

    it('fetches slide with correct id parameter', async () => {
      const mockChain = {
        select: vi.fn().mockReturnThis(),
        eq: vi.fn().mockReturnThis(),
        single: vi.fn().mockResolvedValue({ data: mockSlideData, error: null }),
      }
      ;(supabase.from as any).mockReturnValue(mockChain)

      render(
        <MemoryRouter initialEntries={['/slides/custom-slide-id']}>
          <Routes>
            <Route path="/slides/:id" element={<SlidePlayer />} />
          </Routes>
        </MemoryRouter>
      )

      await waitFor(() => {
        expect(mockChain.eq).toHaveBeenCalledWith('id', 'custom-slide-id')
      })
    })

    it('shows fullscreen button', async () => {
      const mockChain = {
        select: vi.fn().mockReturnThis(),
        eq: vi.fn().mockReturnThis(),
        single: vi.fn().mockResolvedValue({ data: mockSlideData, error: null }),
      }
      ;(supabase.from as any).mockReturnValue(mockChain)

      render(
        <MemoryRouter initialEntries={['/slides/slide-1']}>
          <Routes>
            <Route path="/slides/:id" element={<SlidePlayer />} />
          </Routes>
        </MemoryRouter>
      )

      await waitFor(() => {
        expect(screen.getByRole('button', { name: /Fullscreen/i })).toBeInTheDocument()
      })
    })

    it('shows back to slides link in error state', async () => {
      const mockChain = {
        select: vi.fn().mockReturnThis(),
        eq: vi.fn().mockReturnThis(),
        single: vi.fn().mockResolvedValue({ data: null, error: new Error('Not found') }),
      }
      ;(supabase.from as any).mockReturnValue(mockChain)

      render(
        <MemoryRouter initialEntries={['/slides/nonexistent']}>
          <Routes>
            <Route path="/slides/:id" element={<SlidePlayer />} />
            <Route path="/slides" element={<div>Slides List</div>} />
          </Routes>
        </MemoryRouter>
      )

      await waitFor(() => {
        const backLink = screen.getByText('Back to Slides')
        expect(backLink).toHaveAttribute('href', '/slides')
      })
    })

    it('displays progress bar with correct width', async () => {
      const mockChain = {
        select: vi.fn().mockReturnThis(),
        eq: vi.fn().mockReturnThis(),
        single: vi.fn().mockResolvedValue({ data: mockSlideData, error: null }),
      }
      ;(supabase.from as any).mockReturnValue(mockChain)

      render(
        <MemoryRouter initialEntries={['/slides/slide-1']}>
          <Routes>
            <Route path="/slides/:id" element={<SlidePlayer />} />
          </Routes>
        </MemoryRouter>
      )

      await waitFor(() => {
        expect(screen.getByText('Apple')).toBeInTheDocument()
      })

      const progressFill = document.querySelector('.mm-progress-fill') as HTMLElement
      expect(progressFill).toBeInTheDocument()
      expect(progressFill.style.width).toBe('33.33333333333333%') // 1/3
    })

    it('updates progress bar when navigating slides', async () => {
      const mockChain = {
        select: vi.fn().mockReturnThis(),
        eq: vi.fn().mockReturnThis(),
        single: vi.fn().mockResolvedValue({ data: mockSlideData, error: null }),
      }
      ;(supabase.from as any).mockReturnValue(mockChain)

      render(
        <MemoryRouter initialEntries={['/slides/slide-1']}>
          <Routes>
            <Route path="/slides/:id" element={<SlidePlayer />} />
          </Routes>
        </MemoryRouter>
      )

      await waitFor(() => {
        expect(screen.getByText('Apple')).toBeInTheDocument()
      })

      const nextBtn = screen.getByRole('button', { name: /Next slide/i })
      await userEvent.click(nextBtn)

      await waitFor(() => {
        const progressFill = document.querySelector('.mm-progress-fill') as HTMLElement
        expect(progressFill.style.width).toBe('66.66666666666666%') // 2/3
      })
    })
  })
})
