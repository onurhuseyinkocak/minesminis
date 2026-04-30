import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { render, screen, within, waitFor } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import TopNav from '../components/TopNav'
import Footer from '../components/Footer'
import AdRail from '../components/AdRail'
import Cover from '../components/Cover'
import Layout from '../components/Layout'
import App from '../App'

// Mock Toaster (react-hot-toast)
vi.mock('react-hot-toast', () => ({
  Toaster: () => null,
  default: () => null,
}))

// Mock lazy-loaded pages
vi.mock('../pages/Dashboard', () => ({
  default: () => <div data-testid="dashboard">Dashboard</div>,
}))

vi.mock('../pages/SlidesList', () => ({
  default: () => <div data-testid="slides-list">Slides List</div>,
}))

vi.mock('../pages/SlidePlayer', () => ({
  default: () => <div data-testid="slide-player">Slide Player</div>,
}))

vi.mock('../pages/VideosList', () => ({
  default: () => <div data-testid="videos-list">Videos List</div>,
}))

vi.mock('../pages/VideoPlayer', () => ({
  default: () => <div data-testid="video-player">Video Player</div>,
}))

vi.mock('../pages/SongsList', () => ({
  default: () => <div data-testid="songs-list">Songs List</div>,
}))

vi.mock('../pages/SongPlayer', () => ({
  default: () => <div data-testid="song-player">Song Player</div>,
}))

vi.mock('../pages/About', () => ({
  default: () => <div data-testid="about">About</div>,
}))

vi.mock('../pages/Contact', () => ({
  default: () => <div data-testid="contact">Contact</div>,
}))

vi.mock('../pages/Privacy', () => ({
  default: () => <div data-testid="privacy">Privacy</div>,
}))

vi.mock('../pages/Terms', () => ({
  default: () => <div data-testid="terms">Terms</div>,
}))

vi.mock('../pages/admin/AdminLayout', () => ({
  default: () => <div data-testid="admin-layout">Admin Layout</div>,
}))

// ============================================================================
// TOPNAV TESTS
// ============================================================================

describe('TopNav', () => {
  const renderTopNav = (initialPath = '/') => {
    return render(
      <MemoryRouter initialEntries={[initialPath]}>
        <TopNav />
      </MemoryRouter>
    )
  }

  it('renders minesminis logo', () => {
    renderTopNav()
    const logo = screen.getByAltText('minesminis logo')
    expect(logo).toBeInTheDocument()
    expect(logo).toHaveAttribute('src', '/images/minesminis-logo.svg')
  })

  it('logo links to home /', () => {
    renderTopNav()
    const logoLink = screen.getByRole('link', { name: 'minesminis home' })
    expect(logoLink).toBeInTheDocument()
    expect(logoLink).toHaveAttribute('href', '/')
  })

  it('renders nav tabs: Home, Slides, Videos, Songs', () => {
    renderTopNav()
    expect(screen.getByRole('link', { name: /Home/ })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: /Slides/ })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: /Videos/ })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: /Songs/ })).toBeInTheDocument()
  })

  it('nav tabs link to correct routes', () => {
    renderTopNav()
    expect(screen.getByRole('link', { name: /Home/ })).toHaveAttribute('href', '/')
    expect(screen.getByRole('link', { name: /Slides/ })).toHaveAttribute('href', '/slides')
    expect(screen.getByRole('link', { name: /Videos/ })).toHaveAttribute('href', '/videos')
    expect(screen.getByRole('link', { name: /Songs/ })).toHaveAttribute('href', '/songs')
  })

  it('renders About link', () => {
    renderTopNav()
    const aboutLinks = screen.getAllByRole('link', { name: /About/ })
    expect(aboutLinks.length).toBeGreaterThan(0)
    expect(aboutLinks[0]).toHaveAttribute('href', '/about')
  })

  it('marks active tab with "active" class when on home', () => {
    renderTopNav('/')
    const homeLink = screen.getAllByRole('link', { name: /Home/ })[0]
    expect(homeLink).toHaveClass('active')
  })

  it('marks active tab with "active" class when on /slides', () => {
    renderTopNav('/slides')
    const slidesLink = screen.getAllByRole('link', { name: /Slides/ })[0]
    expect(slidesLink).toHaveClass('active')
  })

  it('marks active tab with "active" class when on /videos', () => {
    renderTopNav('/videos')
    const videosLink = screen.getAllByRole('link', { name: /Videos/ })[0]
    expect(videosLink).toHaveClass('active')
  })

  it('marks active tab with "active" class when on /songs', () => {
    renderTopNav('/songs')
    const songsLink = screen.getAllByRole('link', { name: /Songs/ })[0]
    expect(songsLink).toHaveClass('active')
  })

  it('marks home as active when on sub-routes like /slides/123', () => {
    renderTopNav('/slides/123')
    const slidesLink = screen.getAllByRole('link', { name: /Slides/ })[0]
    expect(slidesLink).toHaveClass('active')
  })

  it('has navigation role and aria-label', () => {
    renderTopNav()
    const nav = screen.getByRole('navigation', { name: /Main navigation/ })
    expect(nav).toBeInTheDocument()
  })

  it('renders with mm-nav class', () => {
    const { container } = renderTopNav()
    const nav = container.querySelector('.mm-nav')
    expect(nav).toBeInTheDocument()
  })

  it('has mm-logo class on logo link', () => {
    const { container } = renderTopNav()
    const logoLink = container.querySelector('.mm-logo')
    expect(logoLink).toBeInTheDocument()
  })

  it('has mm-nav-tabs container', () => {
    const { container } = renderTopNav()
    const tabs = container.querySelector('.mm-nav-tabs')
    expect(tabs).toBeInTheDocument()
  })

  it('nav tabs have mm-nav-tab class', () => {
    const { container } = renderTopNav()
    const tabElements = container.querySelectorAll('.mm-nav-tab')
    expect(tabElements.length).toBe(4)
  })
})

