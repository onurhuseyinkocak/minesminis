import { useEffect } from 'react'
import Layout from '../components/Layout'

export default function Privacy() {
  useEffect(() => { document.title = 'Privacy Policy - minesminis' }, [])

  return (
    <Layout>
      <div style={{ maxWidth: 720, margin: '0 auto' }}>
        <h1 className="mm-page-title">Privacy Policy</h1>
        <p className="mm-page-sub" style={{ marginBottom: 24 }}>Last updated: April 30, 2026</p>

        <div style={{ background: 'white', borderRadius: 28, padding: 28, border: '1px solid var(--line)', lineHeight: 1.8, fontSize: 15, color: 'var(--ink-2)' }}>
          <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 22, color: 'var(--ink)', marginTop: 0 }}>1. Overview</h2>
          <p>
            minesminis (minesminis.com) is a free English learning platform designed for children ages 4-12.
            The safety of children is our top priority. This privacy policy explains what data is collected
            and how it is used when you use our site.
          </p>

          <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 22, color: 'var(--ink)' }}>2. Data Collection</h2>
          <p>
            minesminis does not collect personal information from users. No account creation, email registration
            or social media login is required. Our site can be used completely anonymously.
          </p>
          <ul>
            <li>No personal information (name, email, phone) is collected</li>
            <li>No location data is collected</li>
            <li>No personal data targeting children is collected</li>
          </ul>

          <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 22, color: 'var(--ink)' }}>3. Cookies and Analytics</h2>
          <p>
            Our site displays Google AdSense advertisements. Google may use cookies to serve ads.
            These cookies do not collect personal information and are only used to improve ad delivery.
            Since we serve child-directed content, personalized ads are disabled.
          </p>

          <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 22, color: 'var(--ink)' }}>4. COPPA Compliance</h2>
          <p>
            minesminis operates in compliance with the U.S. Children's Online Privacy Protection Act (COPPA)
            and relevant international regulations. We do not knowingly collect personal information from children
            under the age of 13.
          </p>

          <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 22, color: 'var(--ink)' }}>5. Third-Party Services</h2>
          <ul>
            <li><strong>Google AdSense:</strong> Used for content-based ads. Personalized ads are not shown due to child-directed content.</li>
            <li><strong>YouTube:</strong> Video content is displayed as embedded YouTube videos. YouTube's own privacy policy applies.</li>
          </ul>

          <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 22, color: 'var(--ink)' }}>6. Parental Rights</h2>
          <p>
            Parents may request information about their children's use of the site. For any questions,
            please contact us at <a href="mailto:info@minesminis.com" style={{ color: 'var(--accent)' }}>info@minesminis.com</a>.
          </p>

          <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 22, color: 'var(--ink)' }}>7. Changes</h2>
          <p>
            This privacy policy may be updated from time to time. You will be notified of significant changes through this page.
          </p>
        </div>
      </div>
    </Layout>
  )
}
