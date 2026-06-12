import type { Metadata, Viewport } from 'next'
import { Toaster } from 'react-hot-toast'
import { Baloo_2, Fredoka } from 'next/font/google'
import './globals.css'
import LayoutShell from '../src/components/LayoutShell'
import PageViewTracker from '../src/components/PageViewTracker'
import GoogleAnalytics from '../src/components/GoogleAnalytics'

const baloo = Baloo_2({
  subsets: ['latin', 'latin-ext'],
  weight: ['500', '600', '700', '800'],
  variable: '--font-baloo',
  display: 'swap',
  preload: true,
})
const fredoka = Fredoka({
  subsets: ['latin', 'latin-ext'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-fredoka',
  display: 'swap',
  preload: true,
})

export const metadata: Metadata = {
  metadataBase: new URL('https://minesminis.com'),
  title: {
    default: 'minesminis — Çocuklar İçin Ücretsiz İngilizce Öğrenme Platformu',
    template: '%s | minesminis',
  },
  description:
    'Çocuklarınız için Maarif modeli uyumlu, ücretsiz ve güvenli İngilizce öğrenme kaynakları: sunumlar, videolar, şarkılar, çalışma kâğıtları ve aile-öğretmen rehberleri.',
  keywords: [
    'çocuklara ingilizce',
    'ilkokul ingilizce etkinlikleri',
    'maarif modeli ingilizce',
    'ingilizce öğretim materyalleri',
    'ücretsiz ingilizce kaynaklar',
    'ingilizce ders planı',
    'çocuk ingilizce oyunları',
    'CEFR A1 ingilizce',
  ],
  alternates: { canonical: 'https://minesminis.com/' },
  openGraph: {
    type: 'website',
    locale: 'tr_TR',
    alternateLocale: ['en_US'],
    url: 'https://minesminis.com/',
    siteName: 'minesminis',
    title: 'minesminis — Çocuklar İçin Ücretsiz İngilizce',
    description:
      'Maarif modeli uyumlu, çocuklara özel İngilizce öğrenme platformu. Sunumlar, videolar, şarkılar, çalışma kâğıtları ve aileler için rehberler.',
    images: ['/images/minesminis-logo-512.png'],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'minesminis — Çocuklar İçin Ücretsiz İngilizce',
    description: 'Maarif modeli uyumlu ücretsiz İngilizce kaynaklar. Aileler ve öğretmenler için rehberler.',
    images: ['/images/minesminis-logo-512.png'],
  },
  icons: {
    icon: '/images/minesminis-logo-512.png',
    apple: '/images/minesminis-logo-512.png',
  },
  manifest: '/manifest.json',
  appleWebApp: {
    capable: true,
    title: 'minesminis',
    statusBarStyle: 'default',
  },
  other: {
    'google-adsense-account': 'ca-pub-6644397387275334',
    'google-site-verification': 'uc57zPkk36HVf6lb1fPPBnvwTA5Gk_FBfYZDrhQVDqc',
    'format-detection': 'telephone=no',
  },
}

export const viewport: Viewport = {
  themeColor: '#7B68EE',
  width: 'device-width',
  initialScale: 1,
}

const orgSchema = {
  '@context': 'https://schema.org',
  '@type': 'EducationalOrganization',
  name: 'minesminis',
  url: 'https://minesminis.com',
  logo: 'https://minesminis.com/images/minesminis-logo.webp',
  description:
    'Çocuklara İngilizce öğretmek için ücretsiz eğitim platformu. Sunumlar, videolar, şarkılar, çalışma kâğıtları ve eğitim rehberleri.',
  contactPoint: {
    '@type': 'ContactPoint',
    email: 'info@minesminis.com',
    contactType: 'Customer Support',
    availableLanguage: ['Turkish', 'English'],
  },
  audience: {
    '@type': 'EducationalAudience',
    educationalRole: 'student',
    audienceType: 'Primary school students aged 4-12',
  },
  educationalCredentialAwarded: 'CEFR A1 alignment',
  founder: {
    '@type': 'Person',
    name: 'Onur Hüseyin Koçak',
    sameAs: [
      'https://promtable.com',
      'https://vibecodingturkey.com',
      'https://dream-mining.co',
      'https://didnthappen-web.vercel.app',
      'https://onarika.net',
      'https://growth.vibecodingturkey.com/brands/onur-huseyin-kocak',
    ],
  },
  sameAs: [
    'https://growth.vibecodingturkey.com/websites/minesminis-com',
    'https://growth.vibecodingturkey.com',
    'https://vibecodingturkey.com',
    'https://promtable.com',
    'https://dream-mining.co',
    'https://apps.apple.com/us/developer/onur-hseyin-kocak/id1878351222',
  ],
}

const siteSchema = {
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  name: 'minesminis',
  url: 'https://minesminis.com',
  description:
    'İlkokul öğrencileri için İngilizce öğrenme platformu. Maarif modeli uyumlu materyaller, öğretmen ve aile kaynakları.',
  inLanguage: 'tr',
  potentialAction: {
    '@type': 'SearchAction',
    target: 'https://minesminis.com/ara?q={search_term_string}',
    'query-input': 'required name=search_term_string',
  },
  isPartOf: {
    '@type': 'CreativeWorkSeries',
    name: 'Onur Hüseyin Koçak product ecosystem',
    url: 'https://growth.vibecodingturkey.com',
  },
  sameAs: [
    'https://growth.vibecodingturkey.com/websites/minesminis-com',
    'https://growth.vibecodingturkey.com',
    'https://vibecodingturkey.com',
    'https://promtable.com',
    'https://dream-mining.co',
    'https://apps.apple.com/us/developer/onur-hseyin-kocak/id1878351222',
  ],
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="tr" className={`${baloo.variable} ${fredoka.variable}`}>
      <head>
        <link rel="preconnect" href="https://kcbblalwwfjevneegmcv.supabase.co" />
        <link rel="alternate" type="text/plain" href="/llms.txt" title="LLMs.txt" />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(orgSchema) }} />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(siteSchema) }} />
        <script
          async
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-6644397387275334"
          crossOrigin="anonymous"
        />
      </head>
      <body>
        <Toaster position="top-right" />
        <LayoutShell>{children}</LayoutShell>
        <PageViewTracker />
        <GoogleAnalytics />
      </body>
    </html>
  )
}