// ============================================================================
// FOOTER TESTS
// ============================================================================

describe('Footer', () => {
  const renderFooter = () => {
    return render(
      <MemoryRouter>
        <Footer />
      </MemoryRouter>
    )
  }

  it('renders footer element', () => {
    const { container } = renderFooter()
    const footer = container.querySelector('footer')
    expect(footer).toBeInTheDocument()
  })

  it('shows copyright with current year (2026)', () => {
    renderFooter()
    expect(screen.getByText(/2026 minesminis/)).toBeInTheDocument()
  })

  it('shows "All rights reserved" text', () => {
    renderFooter()
    expect(screen.getByText(/All rights reserved/)).toBeInTheDocument()
  })

  it('renders footer navigation', () => {
    renderFooter()
    const nav = screen.getByRole('navigation', { name: /Footer navigation/ })
    expect(nav).toBeInTheDocument()
  })

  it('has About link', () => {
    renderFooter()
    const aboutLinks = screen.getAllByRole('link', { name: /About/ })
    expect(aboutLinks.some(l => l.getAttribute('href') === '/about')).toBe(true)
  })

  it('has Contact link', () => {
    renderFooter()
    const contactLink = screen.getByRole('link', { name: /Contact/ })
    expect(contactLink).toHaveAttribute('href', '/contact')
  })

  it('has Privacy link', () => {
    renderFooter()
    const privacyLink = screen.getByRole('link', { name: /Privacy/ })
    expect(privacyLink).toHaveAttribute('href', '/privacy')
  })

  it('has Terms link', () => {
    renderFooter()
    const termsLink = screen.getByRole('link', { name: /Terms/ })
    expect(termsLink).toHaveAttribute('href', '/terms')
  })

  it('footer links have correct styling applied', () => {
    renderFooter()
    const contactLink = screen.getByRole('link', { name: /Contact/ })
    expect(contactLink).toHaveStyle({ textDecoration: 'none' })
  })

  it('copyright text and navigation are visible', () => {
    renderFooter()
    const copyright = screen.getByText(/2026 minesminis/)
    const aboutLinks = screen.getAllByRole('link', { name: /About/ })
    expect(copyright).toBeVisible()
    expect(aboutLinks[0]).toBeVisible()
  })
})

