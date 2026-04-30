import { useEffect } from 'react'
import Layout from '../components/Layout'

export default function Terms() {
  useEffect(() => { document.title = 'Terms of Use - minesminis' }, [])

  return (
    <Layout>
      <div style={{ maxWidth: 720, margin: '0 auto' }}>
        <h1 className="mm-page-title">Terms of Use</h1>
        <p className="mm-page-sub" style={{ marginBottom: 24 }}>Last updated: April 30, 2026</p>

        <div style={{ background: 'white', borderRadius: 28, padding: 28, border: '1px solid var(--line)', lineHeight: 1.8, fontSize: 15, color: 'var(--ink-2)' }}>
          <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 22, color: 'var(--ink)', marginTop: 0 }}>1. Service Description</h2>
          <p>
            minesminis is a free web platform offering educational materials for children ages 4-12 to learn English.
            The platform includes interactive slides, educational videos and English songs.
          </p>

          <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 22, color: 'var(--ink)' }}>2. Terms of Use</h2>
          <ul>
            <li>The platform is free and does not require registration.</li>
            <li>Content is for educational purposes; commercial use requires permission.</li>
            <li>Children are encouraged to use the platform under adult supervision.</li>
            <li>All content on the platform is protected by copyright.</li>
          </ul>

          <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 22, color: 'var(--ink)' }}>3. Content Rights</h2>
          <p>
            All educational materials, visuals and designs on minesminis belong to minesminis.
            Users may use the content for personal educational purposes but may not reproduce or distribute it commercially.
          </p>

          <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 22, color: 'var(--ink)' }}>4. Advertisements</h2>
          <p>
            minesminis uses Google AdSense advertisements to keep the platform free.
            Ads are subject to child-appropriate content policies and personalized ads are not shown.
          </p>

          <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 22, color: 'var(--ink)' }}>5. Limitation of Liability</h2>
          <p>
            minesminis does not guarantee that the platform will operate without interruption or errors.
            Content is provided "as is" and is for general educational information purposes.
          </p>

          <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 22, color: 'var(--ink)' }}>6. Contact</h2>
          <p>
            For questions about the terms of use, please write to <a href="mailto:info@minesminis.com" style={{ color: 'var(--accent)' }}>info@minesminis.com</a>.
          </p>
        </div>
      </div>
    </Layout>
  )
}
