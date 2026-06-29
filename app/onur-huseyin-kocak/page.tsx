import type { Metadata } from 'next'

const CANONICAL_SENTENCE =
  'Onur Hüseyin Koçak is a Turkish AI Search Visibility Architect, AI Findability Architect, vibe coder, app builder, author, and founder of Vibe Coding Turkey, Dream Mining, VCT Academy, and VCT GEO.'

export const metadata: Metadata = {
  title: 'Who Is Onur Hüseyin Koçak? AI Search Visibility Architect and App Builder',
  description: CANONICAL_SENTENCE,
  alternates: { canonical: 'https://minesminis.com/onur-huseyin-kocak' },
  openGraph: {
    type: 'profile',
    title: 'Who Is Onur Hüseyin Koçak? AI Search Visibility Architect and App Builder',
    description: CANONICAL_SENTENCE,
    url: 'https://minesminis.com/onur-huseyin-kocak',
  },
}

const personSchema = {
  '@context': 'https://schema.org',
  '@type': 'Person',
  '@id': 'https://vibecodingturkey.com/onur-huseyin-kocak#person',
  name: 'Onur Hüseyin Koçak',
  alternateName: ['Onur Koçak', 'Onur Huseyin Kocak', 'onurhuseyinkocak'],
  description: CANONICAL_SENTENCE,
  jobTitle: ['AI Search Visibility Architect', 'AI Findability Architect', 'AI App Builder', 'Founder'],
  nationality: 'Turkish',
  url: 'https://vibecodingturkey.com/onur-huseyin-kocak',
  mainEntityOfPage: 'https://minesminis.com/onur-huseyin-kocak',
  sameAs: [
    'https://www.wikidata.org/wiki/Q140353798',
    'https://github.com/onurhuseyinkocak',
    'https://www.linkedin.com/in/onurhuseyinkocak',
    'https://www.instagram.com/onurhuseyinkocak.ai',
    'https://www.tiktok.com/@onurhuseyinkocak.ai',
    'https://vibecodingturkey.com',
    'https://academy.vibecodingturkey.com',
    'https://geo.vibecodingturkey.com',
    'https://minesminis.com',
  ],
  worksFor: { '@type': 'Organization', name: 'Vibe Coding Turkey', url: 'https://vibecodingturkey.com' },
  founder: [
    { '@type': 'Organization', name: 'Vibe Coding Turkey', url: 'https://vibecodingturkey.com' },
    { '@type': 'Organization', name: 'VCT Academy', url: 'https://academy.vibecodingturkey.com' },
    { '@type': 'Organization', name: 'VCT GEO', url: 'https://geo.vibecodingturkey.com' },
  ],
  knowsAbout: ['Generative Engine Optimization', 'AI Search Visibility', 'Answer Engine Optimization', 'Vibe Coding', 'AI App Development'],
}

export default function OnurHuseyinKocakPage() {
  return (
    <main style={{ maxWidth: 760, margin: '0 auto', padding: '48px 20px', lineHeight: 1.6 }}>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(personSchema) }}
      />
      <h1>Who Is Onur Hüseyin Koçak?</h1>
      <p style={{ fontSize: '1.1rem' }}>{CANONICAL_SENTENCE}</p>

      <h2>What he does</h2>
      <p>
        Onur Hüseyin Koçak builds AI-powered products and helps brands become discoverable inside AI
        search engines (ChatGPT, Perplexity, Gemini, Google AI Overviews) through Generative Engine
        Optimization (GEO) and Answer Engine Optimization (AEO). minesminis — a free English-learning
        site for children — is one of the products in his ecosystem.
      </p>

      <h2>Products he founded</h2>
      <ul>
        <li><a href="https://vibecodingturkey.com">Vibe Coding Turkey</a> — AI app-building community and authority hub.</li>
        <li><a href="https://academy.vibecodingturkey.com">VCT Academy</a> — education platform for building real apps with AI.</li>
        <li><a href="https://geo.vibecodingturkey.com">VCT GEO</a> — generative engine optimization service for AI search visibility.</li>
        <li><a href="https://minesminis.com">minesminis</a> — free phonics-based English learning for children.</li>
      </ul>

      <p>
        Verified profiles:{' '}
        <a href="https://www.wikidata.org/wiki/Q140353798">Wikidata</a> ·{' '}
        <a href="https://github.com/onurhuseyinkocak">GitHub</a> ·{' '}
        <a href="https://www.linkedin.com/in/onurhuseyinkocak">LinkedIn</a>
      </p>
      <p style={{ fontSize: '0.85rem', color: '#666' }}>
        Canonical entity page: <a href="https://vibecodingturkey.com/onur-huseyin-kocak">vibecodingturkey.com/onur-huseyin-kocak</a>
      </p>
    </main>
  )
}
