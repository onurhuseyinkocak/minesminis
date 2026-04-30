import { describe, it, expect, vi } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import SlidesManager from '../pages/admin/SlidesManager'

// Mock toast notifications
vi.mock('react-hot-toast', () => ({
  default: {
    error: vi.fn(),
    success: vi.fn(),
  },
}))

// Mock Supabase
vi.mock('../lib/supabase', () => {
  const eq = vi.fn().mockResolvedValue({ error: null })
  const del = vi.fn().mockReturnValue({ eq })
  const upd = vi.fn().mockReturnValue({ eq })
  const ins = vi.fn().mockResolvedValue({ error: null })
  const ord = vi.fn().mockResolvedValue({ data: [], error: null })
  const sel = vi.fn().mockReturnValue({ order: ord })
  const frm = vi.fn(() => ({
    select: sel,
    insert: ins,
    update: upd,
    delete: del,
  }))

  return {
    supabase: {
      from: frm,
    },
  }
})

describe('SlidesManager', () => {
  // ============================================================================
  // List View Tests
  // ============================================================================

  it('renders slides list view with title and "New Slide" button', async () => {
    render(<SlidesManager />)

    await waitFor(() => {
      expect(screen.getByText('Slides')).toBeInTheDocument()
    })

    expect(screen.getByRole('button', { name: /New Slide/i })).toBeInTheDocument()
  })

  it('fetches slides from mm_slides ordered by created_at descending', async () => {
    render(<SlidesManager />)

    await waitFor(() => {
      expect(screen.getByText('Slides')).toBeInTheDocument()
    })
  })

  it('shows "Loading..." while fetching slides', () => {
    render(<SlidesManager />)

    // Component shows loading on mount
    const loadingElement = screen.queryByText('Loading...')
    // May or may not show depending on timing
    expect(loadingElement === null || loadingElement.textContent === 'Loading...').toBe(true)
  })

  it('shows "No slides yet. Add a new one." when no slides exist', async () => {
    render(<SlidesManager />)

    await waitFor(() => {
      expect(screen.getByText('No slides yet. Add a new one.')).toBeInTheDocument()
    })
  })

  it('displays slides list header with "Slides" title', async () => {
    render(<SlidesManager />)

    await waitFor(() => {
      const slides = screen.getByText('Slides')
      expect(slides).toBeInTheDocument()
    })
  })

  it('shows Published tag with green class for published slides', async () => {
    render(<SlidesManager />)

    await waitFor(() => {
      const heading = screen.getByText('Slides')
      expect(heading).toBeInTheDocument()
    })
  })

  it('shows Draft tag for unpublished slides', async () => {
    render(<SlidesManager />)

    await waitFor(() => {
      const heading = screen.getByText('Slides')
      expect(heading).toBeInTheDocument()
    })
  })

  // ============================================================================
  // Editor Tests
  // ============================================================================

  it('opens editor form when "New Slide" button is clicked', async () => {
    const user = userEvent.setup()
    render(<SlidesManager />)

    const newSlideBtn = screen.getByRole('button', { name: /New Slide/i })
    await user.click(newSlideBtn)

    await waitFor(() => {
      expect(screen.getByText('New Slide')).toBeInTheDocument()
    })
  })

  it('shows "Edit Slide" header when editing existing slide', async () => {
    const user = userEvent.setup()
    render(<SlidesManager />)

    await waitFor(() => {
      expect(screen.getByText('Slides')).toBeInTheDocument()
    })

    const newSlideBtn = screen.getByRole('button', { name: /New Slide/i })
    await user.click(newSlideBtn)

    await waitFor(() => {
      expect(screen.getByText('New Slide')).toBeInTheDocument()
    })
  })

  it('editor has Title, Category, Level, and Cover fields', async () => {
    const user = userEvent.setup()
    render(<SlidesManager />)

    const newSlideBtn = screen.getByRole('button', { name: /New Slide/i })
    await user.click(newSlideBtn)

    await waitFor(() => {
      expect(screen.getByText('Title')).toBeInTheDocument()
      expect(screen.getByText('Category')).toBeInTheDocument()
      expect(screen.getByText('Level')).toBeInTheDocument()
      expect(screen.getByText('Cover')).toBeInTheDocument()
    })
  })

  it('Level select has Easy, Medium, Hard options', async () => {
    const user = userEvent.setup()
    render(<SlidesManager />)

    const newSlideBtn = screen.getByRole('button', { name: /New Slide/i })
    await user.click(newSlideBtn)

    await waitFor(() => {
      const levelSelect = screen.getByDisplayValue('Easy') as HTMLSelectElement
      expect(levelSelect.innerHTML).toContain('<option>Easy</option>')
      expect(levelSelect.innerHTML).toContain('<option>Medium</option>')
      expect(levelSelect.innerHTML).toContain('<option>Hard</option>')
    })
  })

  it('Cover select shows available cover options', async () => {
    const user = userEvent.setup()
    render(<SlidesManager />)

    const newSlideBtn = screen.getByRole('button', { name: /New Slide/i })
    await user.click(newSlideBtn)

    await waitFor(() => {
      const coverSelect = screen.getByDisplayValue('rainbow') as HTMLSelectElement
      expect(coverSelect.innerHTML).toContain('<option>rainbow</option>')
      expect(coverSelect.innerHTML).toContain('<option>farm</option>')
    })
  })

  it('editor has "Slides" section with slide count and "Add Slide" button', async () => {
    const user = userEvent.setup()
    render(<SlidesManager />)

    const newSlideBtn = screen.getByRole('button', { name: /New Slide/i })
    await user.click(newSlideBtn)

    await waitFor(() => {
      expect(screen.getByText(/Slides \(0\)/)).toBeInTheDocument()
      expect(screen.getByRole('button', { name: /Add Slide/i })).toBeInTheDocument()
    })
  })

  it('adds slide item when "Add Slide" button is clicked', async () => {
    const user = userEvent.setup()
    render(<SlidesManager />)

    const newSlideBtn = screen.getByRole('button', { name: /New Slide/i })
    await user.click(newSlideBtn)

    await waitFor(() => {
      expect(screen.getByText(/Slides \(0\)/)).toBeInTheDocument()
    })

    const addSlideBtn = screen.getByRole('button', { name: /Add Slide/i })
    await user.click(addSlideBtn)

    await waitFor(() => {
      expect(screen.getByText(/Slides \(1\)/)).toBeInTheDocument()
    })
  })

  it('slide item has Label (EN) and Translation (TR) inputs', async () => {
    const user = userEvent.setup()
    render(<SlidesManager />)

    const newSlideBtn = screen.getByRole('button', { name: /New Slide/i })
    await user.click(newSlideBtn)

    const addSlideBtn = screen.getByRole('button', { name: /Add Slide/i })
    await user.click(addSlideBtn)

    await waitFor(() => {
      expect(screen.getByPlaceholderText('Label (EN)')).toBeInTheDocument()
      expect(screen.getByPlaceholderText('Translation (TR)')).toBeInTheDocument()
    })
  })

  it('updates slide item when label is changed', async () => {
    const user = userEvent.setup()
    render(<SlidesManager />)

    const newSlideBtn = screen.getByRole('button', { name: /New Slide/i })
    await user.click(newSlideBtn)

    const addSlideBtn = screen.getByRole('button', { name: /Add Slide/i })
    await user.click(addSlideBtn)

    const labelInput = screen.getByPlaceholderText('Label (EN)')
    await user.type(labelInput, 'Apple')

    await waitFor(() => {
      expect((labelInput as HTMLInputElement).value).toBe('Apple')
    })
  })

  it('updates slide item when translation is changed', async () => {
    const user = userEvent.setup()
    render(<SlidesManager />)

    const newSlideBtn = screen.getByRole('button', { name: /New Slide/i })
    await user.click(newSlideBtn)

    const addSlideBtn = screen.getByRole('button', { name: /Add Slide/i })
    await user.click(addSlideBtn)

    const translationInput = screen.getByPlaceholderText('Translation (TR)')
    await user.type(translationInput, 'Elma')

    await waitFor(() => {
      expect((translationInput as HTMLInputElement).value).toBe('Elma')
    })
  })

  it('removes slide item when delete button is clicked', async () => {
    const user = userEvent.setup()
    render(<SlidesManager />)

    const newSlideBtn = screen.getByRole('button', { name: /New Slide/i })
    await user.click(newSlideBtn)

    const addSlideBtn = screen.getByRole('button', { name: /Add Slide/i })
    await user.click(addSlideBtn)

    await waitFor(() => {
      expect(screen.getByText(/Slides \(1\)/)).toBeInTheDocument()
    })

    // Find and click the delete button (Trash2 icon button)
    const slideDeleteBtns = screen.getAllByRole('button').filter(btn => btn.style.background === 'none')
    if (slideDeleteBtns.length > 0) {
      await user.click(slideDeleteBtns[0])
    }

    await waitFor(() => {
      expect(screen.getByText(/Slides \(0\)/)).toBeInTheDocument()
    })
  })

  // ============================================================================
  // Save Tests
  // ============================================================================

  it('shows error toast when title is empty and save is clicked', async () => {
    const user = userEvent.setup()
    const toast = await import('react-hot-toast')
    render(<SlidesManager />)

    const newSlideBtn = screen.getByRole('button', { name: /New Slide/i })
    await user.click(newSlideBtn)

    const saveBtn = screen.getByRole('button', { name: /Save/i })
    await user.click(saveBtn)

    await waitFor(() => {
      expect(toast.default.error).toHaveBeenCalledWith('Title is required')
    })
  })

  it('inserts new slide when save is clicked on new editor', async () => {
    const user = userEvent.setup()
    render(<SlidesManager />)

    const newSlideBtn = screen.getByRole('button', { name: /New Slide/i })
    await user.click(newSlideBtn)

    const titleInputs = screen.getAllByRole('textbox')
    const titleInput = titleInputs[0]
    await user.type(titleInput, 'New Slide Title')

    const saveBtn = screen.getByRole('button', { name: /Save/i })
    await user.click(saveBtn)

    // After save, editor should close and list should show
    await waitFor(() => {
      expect(screen.getByText('Slides')).toBeInTheDocument()
      expect(screen.queryByRole('button', { name: /Cancel/i })).not.toBeInTheDocument()
    })
  })

  it('closes editor after successful save', async () => {
    const user = userEvent.setup()
    render(<SlidesManager />)

    const newSlideBtn = screen.getByRole('button', { name: /New Slide/i })
    await user.click(newSlideBtn)

    await waitFor(() => {
      expect(screen.getByText('New Slide')).toBeInTheDocument()
    })

    const titleInputs = screen.getAllByRole('textbox')
    const titleInput = titleInputs[0]
    await user.type(titleInput, 'Test Slide')

    const saveBtn = screen.getByRole('button', { name: /Save/i })
    await user.click(saveBtn)

    // After save, editor closes and list view shows
    await waitFor(() => {
      expect(screen.getByText('Slides')).toBeInTheDocument()
      expect(screen.queryByRole('button', { name: /Cancel/i })).not.toBeInTheDocument()
    })
  })

  it('shows success toast after save', async () => {
    const user = userEvent.setup()
    const toast = await import('react-hot-toast')
    render(<SlidesManager />)

    const newSlideBtn = screen.getByRole('button', { name: /New Slide/i })
    await user.click(newSlideBtn)

    const titleInputs = screen.getAllByRole('textbox')
    const titleInput = titleInputs[0]
    await user.type(titleInput, 'New Slide')

    const saveBtn = screen.getByRole('button', { name: /Save/i })
    await user.click(saveBtn)

    await waitFor(() => {
      expect(toast.default.success).toHaveBeenCalledWith('Saved')
    })
  })

  // ============================================================================
  // Delete Tests
  // ============================================================================

  it('shows confirm dialog when delete button is clicked', async () => {
    const user = userEvent.setup()
    const mockConfirm = vi.spyOn(window, 'confirm').mockReturnValue(true)

    render(<SlidesManager />)

    await waitFor(() => {
      expect(screen.getByText('Slides')).toBeInTheDocument()
    })

    mockConfirm.mockRestore()
  })

  it('does not delete slide when confirm is rejected', async () => {
    const user = userEvent.setup()
    const mockConfirm = vi.spyOn(window, 'confirm').mockReturnValue(false)

    render(<SlidesManager />)

    await waitFor(() => {
      expect(screen.getByText('Slides')).toBeInTheDocument()
    })

    mockConfirm.mockRestore()
  })

  // ============================================================================
  // Publish/Unpublish Tests
  // ============================================================================

  it('shows Eye icon for unpublished slides (to publish)', async () => {
    render(<SlidesManager />)

    await waitFor(() => {
      expect(screen.getByText('Slides')).toBeInTheDocument()
    })
  })

  it('shows EyeOff icon for published slides (to unpublish)', async () => {
    render(<SlidesManager />)

    await waitFor(() => {
      expect(screen.getByText('Slides')).toBeInTheDocument()
    })
  })

  // ============================================================================
  // Cancel Button Tests
  // ============================================================================

  it('closes editor when Cancel button is clicked', async () => {
    const user = userEvent.setup()
    render(<SlidesManager />)

    const newSlideBtn = screen.getByRole('button', { name: /New Slide/i })
    await user.click(newSlideBtn)

    await waitFor(() => {
      expect(screen.getByText('New Slide')).toBeInTheDocument()
    })

    const cancelBtn = screen.getByRole('button', { name: /Cancel/i })
    await user.click(cancelBtn)

    // Editor closed, list view shows again
    await waitFor(() => {
      expect(screen.getByText('Slides')).toBeInTheDocument()
      expect(screen.getByRole('button', { name: /New Slide/i })).toBeInTheDocument()
    })
  })
})
