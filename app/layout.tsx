import type { Metadata } from 'next'
import { Toaster } from 'react-hot-toast'
import './globals.css'
import LayoutShell from '../src/components/LayoutShell'
import PageViewTracker from '../src/components/PageViewTracker'
import GoogleAnalytics from '../src/components/GoogleAnalytics'

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
  themeColor: '#7B68EE',
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
  sameAs: [],
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
    target: 'https://minesminis.com/blog?q={search_term_string}',
    'query-input': 'required name=search_term_string',
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="tr">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link rel="preconnect" href="https://kcbblalwwfjevneegmcv.supabase.co" />
        <link
          href="https://fonts.googleapis.com/css2?family=Baloo+2:wght@500;600;700;800&family=Fredoka:wght@400;500;600;700&display=swap"
          rel="stylesheet"
        />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(orgSchema) }} />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(siteSchema) }} />
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
