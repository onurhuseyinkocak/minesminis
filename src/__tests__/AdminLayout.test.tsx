import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter, Routes, Route } from 'react-router-dom'
import AdminLayout from '../pages/admin/AdminLayout'
import { supabase } from '../lib/supabase'

// Mock sub-components to avoid loading actual managers
vi.mock('../pages/admin/SlidesManager', () => ({
  default: () => <div>SlidesManager Mock</div>,
}))
vi.mock('../pages/admin/VideosManager', () => ({
  default: () => <div>VideosManager Mock</div>,
}))
vi.mock('../pages/admin/SongsManager', () => ({
  default: () => <div>SongsManager Mock</div>,
}))

// Mock lucide-react icons to prevent rendering issues
vi.mock('lucide-react', () => ({
  Presentation: ({ size: _size }: { size: number }) => <span data-testid="icon-presentation" />,
  Video: ({ size: _size }: { size: number }) => <span data-testid="icon-video" />,
  Music: ({ size: _size }: { size: number }) => <span data-testid="icon-music" />,
  LogOut: ({ size: _size }: { size: number }) => <span data-testid="icon-logout" />,
  LayoutDashboard: ({ size: _size }: { size: number }) => <span data-testid="icon-dashboard" />,
  Eye: ({ size: _size }: { size: number }) => <span data-testid="icon-eye" />,
  EyeOff: ({ size: _size }: { size: number }) => <span data-testid="icon-eye-off" />,
}))

const mockGetSession = supabase.auth.getSession as ReturnType<typeof vi.fn>
const mockSignIn = supabase.auth.signInWithPassword as ReturnType<typeof vi.fn>
const mockSignOut = supabase.auth.signOut as ReturnType<typeof vi.fn>

describe('AdminLayout - Login Form', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    mockGetSession.mockResolvedValue({ data: { session: null }, error: null })
  })

  it('renders login form when not authenticated', async () => {
    render(
      <MemoryRouter>
        <AdminLayout />
      </MemoryRouter>
    )

    await waitFor(() => {
      expect(screen.getByText('Admin Panel')).toBeInTheDocument()
      expect(screen.getByText('minesminis management')).toBeInTheDocument()
    })
  })

  it('renders password input field in login form', async () => {
    render(
      <MemoryRouter>
        <AdminLayout />
      </MemoryRouter>
    )

    await waitFor(() => {
      const passwordInput = screen.getByPlaceholderText('Password')
      expect(passwordInput).toBeInTheDocument()
      expect(passwordInput).toHaveAttribute('type', 'password')
    })
  })

  it('renders Sign In button in login form', async () => {
    render(
      <MemoryRouter>
        <AdminLayout />
      </MemoryRouter>
    )

    await waitFor(() => {
      expect(screen.getByRole('button', { name: /Sign In/i })).toBeInTheDocument()
    })
  })

  it('shows error message when wrong password is submitted', async () => {
    mockSignIn.mockResolvedValue({ data: { session: null }, error: { message: 'Invalid credentials' } })
    const user = userEvent.setup()

    render(
      <MemoryRouter>
        <AdminLayout />
      </MemoryRouter>
    )

    await waitFor(() => {
      expect(screen.getByPlaceholderText('Password')).toBeInTheDocument()
    })

    await user.type(screen.getByPlaceholderText('Password'), 'wrongpass')
    await user.click(screen.getByRole('button', { name: /Sign In/i }))

    await waitFor(() => {
      expect(screen.getByText('Wrong password')).toBeInTheDocument()
    })
  })

  it('clears error message when user types after failed login', async () => {
    mockSignIn.mockResolvedValue({ data: { session: null }, error: { message: 'Invalid credentials' } })
    const user = userEvent.setup()

    render(
      <MemoryRouter>
        <AdminLayout />
      </MemoryRouter>
    )

    await waitFor(() => {
      expect(screen.getByPlaceholderText('Password')).toBeInTheDocument()
    })

    await user.type(screen.getByPlaceholderText('Password'), 'wrongpass')
    await user.click(screen.getByRole('button', { name: /Sign In/i }))

    await waitFor(() => {
      expect(screen.getByText('Wrong password')).toBeInTheDocument()
    })

    await user.type(screen.getByPlaceholderText('Password'), '123')

    await waitFor(() => {
      expect(screen.queryByText('Wrong password')).not.toBeInTheDocument()
    })
  })

  it('calls supabase signInWithPassword on login', async () => {
    mockSignIn.mockResolvedValue({ data: { session: {} }, error: null })
    const user = userEvent.setup()

    render(
      <MemoryRouter>
        <AdminLayout />
      </MemoryRouter>
    )

    await waitFor(() => {
      expect(screen.getByPlaceholderText('Password')).toBeInTheDocument()
    })

    await user.type(screen.getByPlaceholderText('Password'), 'testpass')
    await user.click(screen.getByRole('button', { name: /Sign In/i }))

    await waitFor(() => {
      expect(mockSignIn).toHaveBeenCalledWith({
        email: 'admin@minesminis.com',
        password: 'testpass',
      })
    })
  })
})

