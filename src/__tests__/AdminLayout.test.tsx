import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter, Routes, Route } from 'react-router-dom'
import AdminLayout from '../pages/admin/AdminLayout'

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
  Presentation: ({ size }: { size: number }) => <span data-testid="icon-presentation" />,
  Video: ({ size }: { size: number }) => <span data-testid="icon-video" />,
  Music: ({ size }: { size: number }) => <span data-testid="icon-music" />,
  LogOut: ({ size }: { size: number }) => <span data-testid="icon-logout" />,
  LayoutDashboard: ({ size }: { size: number }) => <span data-testid="icon-dashboard" />,
}))

describe('AdminLayout - Login Form', () => {
  beforeEach(() => {
    sessionStorage.clear()
  })

  it('renders login form when not authenticated', () => {
    render(
      <MemoryRouter>
        <AdminLayout />
      </MemoryRouter>
    )

    expect(screen.getByText('Admin Panel')).toBeInTheDocument()
    expect(screen.getByText('minesminis management')).toBeInTheDocument()
  })

  it('renders password input field in login form', () => {
    render(
      <MemoryRouter>
        <AdminLayout />
      </MemoryRouter>
    )

    const passwordInput = screen.getByPlaceholderText('Password')
    expect(passwordInput).toBeInTheDocument()
    expect(passwordInput).toHaveAttribute('type', 'password')
  })

  it('renders Sign In button in login form', () => {
    render(
      <MemoryRouter>
        <AdminLayout />
      </MemoryRouter>
    )

    const signInButton = screen.getByRole('button', { name: /Sign In/i })
    expect(signInButton).toBeInTheDocument()
  })

  it('shows error message when wrong password is submitted', async () => {
    const user = userEvent.setup()

    render(
      <MemoryRouter>
        <AdminLayout />
      </MemoryRouter>
    )

    const passwordInput = screen.getByPlaceholderText('Password')
    const signInButton = screen.getByRole('button', { name: /Sign In/i })

    await user.type(passwordInput, 'wrongpass')
    await user.click(signInButton)

    await waitFor(() => {
      expect(screen.getByText('Wrong password')).toBeInTheDocument()
    })
  })

  it('clears error message when user types in password field after failed login', async () => {
    const user = userEvent.setup()

    render(
      <MemoryRouter>
        <AdminLayout />
      </MemoryRouter>
    )

    const passwordInput = screen.getByPlaceholderText('Password') as HTMLInputElement
    const signInButton = screen.getByRole('button', { name: /Sign In/i })

    // Submit wrong password
    await user.type(passwordInput, 'wrongpass')
    await user.click(signInButton)

    await waitFor(() => {
      expect(screen.getByText('Wrong password')).toBeInTheDocument()
    })

    // Type more characters to clear error
    await user.type(passwordInput, '123')

    await waitFor(() => {
      expect(screen.queryByText('Wrong password')).not.toBeInTheDocument()
    })
  })

  it('stores mm-admin token in sessionStorage when correct password is submitted', async () => {
    const user = userEvent.setup()

    render(
      <MemoryRouter>
        <AdminLayout />
      </MemoryRouter>
    )

    const passwordInput = screen.getByPlaceholderText('Password')
    const signInButton = screen.getByRole('button', { name: /Sign In/i })

    await user.type(passwordInput, 'testpass123')
    await user.click(signInButton)

    await waitFor(() => {
      expect(sessionStorage.getItem('mm-admin')).toBe('1')
    })
  })
})

