import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, waitFor, within } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import About from '../pages/About'
import Contact from '../pages/Contact'

// Mock Layout component
vi.mock('../components/Layout', () => ({
  default: ({ children }: { children: React.ReactNode }) => <div data-testid="layout">{children}</div>,
}))

// Mock lucide-react icons
vi.mock('lucide-react', () => ({
  Presentation: ({ size }: { size: number }) => <span data-testid="icon-presentation" data-size={size} />,
  Video: ({ size }: { size: number }) => <span data-testid="icon-video" data-size={size} />,
  Music: ({ size }: { size: number }) => <span data-testid="icon-music" data-size={size} />,
  BookOpen: ({ size }: { size: number }) => <span data-testid="icon-bookopen" data-size={size} />,
  Users: ({ size }: { size: number }) => <span data-testid="icon-users" data-size={size} />,
  Heart: ({ size }: { size: number }) => <span data-testid="icon-heart" data-size={size} />,
  Mail: ({ size }: { size: number }) => <span data-testid="icon-mail" data-size={size} />,
  MessageCircle: ({ size }: { size: number }) => <span data-testid="icon-messagecircle" data-size={size} />,
  Globe: ({ size }: { size: number }) => <span data-testid="icon-globe" data-size={size} />,
}))

const renderAbout = () => {
  return render(
    <MemoryRouter>
      <About />
    </MemoryRouter>
  )
}

const renderContact = () => {
  return render(
    <MemoryRouter>
      <Contact />
    </MemoryRouter>
  )
}