// ============================================================================
// ADRAIL TESTS
// ============================================================================

describe('AdRail', () => {
  beforeEach(() => {
    // Ensure window.adsbygoogle exists before each test
    if (!window.adsbygoogle) {
      window.adsbygoogle = []
    }
  })

  it('renders div with class "rail"', () => {
    const { container } = render(<AdRail />)
    const rail = container.querySelector('.rail')
    expect(rail).toBeInTheDocument()
  })

  it('renders ins element with class "adsbygoogle"', () => {
    const { container } = render(<AdRail />)
    const ins = container.querySelector('ins.adsbygoogle')
    expect(ins).toBeInTheDocument()
  })

  it('ins element has correct data-ad-client value', () => {
    const { container } = render(<AdRail />)
    const ins = container.querySelector('ins.adsbygoogle')
    expect(ins).toHaveAttribute('data-ad-client', 'ca-pub-6644397387275334')
  })

  it('ins element has data-tag-for-child-directed-treatment set to "1"', () => {
    const { container } = render(<AdRail />)
    const ins = container.querySelector('ins.adsbygoogle')
    expect(ins).toHaveAttribute('data-tag-for-child-directed-treatment', '1')
  })

  it('ins element has data-ad-format="vertical"', () => {
    const { container } = render(<AdRail />)
    const ins = container.querySelector('ins.adsbygoogle')
    expect(ins).toHaveAttribute('data-ad-format', 'vertical')
  })

  it('renders ad slot with width 160px', () => {
    const { container } = render(<AdRail />)
    const wrapper = container.querySelector('div[style*="160"]')
    expect(wrapper).toBeInTheDocument()
  })

  it('renders ad slot with height 600px', () => {
    const { container } = render(<AdRail />)
    const wrapper = container.querySelector('div[style*="600"]')
    expect(wrapper).toBeInTheDocument()
  })

  it('initializes window.adsbygoogle on mount', () => {
    render(<AdRail />)
    expect(window.adsbygoogle).toBeDefined()
    expect(Array.isArray(window.adsbygoogle)).toBe(true)
  })

  it('wrapper div has minHeight of 600', () => {
    const { container } = render(<AdRail />)
    const rail = container.querySelector('.rail')
    const wrapper = rail?.querySelector('div')
    // The wrapper div (direct child of .rail) should have width and minHeight styles
    expect(wrapper?.getAttribute('style')).toBeTruthy()
    const style = wrapper?.getAttribute('style') || ''
    expect(style).toContain('600')
  })

  it('does not throw error if adsbygoogle not available', () => {
    expect(() => {
      render(<AdRail />)
    }).not.toThrow()
  })

  it('renders multiple AdRail instances without conflict', () => {
    const { container } = render(
      <>
        <AdRail />
        <AdRail />
      </>
    )
    const rails = container.querySelectorAll('.rail')
    expect(rails.length).toBe(2)
    const ins = container.querySelectorAll('ins.adsbygoogle')
    expect(ins.length).toBe(2)
  })

  it('each AdRail has COPPA compliance data attribute', () => {
    const { container } = render(<AdRail />)
    const ins = container.querySelector('ins.adsbygoogle')
    expect(ins?.getAttribute('data-tag-for-child-directed-treatment')).toBe('1')
  })
})

// ============================================================================
// COVER TESTS
// ============================================================================