describe('AdminLayout - Authenticated State', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    mockGetSession.mockResolvedValue({ data: { session: { user: { id: '1' } } }, error: null })
  })

  it('shows dashboard when session exists', async () => {
    render(
      <MemoryRouter>
        <AdminLayout />
      </MemoryRouter>
    )

    await waitFor(() => {
      expect(screen.getByRole('heading', { name: /^Dashboard$/i })).toBeInTheDocument()
      expect(screen.getByText('minesminis content management')).toBeInTheDocument()
    })
  })

  it('shows sidebar with minesminis logo', async () => {
    render(
      <MemoryRouter>
        <AdminLayout />
      </MemoryRouter>
    )

    await waitFor(() => {
      const logo = screen.getByAltText('minesminis')
      expect(logo).toBeInTheDocument()
      expect(logo).toHaveAttribute('src', '/images/minesminis-logo.webp')
    })
  })

  it('renders sidebar navigation items', async () => {
    render(
      <MemoryRouter>
        <AdminLayout />
      </MemoryRouter>
    )

    await waitFor(() => {
      const navLinks = screen.getAllByRole('link')
      expect(navLinks.find(link => link.textContent?.includes('Dashboard'))).toBeInTheDocument()
      expect(navLinks.find(link => link.textContent?.includes('Slides'))).toBeInTheDocument()
      expect(navLinks.find(link => link.textContent?.includes('Videos'))).toBeInTheDocument()
      expect(navLinks.find(link => link.textContent?.includes('Songs'))).toBeInTheDocument()
    })
  })

  it('calls supabase signOut on Sign Out click', async () => {
    const user = userEvent.setup()

    render(
      <MemoryRouter>
        <AdminLayout />
      </MemoryRouter>
    )

    await waitFor(() => {
      expect(screen.getByRole('button', { name: /Sign Out/i })).toBeInTheDocument()
    })

    await user.click(screen.getByRole('button', { name: /Sign Out/i }))

    expect(mockSignOut).toHaveBeenCalled()
  })
})

describe('AdminLayout - Dashboard', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    mockGetSession.mockResolvedValue({ data: { session: { user: { id: '1' } } }, error: null })
  })

  it('displays 3 dashboard cards: Slides, Videos, Songs', async () => {
    render(
      <MemoryRouter>
        <AdminLayout />
      </MemoryRouter>
    )

    await waitFor(() => {
      expect(screen.getAllByText('Slides').length).toBeGreaterThan(0)
      expect(screen.getAllByText('Videos').length).toBeGreaterThan(0)
      expect(screen.getAllByText('Songs').length).toBeGreaterThan(0)
    })
  })

  it('dashboard cards display Manage content text', async () => {
    render(
      <MemoryRouter>
        <AdminLayout />
      </MemoryRouter>
    )

    await waitFor(() => {
      expect(screen.getAllByText('Manage content').length).toBe(3)
    })
  })

  it('cards link to correct admin routes', async () => {
    render(
      <MemoryRouter>
        <AdminLayout />
      </MemoryRouter>
    )

    await waitFor(() => {
      const links = screen.getAllByRole('link')
      expect(links.find(l => l.getAttribute('href') === '/admin/slides')).toBeInTheDocument()
      expect(links.find(l => l.getAttribute('href') === '/admin/videos')).toBeInTheDocument()
      expect(links.find(l => l.getAttribute('href') === '/admin/songs')).toBeInTheDocument()
      expect(links.find(l => l.getAttribute('href') === '/')).toBeInTheDocument()
    })
  })
})

describe('AdminLayout - Navigation', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    mockGetSession.mockResolvedValue({ data: { session: { user: { id: '1' } } }, error: null })
  })

  it('slides route renders SlidesManager', async () => {
    render(
      <MemoryRouter initialEntries={['/admin/slides']}>
        <Routes>
          <Route path="/admin/*" element={<AdminLayout />} />
        </Routes>
      </MemoryRouter>
    )

    await waitFor(() => {
      expect(screen.getByText('SlidesManager Mock')).toBeInTheDocument()
    })
  })

  it('videos route renders VideosManager', async () => {
    render(
      <MemoryRouter initialEntries={['/admin/videos']}>
        <Routes>
          <Route path="/admin/*" element={<AdminLayout />} />
        </Routes>
      </MemoryRouter>
    )

    await waitFor(() => {
      expect(screen.getByText('VideosManager Mock')).toBeInTheDocument()
    })
  })

  it('songs route renders SongsManager', async () => {
    render(
      <MemoryRouter initialEntries={['/admin/songs']}>
        <Routes>
          <Route path="/admin/*" element={<AdminLayout />} />
        </Routes>
      </MemoryRouter>
    )

    await waitFor(() => {
      expect(screen.getByText('SongsManager Mock')).toBeInTheDocument()
    })
  })
})