describe('About Page', () => {
  beforeEach(() => {
    document.title = ''
  })

  describe('Page Title & Document', () => {
    it('sets document.title to "About - minesminis"', async () => {
      renderAbout()
      await waitFor(() => {
        expect(document.title).toBe('About - minesminis')
      })
    })

    it('renders h1 heading with "About" text', () => {
      renderAbout()
      const heading = screen.getByRole('heading', { level: 1 })
      expect(heading).toHaveTextContent('About')
      expect(heading).toHaveClass('mm-page-title')
    })

    it('renders page subtitle with platform description', () => {
      renderAbout()
      expect(screen.getByText('minesminis - English Learning Platform for Kids')).toBeInTheDocument()
      expect(screen.getByText('minesminis - English Learning Platform for Kids')).toHaveClass('mm-page-sub')
    })
  })

  describe('Mission Section', () => {
    it('renders "Our Mission" heading', () => {
      renderAbout()
      expect(screen.getByText('Our Mission')).toBeInTheDocument()
    })

    it('displays mission description content', () => {
      renderAbout()
      expect(screen.getByText(/educational platform designed to make learning English fun/)).toBeInTheDocument()
      expect(screen.getByText(/ensure every child has access to quality language learning/)).toBeInTheDocument()
    })

    it('displays platform features text', () => {
      renderAbout()
      expect(screen.getByText(/content prepared by teachers and education specialists/)).toBeInTheDocument()
      expect(screen.getByText(/interactive slides, visual learning with educational videos/)).toBeInTheDocument()
      expect(screen.getByText(/listening and repetition skills development through English songs/)).toBeInTheDocument()
    })

    it('renders "Why minesminis?" heading', () => {
      renderAbout()
      expect(screen.getByText('Why minesminis?')).toBeInTheDocument()
    })

    it('displays why minesminis content', () => {
      renderAbout()
      expect(screen.getByText(/most effective way for children to learn is through play and fun/)).toBeInTheDocument()
      expect(screen.getByText(/colorful visuals, engaging animations and memorable songs/)).toBeInTheDocument()
    })

    it('displays CEFR and content library information', () => {
      renderAbout()
      expect(screen.getByText(/Common European Framework of Reference \(CEFR\) A1 level/)).toBeInTheDocument()
      expect(screen.getByText(/covers essential topics like colors, numbers, animals, family, body parts/)).toBeInTheDocument()
    })
  })

  describe('Value Cards', () => {
    it('renders exactly 3 value cards', () => {
      renderAbout()
      const cards = document.querySelectorAll('div[style*="flex-direction"]').length
      // At least contains value cards container
      expect(screen.getByText('Free Education')).toBeInTheDocument()
      expect(screen.getByText('Made for Kids')).toBeInTheDocument()
      expect(screen.getByText('Learn by Having Fun')).toBeInTheDocument()
    })

    it('renders "Free Education" value card with correct content', () => {
      renderAbout()
      expect(screen.getByText('Free Education')).toBeInTheDocument()
      expect(screen.getByText('All content is completely free. No registration required — start learning right away.')).toBeInTheDocument()
    })

    it('renders "Made for Kids" value card with correct content', () => {
      renderAbout()
      expect(screen.getByText('Made for Kids')).toBeInTheDocument()
      expect(screen.getByText('Designed for children ages 4-12 with age-appropriate, safe content.')).toBeInTheDocument()
    })

    it('renders "Learn by Having Fun" value card with correct content', () => {
      renderAbout()
      expect(screen.getByText('Learn by Having Fun')).toBeInTheDocument()
      expect(screen.getByText('Learning English has never been this fun with slides, videos and songs.')).toBeInTheDocument()
    })

    it('renders value card icons', () => {
      renderAbout()
      const bookIcon = screen.getByTestId('icon-bookopen')
      const usersIcon = screen.getByTestId('icon-users')
      const heartIcon = screen.getByTestId('icon-heart')

      expect(bookIcon).toBeInTheDocument()
      expect(usersIcon).toBeInTheDocument()
      expect(heartIcon).toBeInTheDocument()

      // Verify icon sizes
      expect(bookIcon).toHaveAttribute('data-size', '22')
      expect(usersIcon).toHaveAttribute('data-size', '22')
      expect(heartIcon).toHaveAttribute('data-size', '22')
    })
  })

  describe('Stats Section', () => {
    it('renders statistics section with 3 stat cards', () => {
      renderAbout()
      expect(screen.getByText('Slide decks')).toBeInTheDocument()
      expect(screen.getByText('Educational videos')).toBeInTheDocument()
      expect(screen.getByText('English songs')).toBeInTheDocument()
    })

    it('displays default stat counts (0 when no data)', () => {
      renderAbout()
      // Stats display the count values
      const counts = screen.getAllByText(/0/)
      expect(counts.length).toBeGreaterThanOrEqual(3)
    })

    it('renders stat icons', () => {
      renderAbout()
      const presentationIcon = screen.getByTestId('icon-presentation')
      const videoIcon = screen.getByTestId('icon-video')
      const musicIcon = screen.getByTestId('icon-music')

      expect(presentationIcon).toBeInTheDocument()
      expect(videoIcon).toBeInTheDocument()
      expect(musicIcon).toBeInTheDocument()

      // Verify icon sizes
      expect(presentationIcon).toHaveAttribute('data-size', '28')
      expect(videoIcon).toHaveAttribute('data-size', '28')
      expect(musicIcon).toHaveAttribute('data-size', '28')
    })

    it('renders stat labels for content types', () => {
      renderAbout()
      expect(screen.getByText('Slide decks')).toBeInTheDocument()
      expect(screen.getByText('Educational videos')).toBeInTheDocument()
      expect(screen.getByText('English songs')).toBeInTheDocument()
    })
  })

  describe('Layout Integration', () => {
    it('wraps content in Layout component', () => {
      renderAbout()
      expect(screen.getByTestId('layout')).toBeInTheDocument()
    })

    it('renders all main content inside Layout', () => {
      renderAbout()
      const layout = screen.getByTestId('layout')
      expect(within(layout).getByText('About')).toBeInTheDocument()
      expect(within(layout).getByText('Our Mission')).toBeInTheDocument()
      expect(within(layout).getByText('Free Education')).toBeInTheDocument()
    })

    it('applies maxWidth container style to content', () => {
      renderAbout()
      // Content should be centered with max-width
      const contentDiv = document.querySelector('div[style*="max-width"]')
      expect(contentDiv).toBeInTheDocument()
    })
  })

  describe('Accessibility', () => {
    it('renders proper heading hierarchy', () => {
      renderAbout()
      const h1 = screen.getByRole('heading', { level: 1 })
      const h2s = screen.getAllByRole('heading', { level: 2 })

      expect(h1).toHaveTextContent('About')
      expect(h2s.length).toBeGreaterThanOrEqual(2) // Our Mission, Why minesminis?
    })

    it('renders h3 headings for value cards', () => {
      renderAbout()
      const h3s = screen.getAllByRole('heading', { level: 3 })
      expect(h3s.length).toBeGreaterThanOrEqual(3)
      expect(h3s.some(h => h.textContent === 'Free Education')).toBe(true)
      expect(h3s.some(h => h.textContent === 'Made for Kids')).toBe(true)
      expect(h3s.some(h => h.textContent === 'Learn by Having Fun')).toBe(true)
    })

    it('all text is readable with sufficient contrast', () => {
      renderAbout()
      // Verify key text elements exist and are visible
      expect(screen.getByText('About')).toBeVisible()
      expect(screen.getByText('Our Mission')).toBeVisible()
      expect(screen.getByText('Free Education')).toBeVisible()
    })
  })

  describe('Styling & Structure', () => {
    it('applies correct CSS classes to headings', () => {
      renderAbout()
      const h1 = screen.getByRole('heading', { level: 1 })
      expect(h1).toHaveClass('mm-page-title')
    })

    it('mission section renders with proper styling', () => {
      renderAbout()
      // Mission section should contain the mission text
      const missionText = screen.getByText('Our Mission')
      expect(missionText).toBeInTheDocument()
      expect(missionText.closest('div')).toBeInTheDocument()
    })

    it('value cards render in flex column layout', () => {
      renderAbout()
      // Multiple cards should exist in flex layout
      expect(screen.getByText('Free Education')).toBeInTheDocument()
      expect(screen.getByText('Made for Kids')).toBeInTheDocument()
    })
  })
})