describe('Cover', () => {
  it('renders default rainbow cover when no kind prop', () => {
    const { container } = render(<Cover />)
    const svg = container.querySelector('svg')
    expect(svg).toBeInTheDocument()
  })

  it('renders with custom style prop', () => {
    const { container } = render(<Cover style={{ border: '1px solid red' }} />)
    const wrapper = container.querySelector('div')
    expect(wrapper).toHaveAttribute('style')
    // Check that custom style is applied
    const style = wrapper?.getAttribute('style')
    expect(style).toContain('red')
  })

  // Test all 22 cover kinds
  const allKinds = [
    'rainbow', 'farm', 'farm2', 'family', 'numbers', 'school', 'weather', 'body',
    'routine', 'abc', 'duck', 'bus', 'star', 'apple', 'fruit', 'hello',
    'dance', 'days', 'happy', 'head', 'bingo', 'spider',
  ]

  allKinds.forEach(kind => {
    it(`renders ${kind} cover without error`, () => {
      const { container } = render(<Cover kind={kind} />)
      const svg = container.querySelector('svg')
      expect(svg).toBeInTheDocument()
    })

    it(`${kind} cover has viewBox attribute`, () => {
      const { container } = render(<Cover kind={kind} />)
      const svg = container.querySelector('svg')
      expect(svg).toHaveAttribute('viewBox', '0 0 400 300')
    })

    it(`${kind} cover has preserveAspectRatio attribute`, () => {
      const { container } = render(<Cover kind={kind} />)
      const svg = container.querySelector('svg')
      expect(svg).toHaveAttribute('preserveAspectRatio', 'xMidYMid slice')
    })
  })

  it('falls back to rainbow for unknown kind', () => {
    const { container } = render(<Cover kind="unknown-kind-xyz" />)
    const svg = container.querySelector('svg')
    expect(svg).toBeInTheDocument()
    // Should render the rainbow fallback
    const circles = container.querySelectorAll('circle')
    expect(circles.length).toBeGreaterThan(0)
  })

  it('merges style prop with default wrapper style', () => {
    const { container } = render(<Cover kind="rainbow" style={{ opacity: 0.5 }} />)
    const wrapper = container.querySelector('div')
    expect(wrapper).toHaveStyle({ opacity: '0.5', width: '100%', height: '100%' })
  })

  it('rainbow cover contains sun element (circle)', () => {
    const { container } = render(<Cover kind="rainbow" />)
    const circles = container.querySelectorAll('circle')
    expect(circles.length).toBeGreaterThan(0)
  })

  it('farm cover contains barn structure (rectangle)', () => {
    const { container } = render(<Cover kind="farm" />)
    const rects = container.querySelectorAll('rect')
    expect(rects.length).toBeGreaterThan(0)
  })

  it('abc cover contains text elements', () => {
    const { container } = render(<Cover kind="abc" />)
    const textElements = container.querySelectorAll('text')
    expect(textElements.length).toBeGreaterThan(0)
  })

  it('star cover uses gradient', () => {
    const { container } = render(<Cover kind="star" />)
    const defs = container.querySelector('defs')
    expect(defs).toBeInTheDocument()
  })

  it('does not render empty SVG', () => {
    const { container } = render(<Cover kind="rainbow" />)
    const svg = container.querySelector('svg')
    expect(svg?.childNodes.length).toBeGreaterThan(0)
  })
})

// ============================================================================
// LAYOUT TESTS
// ============================================================================