describe('AdminLayout - Authenticated State', () => {
  beforeEach(() => {
    sessionStorage.clear()
  })

  it('shows dashboard after correct password login', async () => {
    const user = userEvent.setup()

    render(
      <MemoryRouter>
        <AdminLayout />
      </MemoryRouter>
    )

    const passwordInput = screen.getByPlaceholderText('Password')
    const signInButton = screen.getByRole('button', { name: /Sign In/i })

    await user.type(passwordInput, 'testpass123')
    await user.click(signInButton)

    await waitFor(() => {
      expect(screen.getByRole('heading', { name: /^Dashboard$/i })).toBeInTheDocument()
      expect(screen.getByText('minesminis content management')).toBeInTheDocument()
    })
  })

  it('shows sidebar with minesminis logo after authentication', async () => {
    const user = userEvent.setup()

    render(
      <MemoryRouter>
        <AdminLayout />
      </MemoryRouter>
    )

    await user.type(screen.getByPlaceholderText('Password'), 'testpass123')
    await user.click(screen.getByRole('button', { name: /Sign In/i }))

    await waitFor(() => {
      const logo = screen.getByAltText('minesminis')
      expect(logo).toBeInTheDocument()
      expect(logo).toHaveAttribute('src', '/images/minesminis-logo.svg')
    })
  })

  it('renders sidebar navigation items after authentication', async () => {
    const user = userEvent.setup()

    render(
      <MemoryRouter>
        <AdminLayout />
      </MemoryRouter>
    )

    await user.type(screen.getByPlaceholderText('Password'), 'testpass123')
    await user.click(screen.getByRole('button', { name: /Sign In/i }))

    await waitFor(() => {
      // Check sidebar nav items (not just any text with these names)
      const navLinks = screen.getAllByRole('link')
      const dashboardNav = navLinks.find(link => link.textContent?.includes('Dashboard'))
      const slidesNav = navLinks.find(link => link.textContent?.includes('Slides'))
      const videosNav = navLinks.find(link => link.textContent?.includes('Videos'))
      const songsNav = navLinks.find(link => link.textContent?.includes('Songs'))

      expect(dashboardNav).toBeInTheDocument()
      expect(slidesNav).toBeInTheDocument()
      expect(videosNav).toBeInTheDocument()
      expect(songsNav).toBeInTheDocument()
    })
  })

  it('renders Sign Out button in sidebar after authentication', async () => {
    const user = userEvent.setup()

    render(
      <MemoryRouter>
        <AdminLayout />
      </MemoryRouter>
    )

    await user.type(screen.getByPlaceholderText('Password'), 'testpass123')
    await user.click(screen.getByRole('button', { name: /Sign In/i }))

    await waitFor(() => {
      expect(screen.getByRole('button', { name: /Sign Out/i })).toBeInTheDocument()
    })
  })

  it('clears sessionStorage and logs out when Sign Out button is clicked', async () => {
    const user = userEvent.setup()

    // Pre-authenticate
    sessionStorage.setItem('mm-admin', '1')

    render(
      <MemoryRouter>
        <AdminLayout />
      </MemoryRouter>
    )

    // Initially showing dashboard
    await waitFor(() => {
      expect(screen.getByRole('heading', { name: /^Dashboard$/i })).toBeInTheDocument()
    })

    // Click sign out
    const signOutButton = screen.getByRole('button', { name: /Sign Out/i })
    await user.click(signOutButton)

    await waitFor(() => {
      expect(sessionStorage.getItem('mm-admin')).toBeNull()
      expect(screen.getByText('Admin Panel')).toBeInTheDocument() // Back to login
    })
  })
})

describe('AdminLayout - Dashboard', () => {
  beforeEach(() => {
    sessionStorage.clear()
    sessionStorage.setItem('mm-admin', '1')
  })

  it('displays 3 dashboard cards: Slides, Videos, Songs', () => {
    render(
      <MemoryRouter>
        <AdminLayout />
      </MemoryRouter>
    )

    const slides = screen.getAllByText('Slides')
    const videos = screen.getAllByText('Videos')
    const songs = screen.getAllByText('Songs')

    // Cards appear in dashboard
    expect(slides.length).toBeGreaterThan(0)
    expect(videos.length).toBeGreaterThan(0)
    expect(songs.length).toBeGreaterThan(0)
  })

  it('dashboard cards display Manage content text', () => {
    render(
      <MemoryRouter>
        <AdminLayout />
      </MemoryRouter>
    )

    const manageTexts = screen.getAllByText('Manage content')
    expect(manageTexts.length).toBe(3)
  })

  it('Slides card links to /admin/slides', () => {
    render(
      <MemoryRouter>
        <AdminLayout />
      </MemoryRouter>
    )

    const links = screen.getAllByRole('link')
    const slidesLink = links.find(link => {
      const nav = link.getAttribute('href')
      return nav === '/admin/slides'
    })

    expect(slidesLink).toBeInTheDocument()
  })

  it('Videos card links to /admin/videos', () => {
    render(
      <MemoryRouter>
        <AdminLayout />
      </MemoryRouter>
    )

    const links = screen.getAllByRole('link')
    const videosLink = links.find(link => {
      return link.getAttribute('href') === '/admin/videos'
    })

    expect(videosLink).toBeInTheDocument()
  })

  it('Songs card links to /admin/songs', () => {
    render(
      <MemoryRouter>
        <AdminLayout />
      </MemoryRouter>
    )

    const links = screen.getAllByRole('link')
    const songsLink = links.find(link => {
      return link.getAttribute('href') === '/admin/songs'
    })

    expect(songsLink).toBeInTheDocument()
  })

  it('logo link navigates to home (/)', () => {
    render(
      <MemoryRouter>
        <AdminLayout />
      </MemoryRouter>
    )

    const links = screen.getAllByRole('link')
    const homeLink = links.find(link => {
      return link.getAttribute('href') === '/'
    })

    expect(homeLink).toBeInTheDocument()
  })
})

