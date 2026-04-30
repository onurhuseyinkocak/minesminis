import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, waitFor, within } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import Privacy from '../pages/Privacy'
import Terms from '../pages/Terms'

// Mock Layout component
vi.mock('../components/Layout', () => ({
  default: ({ children }: { children: React.ReactNode }) => <div data-testid="layout">{children}</div>,
}))

const renderPrivacy = () => {
  return render(
    <MemoryRouter>
      <Privacy />
    </MemoryRouter>
  )
}

const renderTerms = () => {
  return render(
    <MemoryRouter>
      <Terms />
    </MemoryRouter>
  )
}

describe('Privacy Page', () => {
  beforeEach(() => {
    document.title = ''
  })

  describe('Document Title and Layout', () => {
    it('sets document.title to "Privacy Policy - minesminis"', async () => {
      renderPrivacy()
      await waitFor(() => {
        expect(document.title).toBe('Privacy Policy - minesminis')
      })
    })

    it('wraps content in Layout component', () => {
      renderPrivacy()
      expect(screen.getByTestId('layout')).toBeInTheDocument()
    })

    it('renders all content inside Layout wrapper', () => {
      renderPrivacy()
      const layout = screen.getByTestId('layout')
      expect(within(layout).getByText('Privacy Policy')).toBeInTheDocument()
    })
  })

  describe('Page Header', () => {
    it('renders "Privacy Policy" main heading', () => {
      renderPrivacy()
      const heading = screen.getByRole('heading', { level: 1 })
      expect(heading).toHaveTextContent('Privacy Policy')
      expect(heading).toHaveClass('mm-page-title')
    })

    it('renders "Last updated: April 30, 2026" subtitle', () => {
      renderPrivacy()
      expect(screen.getByText('Last updated: April 30, 2026')).toBeInTheDocument()
      expect(screen.getByText('Last updated: April 30, 2026')).toHaveClass('mm-page-sub')
    })

    it('displays subtitle with correct styling', () => {
      renderPrivacy()
      const subtitle = screen.getByText('Last updated: April 30, 2026')
      expect(subtitle).toHaveStyle({ marginBottom: '24px' })
    })
  })

  describe('Section 1: Overview', () => {
    it('renders Overview section heading', () => {
      renderPrivacy()
      expect(screen.getByText('1. Overview')).toBeInTheDocument()
    })

    it('displays overview description mentioning minesminis.com', () => {
      renderPrivacy()
      expect(screen.getByText(/minesminis \(minesminis\.com\) is a free English learning platform/)).toBeInTheDocument()
    })

    it('mentions target age group 4-12 in overview', () => {
      renderPrivacy()
      expect(screen.getByText(/designed for children ages 4-12/)).toBeInTheDocument()
    })

    it('states child safety is top priority in overview', () => {
      renderPrivacy()
      expect(screen.getByText(/The safety of children is our top priority/)).toBeInTheDocument()
    })
  })

  describe('Section 2: Data Collection', () => {
    it('renders Data Collection section heading', () => {
      renderPrivacy()
      expect(screen.getByText('2. Data Collection')).toBeInTheDocument()
    })

    it('states no personal information is collected', () => {
      renderPrivacy()
      expect(screen.getByText(/minesminis does not collect personal information/)).toBeInTheDocument()
    })

    it('mentions no account creation or email registration required', () => {
      renderPrivacy()
      expect(screen.getByText(/No account creation, email registration or social media login is required/)).toBeInTheDocument()
    })

    it('renders list of non-collected data points', () => {
      renderPrivacy()
      expect(screen.getByText(/No personal information \(name, email, phone\) is collected/)).toBeInTheDocument()
      expect(screen.getByText(/No location data is collected/)).toBeInTheDocument()
      expect(screen.getByText(/No personal data targeting children is collected/)).toBeInTheDocument()
    })

    it('states site can be used anonymously', () => {
      renderPrivacy()
      expect(screen.getByText(/Our site can be used completely anonymously/)).toBeInTheDocument()
    })
  })

  describe('Section 3: Cookies and Analytics', () => {
    it('renders Cookies and Analytics section heading', () => {
      renderPrivacy()
      expect(screen.getByText('3. Cookies and Analytics')).toBeInTheDocument()
    })

    it('mentions Google AdSense advertisements', () => {
      renderPrivacy()
      expect(screen.getByText(/Our site displays Google AdSense advertisements/)).toBeInTheDocument()
    })

    it('explains Google cookie usage for ad delivery', () => {
      renderPrivacy()
      expect(screen.getByText(/Google may use cookies to serve ads/)).toBeInTheDocument()
    })

    it('states personalized ads are disabled for child-directed content', () => {
      renderPrivacy()
      expect(screen.getByText(/personalized ads are disabled/)).toBeInTheDocument()
    })
  })

  describe('Section 4: COPPA Compliance', () => {
    it('renders COPPA Compliance section heading', () => {
      renderPrivacy()
      expect(screen.getByText('4. COPPA Compliance')).toBeInTheDocument()
    })

    it('mentions COPPA compliance in policy', () => {
      renderPrivacy()
      expect(screen.getByText(/Children's Online Privacy Protection Act \(COPPA\)/)).toBeInTheDocument()
    })

    it('states minesminis does not collect from children under 13', () => {
      renderPrivacy()
      expect(screen.getByText(/We do not knowingly collect personal information from children under the age of 13/)).toBeInTheDocument()
    })

    it('mentions compliance with international regulations', () => {
      renderPrivacy()
      expect(screen.getByText(/relevant international regulations/)).toBeInTheDocument()
    })
  })

  describe('Section 5: Third-Party Services', () => {
    it('renders Third-Party Services section heading', () => {
      renderPrivacy()
      expect(screen.getByText('5. Third-Party Services')).toBeInTheDocument()
    })

    it('lists Google AdSense as third-party service', () => {
      renderPrivacy()
      const googleAdsense = screen.getAllByText(/Google AdSense/)
      expect(googleAdsense.length).toBeGreaterThan(0)
    })

    it('explains Google AdSense usage (content-based ads)', () => {
      renderPrivacy()
      expect(screen.getByText(/Used for content-based ads/)).toBeInTheDocument()
    })

    it('lists YouTube as third-party service', () => {
      renderPrivacy()
      const youtube = screen.getAllByText(/YouTube/)
      expect(youtube.length).toBeGreaterThan(0)
    })

    it('mentions YouTube privacy policy applies to embedded videos', () => {
      renderPrivacy()
      expect(screen.getByText(/YouTube's own privacy policy applies/)).toBeInTheDocument()
    })
  })

  describe('Section 6: Parental Rights', () => {
    it('renders Parental Rights section heading', () => {
      renderPrivacy()
      expect(screen.getByText('6. Parental Rights')).toBeInTheDocument()
    })

    it('states parents can request info about child usage', () => {
      renderPrivacy()
      expect(screen.getByText(/Parents may request information about their children's use of the site/)).toBeInTheDocument()
    })

    it('renders contact email link for info@minesminis.com', () => {
      renderPrivacy()
      const emailLink = screen.getByRole('link', { name: /info@minesminis\.com/ })
      expect(emailLink).toBeInTheDocument()
      expect(emailLink).toHaveAttribute('href', 'mailto:info@minesminis.com')
    })

    it('email link has correct color styling', () => {
      renderPrivacy()
      const emailLink = screen.getByRole('link', { name: /info@minesminis\.com/ })
      expect(emailLink).toHaveStyle({ color: 'var(--accent)' })
    })
  })

  describe('Section 7: Changes', () => {
    it('renders Changes section heading', () => {
      renderPrivacy()
      expect(screen.getByText('7. Changes')).toBeInTheDocument()
    })

    it('mentions policy may be updated over time', () => {
      renderPrivacy()
      expect(screen.getByText(/This privacy policy may be updated from time to time/)).toBeInTheDocument()
    })

    it('states users will be notified of significant changes', () => {
      renderPrivacy()
      expect(screen.getByText(/You will be notified of significant changes through this page/)).toBeInTheDocument()
    })
  })

  describe('Page Structure and Styling', () => {
    it('renders content container with max-width 720', () => {
      renderPrivacy()
      const heading = screen.getByRole('heading', { level: 1 })
      const container = heading.closest('div') as HTMLElement
      expect(container).toHaveStyle('max-width: 720px')
    })

    it('renders content box with white background and styling', () => {
      renderPrivacy()
      const contentBoxes = document.querySelectorAll('div[style*="background"]')
      expect(contentBoxes.length).toBeGreaterThan(0)
      const contentBox = contentBoxes[contentBoxes.length - 1] as HTMLElement
      expect(contentBox).toHaveStyle('background: white')
    })

    it('applies section heading styling correctly', () => {
      renderPrivacy()
      const sectionHeadings = document.querySelectorAll('h2')
      sectionHeadings.forEach((heading) => {
        expect(heading).toHaveStyle({
          fontFamily: 'var(--font-display)',
          fontSize: 22,
          color: 'var(--ink)',
        })
      })
    })

    it('renders all section headings with correct hierarchy', () => {
      renderPrivacy()
      const headings = screen.getAllByRole('heading', { level: 2 })
      expect(headings).toHaveLength(7)
      expect(headings.map((h) => h.textContent)).toEqual([
        '1. Overview',
        '2. Data Collection',
        '3. Cookies and Analytics',
        '4. COPPA Compliance',
        '5. Third-Party Services',
        '6. Parental Rights',
        '7. Changes',
      ])
    })
  })

  describe('Accessibility', () => {
    it('has proper heading hierarchy (h1 > h2)', () => {
      renderPrivacy()
      const h1 = screen.getByRole('heading', { level: 1 })
      expect(h1).toBeInTheDocument()

      const h2s = screen.getAllByRole('heading', { level: 2 })
      expect(h2s.length).toBeGreaterThan(0)
    })

    it('email link is accessible and keyboard navigable', () => {
      renderPrivacy()
      const emailLink = screen.getByRole('link', { name: /info@minesminis\.com/ })
      expect(emailLink).toBeVisible()
      expect(emailLink).toHaveAttribute('href')
    })

    it('all required sections are present and visible', () => {
      renderPrivacy()
      const requiredSections = [
        '1. Overview',
        '2. Data Collection',
        '3. Cookies and Analytics',
        '4. COPPA Compliance',
        '5. Third-Party Services',
        '6. Parental Rights',
        '7. Changes',
      ]
      requiredSections.forEach((section) => {
        expect(screen.getByText(section)).toBeVisible()
      })
    })
  })

  describe('Content Completeness', () => {
    it('contains all required email mentions', () => {
      renderPrivacy()
      expect(screen.getByText(/info@minesminis\.com/)).toBeInTheDocument()
    })

    it('mentions both Google AdSense and YouTube', () => {
      renderPrivacy()
      const googleMatches = screen.getAllByText(/Google AdSense/)
      const youtubeMatches = screen.getAllByText(/YouTube/)
      expect(googleMatches.length).toBeGreaterThan(0)
      expect(youtubeMatches.length).toBeGreaterThan(0)
    })

    it('includes date information', () => {
      renderPrivacy()
      expect(screen.getByText(/April 30, 2026/)).toBeInTheDocument()
    })
  })
})

describe('Terms Page', () => {
  beforeEach(() => {
    document.title = ''
  })

  describe('Document Title and Layout', () => {
    it('sets document.title to "Terms of Use - minesminis"', async () => {
      renderTerms()
      await waitFor(() => {
        expect(document.title).toBe('Terms of Use - minesminis')
      })
    })

    it('wraps content in Layout component', () => {
      renderTerms()
      expect(screen.getByTestId('layout')).toBeInTheDocument()
    })

    it('renders all content inside Layout wrapper', () => {
      renderTerms()
      const layout = screen.getByTestId('layout')
      expect(within(layout).getByText('Terms of Use')).toBeInTheDocument()
    })
  })

  describe('Page Header', () => {
    it('renders "Terms of Use" main heading', () => {
      renderTerms()
      const heading = screen.getByRole('heading', { level: 1 })
      expect(heading).toHaveTextContent('Terms of Use')
      expect(heading).toHaveClass('mm-page-title')
    })

    it('renders "Last updated: April 30, 2026" subtitle', () => {
      renderTerms()
      expect(screen.getByText('Last updated: April 30, 2026')).toBeInTheDocument()
      expect(screen.getByText('Last updated: April 30, 2026')).toHaveClass('mm-page-sub')
    })

    it('displays subtitle with correct styling', () => {
      renderTerms()
      const subtitle = screen.getByText('Last updated: April 30, 2026')
      expect(subtitle).toHaveStyle({ marginBottom: '24px' })
    })
  })

  describe('Section 1: Service Description', () => {
    it('renders Service Description section heading', () => {
      renderTerms()
      expect(screen.getByText('1. Service Description')).toBeInTheDocument()
    })

    it('describes minesminis as free web platform', () => {
      renderTerms()
      expect(screen.getByText(/minesminis is a free web platform/)).toBeInTheDocument()
    })

    it('mentions target age group 4-12 for learning', () => {
      renderTerms()
      expect(screen.getByText(/for children ages 4-12/)).toBeInTheDocument()
    })

    it('lists service components (interactive slides, videos, songs)', () => {
      renderTerms()
      expect(screen.getByText(/interactive slides, educational videos and English songs/)).toBeInTheDocument()
    })
  })

  describe('Section 2: Terms of Use', () => {
    it('renders Terms of Use section heading', () => {
      renderTerms()
      expect(screen.getByText('2. Terms of Use')).toBeInTheDocument()
    })

    it('states platform is free and does not require registration', () => {
      renderTerms()
      expect(screen.getByText(/The platform is free and does not require registration/)).toBeInTheDocument()
    })

    it('mentions content is for educational purposes', () => {
      renderTerms()
      expect(screen.getByText(/Content is for educational purposes; commercial use requires permission/)).toBeInTheDocument()
    })

    it('recommends adult supervision for children', () => {
      renderTerms()
      expect(screen.getByText(/Children are encouraged to use the platform under adult supervision/)).toBeInTheDocument()
    })

    it('states content is copyright protected', () => {
      renderTerms()
      expect(screen.getByText(/All content on the platform is protected by copyright/)).toBeInTheDocument()
    })
  })

  describe('Section 3: Content Rights', () => {
    it('renders Content Rights section heading', () => {
      renderTerms()
      expect(screen.getByText('3. Content Rights')).toBeInTheDocument()
    })

    it('states minesminis owns all educational materials', () => {
      renderTerms()
      expect(screen.getByText(/All educational materials, visuals and designs on minesminis belong to minesminis/)).toBeInTheDocument()
    })

    it('allows personal educational use', () => {
      renderTerms()
      expect(screen.getByText(/Users may use the content for personal educational purposes/)).toBeInTheDocument()
    })

    it('prohibits commercial reproduction or distribution', () => {
      renderTerms()
      expect(screen.getByText(/may not reproduce or distribute it commercially/)).toBeInTheDocument()
    })
  })

  describe('Section 4: Advertisements', () => {
    it('renders Advertisements section heading', () => {
      renderTerms()
      expect(screen.getByText('4. Advertisements')).toBeInTheDocument()
    })

    it('mentions Google AdSense for keeping platform free', () => {
      renderTerms()
      expect(screen.getByText(/minesminis uses Google AdSense advertisements to keep the platform free/)).toBeInTheDocument()
    })

    it('states ads follow child-appropriate content policies', () => {
      renderTerms()
      expect(screen.getByText(/Ads are subject to child-appropriate content policies/)).toBeInTheDocument()
    })

    it('confirms personalized ads are not shown', () => {
      renderTerms()
      expect(screen.getByText(/personalized ads are not shown/)).toBeInTheDocument()
    })
  })

  describe('Section 5: Limitation of Liability', () => {
    it('renders Limitation of Liability section heading', () => {
      renderTerms()
      expect(screen.getByText('5. Limitation of Liability')).toBeInTheDocument()
    })

    it('states platform does not guarantee uninterrupted operation', () => {
      renderTerms()
      expect(screen.getByText(/minesminis does not guarantee that the platform will operate without interruption or errors/)).toBeInTheDocument()
    })

    it('provides content "as is" disclaimer', () => {
      renderTerms()
      expect(screen.getByText(/Content is provided "as is"/)).toBeInTheDocument()
    })

    it('states content is for general educational information', () => {
      renderTerms()
      expect(screen.getByText(/general educational information purposes/)).toBeInTheDocument()
    })
  })

  describe('Section 6: Contact', () => {
    it('renders Contact section heading', () => {
      renderTerms()
      expect(screen.getByText('6. Contact')).toBeInTheDocument()
    })

    it('mentions contacting about terms of use questions', () => {
      renderTerms()
      expect(screen.getByText(/For questions about the terms of use/)).toBeInTheDocument()
    })

    it('renders contact email link for info@minesminis.com', () => {
      renderTerms()
      const emailLink = screen.getByRole('link', { name: /info@minesminis\.com/ })
      expect(emailLink).toBeInTheDocument()
      expect(emailLink).toHaveAttribute('href', 'mailto:info@minesminis.com')
    })

    it('email link has correct color styling', () => {
      renderTerms()
      const emailLink = screen.getByRole('link', { name: /info@minesminis\.com/ })
      expect(emailLink).toHaveStyle({ color: 'var(--accent)' })
    })
  })

  describe('Page Structure and Styling', () => {
    it('renders content container with max-width 720', () => {
      renderTerms()
      const heading = screen.getByRole('heading', { level: 1 })
      const container = heading.closest('div') as HTMLElement
      expect(container).toHaveStyle('max-width: 720px')
    })

    it('renders content box with white background and styling', () => {
      renderTerms()
      const contentBoxes = document.querySelectorAll('div[style*="background"]')
      expect(contentBoxes.length).toBeGreaterThan(0)
      const contentBox = contentBoxes[contentBoxes.length - 1] as HTMLElement
      expect(contentBox).toHaveStyle('background: white')
    })

    it('applies section heading styling correctly', () => {
      renderTerms()
      const sectionHeadings = document.querySelectorAll('h2')
      sectionHeadings.forEach((heading) => {
        expect(heading).toHaveStyle({
          fontFamily: 'var(--font-display)',
          fontSize: 22,
          color: 'var(--ink)',
        })
      })
    })

    it('renders all section headings with correct hierarchy', () => {
      renderTerms()
      const headings = screen.getAllByRole('heading', { level: 2 })
      expect(headings).toHaveLength(6)
      expect(headings.map((h) => h.textContent)).toEqual([
        '1. Service Description',
        '2. Terms of Use',
        '3. Content Rights',
        '4. Advertisements',
        '5. Limitation of Liability',
        '6. Contact',
      ])
    })
  })

  describe('Accessibility', () => {
    it('has proper heading hierarchy (h1 > h2)', () => {
      renderTerms()
      const h1 = screen.getByRole('heading', { level: 1 })
      expect(h1).toBeInTheDocument()

      const h2s = screen.getAllByRole('heading', { level: 2 })
      expect(h2s.length).toBeGreaterThan(0)
    })

    it('email link is accessible and keyboard navigable', () => {
      renderTerms()
      const emailLink = screen.getByRole('link', { name: /info@minesminis\.com/ })
      expect(emailLink).toBeVisible()
      expect(emailLink).toHaveAttribute('href')
    })

    it('all required sections are present and visible', () => {
      renderTerms()
      const requiredSections = [
        '1. Service Description',
        '2. Terms of Use',
        '3. Content Rights',
        '4. Advertisements',
        '5. Limitation of Liability',
        '6. Contact',
      ]
      requiredSections.forEach((section) => {
        expect(screen.getByText(section)).toBeVisible()
      })
    })
  })

  describe('Content Completeness', () => {
    it('states platform is free', () => {
      renderTerms()
      expect(screen.getByText(/minesminis is a free/)).toBeInTheDocument()
    })

    it('mentions Google AdSense', () => {
      renderTerms()
      expect(screen.getByText(/Google AdSense/)).toBeInTheDocument()
    })

    it('contains contact email mention', () => {
      renderTerms()
      expect(screen.getByText(/info@minesminis\.com/)).toBeInTheDocument()
    })

    it('includes date information', () => {
      renderTerms()
      expect(screen.getByText(/April 30, 2026/)).toBeInTheDocument()
    })

    it('mentions educational videos and songs as service offerings', () => {
      renderTerms()
      expect(screen.getByText(/educational videos and English songs/)).toBeInTheDocument()
    })
  })
})