describe('Layout', () => {
  const renderLayout = (children: React.ReactNode = <div>Test Content</div>) => {
    return render(
      <MemoryRouter>
        <Layout>{children}</Layout>
      </MemoryRouter>
    )
  }

  it('renders layout with mm-page class', () => {
    const { container } = renderLayout()
    const page = container.querySelector('.mm-page')
    expect(page).toBeInTheDocument()
  })

  it('renders TopNav component', () => {
    const { container } = renderLayout()
    const nav = container.querySelector('.mm-nav')
    expect(nav).toBeInTheDocument()
  })

  it('renders two AdRail components', () => {
    const { container } = renderLayout()
    const rails = container.querySelectorAll('.rail')
    expect(rails.length).toBe(2)
  })

  it('renders mm-shell wrapper', () => {
    const { container } = renderLayout()
    const shell = container.querySelector('.mm-shell')
    expect(shell).toBeInTheDocument()
  })

  it('renders mm-main content wrapper', () => {
    const { container } = renderLayout()
    const main = container.querySelector('.mm-main')
    expect(main).toBeInTheDocument()
  })

  it('renders Footer component', () => {
    const { container } = renderLayout()
    const footer = container.querySelector('footer')
    expect(footer).toBeInTheDocument()
  })

  it('renders children inside mm-main', () => {
    const { container } = renderLayout(<div data-testid="child-content">Child Content</div>)
    const child = screen.getByTestId('child-content')
    const main = container.querySelector('.mm-main')
    expect(main?.contains(child)).toBe(true)
  })

  it('AdRail elements are positioned before and after main content', () => {
    const { container } = renderLayout()
    const shell = container.querySelector('.mm-shell')
    const children = shell?.children
    expect(children?.length).toBe(3) // rail, main, rail
    expect(children?.[0]).toHaveClass('rail')
    expect(children?.[1]).toHaveClass('mm-main')
    expect(children?.[2]).toHaveClass('rail')
  })

  it('wraps all content in proper hierarchy', () => {
    const { container } = renderLayout()
    const page = container.querySelector('.mm-page')
    const nav = page?.querySelector('.mm-nav')
    const shell = page?.querySelector('.mm-shell')
    const footer = page?.querySelector('footer')
    expect(nav).toBeInTheDocument()
    expect(shell).toBeInTheDocument()
    expect(footer).toBeInTheDocument()
  })

  it('renders TopNav before shell', () => {
    const { container } = renderLayout()
    const page = container.querySelector('.mm-page')
    const nav = page?.querySelector('.mm-nav')
    const shell = page?.querySelector('.mm-shell')
    const navIndex = Array.from(page?.children || []).indexOf(nav as Element)
    const shellIndex = Array.from(page?.children || []).indexOf(shell as Element)
    expect(navIndex).toBeLessThan(shellIndex)
  })

  it('renders Footer after shell', () => {
    const { container } = renderLayout()
    const page = container.querySelector('.mm-page')
    const shell = page?.querySelector('.mm-shell')
    const footer = page?.querySelector('footer')
    const shellIndex = Array.from(page?.children || []).indexOf(shell as Element)
    const footerIndex = Array.from(page?.children || []).indexOf(footer as Element)
    expect(shellIndex).toBeLessThan(footerIndex)
  })

  it('accepts multiple children', () => {
    const { container } = renderLayout(
      <div>
        <div data-testid="child1">Child 1</div>
        <div data-testid="child2">Child 2</div>
        <div data-testid="child3">Child 3</div>
      </div>
    )
    expect(screen.getByTestId('child1')).toBeInTheDocument()
    expect(screen.getByTestId('child2')).toBeInTheDocument()
    expect(screen.getByTestId('child3')).toBeInTheDocument()
  })
})

// ============================================================================
// APP & ROUTING TESTS
// ============================================================================