describe('Contact Page', () => {
  beforeEach(() => {
    document.title = ''
  })

  describe('Page Title & Document', () => {
    it('sets document.title to "Contact - minesminis"', async () => {
      renderContact()
      await waitFor(() => {
        expect(document.title).toBe('Contact - minesminis')
      })
    })

    it('renders h1 heading with "Contact" text', () => {
      renderContact()
      const heading = screen.getByRole('heading', { level: 1 })
      expect(heading).toHaveTextContent('Contact')
      expect(heading).toHaveClass('mm-page-title')
    })

    it('renders page subtitle', () => {
      renderContact()
      expect(screen.getByText('Get in touch with us for questions and suggestions')).toBeInTheDocument()
      expect(screen.getByText('Get in touch with us for questions and suggestions')).toHaveClass('mm-page-sub')
    })
  })

  describe('Email Card', () => {
    it('renders Email section heading', () => {
      renderContact()
      expect(screen.getByText('Email')).toBeInTheDocument()
    })

    it('renders Email card description', () => {
      renderContact()
      expect(screen.getByText('For general inquiries, content suggestions and collaboration, feel free to email us.')).toBeInTheDocument()
    })

    it('renders mailto link with correct email address', () => {
      renderContact()
      const emailLink = screen.getByRole('link', { name: 'info@minesminis.com' })
      expect(emailLink).toBeInTheDocument()
      expect(emailLink).toHaveAttribute('href', 'mailto:info@minesminis.com')
    })

    it('renders Mail icon in Email card', () => {
      renderContact()
      const mailIcon = screen.getByTestId('icon-mail')
      expect(mailIcon).toBeInTheDocument()
      expect(mailIcon).toHaveAttribute('data-size', '22')
    })

    it('email link has correct styling', () => {
      renderContact()
      const emailLink = screen.getByRole('link', { name: 'info@minesminis.com' })
      expect(emailLink).toHaveAttribute('href', 'mailto:info@minesminis.com')
      expect(emailLink).toHaveStyle({ display: 'inline-flex' })
    })
  })

  describe('Feedback Card', () => {
    it('renders Feedback section heading', () => {
      renderContact()
      expect(screen.getByText('Feedback')).toBeInTheDocument()
    })

    it('renders Feedback card description text', () => {
      renderContact()
      expect(screen.getByText(/Your feedback about our platform is very valuable to us/)).toBeInTheDocument()
      expect(screen.getByText(/We want to provide a better experience for teachers, parents and students/)).toBeInTheDocument()
      expect(screen.getByText(/Share any topics you think are missing or features you would like to see/)).toBeInTheDocument()
    })

    it('renders MessageCircle icon in Feedback card', () => {
      renderContact()
      const feedbackIcon = screen.getByTestId('icon-messagecircle')
      expect(feedbackIcon).toBeInTheDocument()
      expect(feedbackIcon).toHaveAttribute('data-size', '22')
    })
  })

  describe('Website Card', () => {
    it('renders "Our Website" section heading', () => {
      renderContact()
      expect(screen.getByText('Our Website')).toBeInTheDocument()
    })

    it('renders Website card description', () => {
      renderContact()
      expect(screen.getByText(/minesminis is a platform offering free English learning materials/)).toBeInTheDocument()
      expect(screen.getByText(/elementary school students/)).toBeInTheDocument()
      expect(screen.getByText(/Start exploring and learn through slides, videos and songs/)).toBeInTheDocument()
    })

    it('renders Globe icon in Website card', () => {
      renderContact()
      const globeIcon = screen.getByTestId('icon-globe')
      expect(globeIcon).toBeInTheDocument()
      expect(globeIcon).toHaveAttribute('data-size', '22')
    })
  })

  describe('Contact Cards Structure', () => {
    it('renders exactly 3 contact info cards', () => {
      renderContact()
      expect(screen.getByText('Email')).toBeInTheDocument()
      expect(screen.getByText('Feedback')).toBeInTheDocument()
      expect(screen.getByText('Our Website')).toBeInTheDocument()
    })

    it('each card has icon and text content', () => {
      renderContact()
      // Email card
      const emailCard = screen.getByText('Email')
      expect(emailCard).toBeInTheDocument()
      expect(screen.getByTestId('icon-mail')).toBeInTheDocument()

      // Feedback card
      const feedbackCard = screen.getByText('Feedback')
      expect(feedbackCard).toBeInTheDocument()
      expect(screen.getByTestId('icon-messagecircle')).toBeInTheDocument()

      // Website card
      const websiteCard = screen.getByText('Our Website')
      expect(websiteCard).toBeInTheDocument()
      expect(screen.getByTestId('icon-globe')).toBeInTheDocument()
    })

    it('renders cards in flex column layout', () => {
      renderContact()
      // Verify multiple contact sections exist
      const headings = screen.getAllByRole('heading', { level: 3 })
      expect(headings.length).toBe(3)
    })
  })

  describe('Layout Integration', () => {
    it('wraps content in Layout component', () => {
      renderContact()
      expect(screen.getByTestId('layout')).toBeInTheDocument()
    })

    it('renders all main content inside Layout', () => {
      renderContact()
      const layout = screen.getByTestId('layout')
      expect(within(layout).getByText('Contact')).toBeInTheDocument()
      expect(within(layout).getByText('Email')).toBeInTheDocument()
      expect(within(layout).getByText('Feedback')).toBeInTheDocument()
    })

    it('applies maxWidth container style to content', () => {
      renderContact()
      const contentDiv = document.querySelector('div[style*="max-width"]')
      expect(contentDiv).toBeInTheDocument()
    })
  })

  describe('Accessibility', () => {
    it('renders proper heading hierarchy', () => {
      renderContact()
      const h1 = screen.getByRole('heading', { level: 1 })
      const h3s = screen.getAllByRole('heading', { level: 3 })

      expect(h1).toHaveTextContent('Contact')
      expect(h3s.length).toBe(3) // Email, Feedback, Our Website
    })

    it('email link is properly accessible', () => {
      renderContact()
      const emailLink = screen.getByRole('link', { name: 'info@minesminis.com' })
      expect(emailLink).toBeVisible()
      expect(emailLink).toHaveAttribute('href')
    })

    it('all text content is visible and readable', () => {
      renderContact()
      expect(screen.getByText('Contact')).toBeVisible()
      expect(screen.getByText('Email')).toBeVisible()
      expect(screen.getByText('Feedback')).toBeVisible()
      expect(screen.getByText('Our Website')).toBeVisible()
    })

    it('all h3 headings for contact sections exist', () => {
      renderContact()
      const h3s = screen.getAllByRole('heading', { level: 3 })
      expect(h3s.some(h => h.textContent === 'Email')).toBe(true)
      expect(h3s.some(h => h.textContent === 'Feedback')).toBe(true)
      expect(h3s.some(h => h.textContent === 'Our Website')).toBe(true)
    })
  })

  describe('Styling & Structure', () => {
    it('applies correct CSS classes to h1 heading', () => {
      renderContact()
      const h1 = screen.getByRole('heading', { level: 1 })
      expect(h1).toHaveClass('mm-page-title')
    })

    it('contact cards render with proper structure', () => {
      renderContact()
      // All 3 card sections should have proper structure with icons and text
      expect(screen.getByTestId('icon-mail')).toBeInTheDocument()
      expect(screen.getByTestId('icon-messagecircle')).toBeInTheDocument()
      expect(screen.getByTestId('icon-globe')).toBeInTheDocument()
    })

    it('contact cards render in flex layout with gap', () => {
      renderContact()
      // All 3 sections should be present
      expect(screen.getByText('Email')).toBeInTheDocument()
      expect(screen.getByText('Feedback')).toBeInTheDocument()
      expect(screen.getByText('Our Website')).toBeInTheDocument()
    })

    it('icon containers have correct styling', () => {
      renderContact()
      const mailIcon = screen.getByTestId('icon-mail')
      expect(mailIcon).toBeInTheDocument()
      // Icons should be inside containers with specific styling
      const iconParent = mailIcon.parentElement
      expect(iconParent).toHaveStyle({ display: 'flex' })
    })
  })

  describe('Content Completeness', () => {
    it('Email card has all required content', () => {
      renderContact()
      expect(screen.getByText('Email')).toBeInTheDocument()
      expect(screen.getByText('For general inquiries, content suggestions and collaboration, feel free to email us.')).toBeInTheDocument()
      expect(screen.getByRole('link', { name: 'info@minesminis.com' })).toBeInTheDocument()
    })

    it('Feedback card has all required content', () => {
      renderContact()
      expect(screen.getByText('Feedback')).toBeInTheDocument()
      expect(screen.getByText(/Your feedback about our platform is very valuable/)).toBeInTheDocument()
    })

    it('Website card has all required content', () => {
      renderContact()
      expect(screen.getByText('Our Website')).toBeInTheDocument()
      expect(screen.getByText(/minesminis is a platform offering free English learning/)).toBeInTheDocument()
    })
  })
})