describe('AdminLayout - Navigation', () => {
  beforeEach(() => {
    sessionStorage.clear()
    sessionStorage.setItem('mm-admin', '1')
  })

  it('sidebar has all navigation links', () => {
    render(
      <MemoryRouter initialEntries={['/admin']}>
        <Routes>
          <Route path="/admin/*" element={<AdminLayout />} />
        </Routes>
      </MemoryRouter>
    )

    const links = screen.getAllByRole('link')

    const dashboardLink = links.find(link => link.getAttribute('href') === '/admin' && link.textContent?.includes('Dashboard'))
    const slidesLink = links.find(link => link.getAttribute('href') === '/admin/slides' && link.textContent?.includes('Slides'))
    const videosLink = links.find(link => link.getAttribute('href') === '/admin/videos' && link.textContent?.includes('Videos'))
    const songsLink = links.find(link => link.getAttribute('href') === '/admin/songs' && link.textContent?.includes('Songs'))

    expect(dashboardLink).toBeInTheDocument()
    expect(slidesLink).toBeInTheDocument()
    expect(videosLink).toBeInTheDocument()
    expect(songsLink).toBeInTheDocument()
  })

  it('dashboard route renders AdminDashboard component', () => {
    render(
      <MemoryRouter initialEntries={['/admin']}>
        <Routes>
          <Route path="/admin/*" element={<AdminLayout />} />
        </Routes>
      </MemoryRouter>
    )

    expect(screen.getByRole('heading', { name: /^Dashboard$/i })).toBeInTheDocument()
    expect(screen.getByText('minesminis content management')).toBeInTheDocument()
  })

  it('slides route renders SlidesManager', () => {
    render(
      <MemoryRouter initialEntries={['/admin/slides']}>
        <Routes>
          <Route path="/admin/*" element={<AdminLayout />} />
        </Routes>
      </MemoryRouter>
    )

    expect(screen.getByText('SlidesManager Mock')).toBeInTheDocument()
  })

  it('videos route renders VideosManager', () => {
    render(
      <MemoryRouter initialEntries={['/admin/videos']}>
        <Routes>
          <Route path="/admin/*" element={<AdminLayout />} />
        </Routes>
      </MemoryRouter>
    )

    expect(screen.getByText('VideosManager Mock')).toBeInTheDocument()
  })

  it('songs route renders SongsManager', () => {
    render(
      <MemoryRouter initialEntries={['/admin/songs']}>
        <Routes>
          <Route path="/admin/*" element={<AdminLayout />} />
        </Routes>
      </MemoryRouter>
    )

    expect(screen.getByText('SongsManager Mock')).toBeInTheDocument()
  })
})

describe('AdminLayout - sessionStorage Integration', () => {
  beforeEach(() => {
    sessionStorage.clear()
  })

  it('loads authenticated state from sessionStorage on mount', () => {
    sessionStorage.setItem('mm-admin', '1')

    render(
      <MemoryRouter>
        <AdminLayout />
      </MemoryRouter>
    )

    // Should show authenticated view (dashboard) not login form
    expect(screen.getByRole('heading', { name: /^Dashboard$/i })).toBeInTheDocument()
    expect(screen.queryByText('Admin Panel')).not.toBeInTheDocument()
  })

  it('returns to login form when sessionStorage mm-admin is missing on mount', () => {
    sessionStorage.clear()

    render(
      <MemoryRouter>
        <AdminLayout />
      </MemoryRouter>
    )

    expect(screen.getByText('Admin Panel')).toBeInTheDocument()
    expect(screen.queryByText('Dashboard')).not.toBeInTheDocument()
  })

  it('ignores invalid sessionStorage mm-admin values and shows login', () => {
    sessionStorage.setItem('mm-admin', 'invalid')

    render(
      <MemoryRouter>
        <AdminLayout />
      </MemoryRouter>
    )

    expect(screen.getByText('Admin Panel')).toBeInTheDocument()
    expect(screen.queryByRole('heading', { name: /^Dashboard$/i })).not.toBeInTheDocument()
  })
})