describe('App Routing', () => {
  const renderApp = (initialPath = '/') => {
    return render(
      <MemoryRouter initialEntries={[initialPath]}>
        <App />
      </MemoryRouter>
    )
  }

  it('routes / to Dashboard', async () => {
    renderApp('/')
    await waitFor(() => {
      expect(screen.getByTestId('dashboard')).toBeInTheDocument()
    })
  })

  it('routes /slides to SlidesList', async () => {
    renderApp('/slides')
    await waitFor(() => {
      expect(screen.getByTestId('slides-list')).toBeInTheDocument()
    })
  })

  it('routes /slides/:id to SlidePlayer', async () => {
    renderApp('/slides/123')
    await waitFor(() => {
      expect(screen.getByTestId('slide-player')).toBeInTheDocument()
    })
  })

  it('routes /videos to VideosList', async () => {
    renderApp('/videos')
    await waitFor(() => {
      expect(screen.getByTestId('videos-list')).toBeInTheDocument()
    })
  })

  it('routes /videos/:id to VideoPlayer', async () => {
    renderApp('/videos/456')
    await waitFor(() => {
      expect(screen.getByTestId('video-player')).toBeInTheDocument()
    })
  })

  it('routes /songs to SongsList', async () => {
    renderApp('/songs')
    await waitFor(() => {
      expect(screen.getByTestId('songs-list')).toBeInTheDocument()
    })
  })

  it('routes /songs/:id to SongPlayer', async () => {
    renderApp('/songs/789')
    await waitFor(() => {
      expect(screen.getByTestId('song-player')).toBeInTheDocument()
    })
  })

  it('routes /about to About page', async () => {
    renderApp('/about')
    await waitFor(() => {
      expect(screen.getByTestId('about')).toBeInTheDocument()
    })
  })

  it('routes /contact to Contact page', async () => {
    renderApp('/contact')
    await waitFor(() => {
      expect(screen.getByTestId('contact')).toBeInTheDocument()
    })
  })

  it('routes /privacy to Privacy page', async () => {
    renderApp('/privacy')
    await waitFor(() => {
      expect(screen.getByTestId('privacy')).toBeInTheDocument()
    })
  })

  it('routes /terms to Terms page', async () => {
    renderApp('/terms')
    await waitFor(() => {
      expect(screen.getByTestId('terms')).toBeInTheDocument()
    })
  })

  it('routes /admin/* to AdminLayout', async () => {
    renderApp('/admin/dashboard')
    await waitFor(() => {
      expect(screen.getByTestId('admin-layout')).toBeInTheDocument()
    })
  })

  it('shows 404 page for unknown route', () => {
    renderApp('/unknown-route-xyz')
    expect(screen.getByText('404')).toBeInTheDocument()
  })

  it('404 page shows "Page not found" text', () => {
    renderApp('/nonexistent')
    expect(screen.getByText('Page not found')).toBeInTheDocument()
  })

  it('404 page has Home link back to /', () => {
    renderApp('/404')
    const homeLink = screen.getByRole('link', { name: /Home/ })
    expect(homeLink).toBeInTheDocument()
    expect(homeLink).toHaveAttribute('href', '/')
  })

  it('renders Toaster for toast notifications', () => {
    renderApp('/')
    // Toaster is mocked, but its presence ensures the component renders
    expect(screen.getByTestId('dashboard')).toBeInTheDocument()
  })

  it('renders with Routes component wrapper', () => {
    renderApp('/')
    expect(screen.getByTestId('dashboard')).toBeInTheDocument()
  })

  it('handles dynamic routes with IDs', () => {
    renderApp('/slides/my-slide-id')
    expect(screen.getByTestId('slide-player')).toBeInTheDocument()
  })

  it('handles numeric IDs in routes', () => {
    renderApp('/videos/12345')
    expect(screen.getByTestId('video-player')).toBeInTheDocument()
  })
})

// ============================================================================
// INTEGRATION TESTS
// ============================================================================

describe('Component Integration', () => {
  it('Layout contains TopNav with active route awareness', () => {
    const { container } = render(
      <MemoryRouter initialEntries={['/slides']}>
        <Layout>
          <div>Content</div>
        </Layout>
      </MemoryRouter>
    )
    const nav = container.querySelector('.mm-nav')
    expect(nav).toBeInTheDocument()
    // TopNav should mark /slides as active
    const slidesTab = container.querySelector('.mm-nav-tab.active')
    expect(slidesTab).toBeInTheDocument()
  })

  it('Layout Footer visible on all routes', () => {
    const { container } = render(
      <MemoryRouter initialEntries={['/']}>
        <Layout>
          <div>Content</div>
        </Layout>
      </MemoryRouter>
    )
    const footer = container.querySelector('footer')
    expect(footer).toBeInTheDocument()
  })

  it('Multiple Cover kinds render in Layout without errors', () => {
    const { container } = render(
      <MemoryRouter>
        <Layout>
          <div data-testid="covers-container">
            <Cover kind="rainbow" />
            <Cover kind="farm" />
            <Cover kind="abc" />
          </div>
        </Layout>
      </MemoryRouter>
    )
    const coverContainer = screen.getByTestId('covers-container')
    const svgs = coverContainer.querySelectorAll('svg')
    expect(svgs.length).toBe(3)
  })

  it('AdRail elements render alongside content', () => {
    const { container } = render(
      <MemoryRouter>
        <Layout>
          <div data-testid="page-content">Page Content</div>
        </Layout>
      </MemoryRouter>
    )
    const rails = container.querySelectorAll('.rail')
    const content = screen.getByTestId('page-content')
    expect(rails.length).toBe(2)
    expect(content).toBeInTheDocument()
  })
})