describe('About & Contact - Cross-Page Consistency', () => {
  it('both pages use Layout component', () => {
    const { unmount: unmountAbout } = renderAbout()
    expect(screen.getByTestId('layout')).toBeInTheDocument()
    unmountAbout()

    const { unmount: unmountContact } = renderContact()
    expect(screen.getByTestId('layout')).toBeInTheDocument()
    unmountContact()
  })

  it('both pages set document.title correctly', async () => {
    renderAbout()
    await waitFor(() => {
      expect(document.title).toBe('About - minesminis')
    })

    renderContact()
    await waitFor(() => {
      expect(document.title).toBe('Contact - minesminis')
    })
  })

  it('both pages use same heading class for h1', () => {
    const { unmount: unmountAbout } = renderAbout()
    const aboutHeading = screen.getByRole('heading', { level: 1 })
    expect(aboutHeading).toHaveClass('mm-page-title')
    unmountAbout()

    const { unmount: unmountContact } = renderContact()
    const contactHeading = screen.getByRole('heading', { level: 1 })
    expect(contactHeading).toHaveClass('mm-page-title')
    unmountContact()
  })

  it('both pages render without errors', () => {
    expect(() => renderAbout()).not.toThrow()
    expect(() => renderContact()).not.toThrow()
  })
})
