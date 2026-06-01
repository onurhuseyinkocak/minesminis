export const ADSENSE_CLIENT = (
  process.env.NEXT_PUBLIC_ADSENSE_CLIENT || 'ca-pub-6644397387275334'
).trim()

export const ADSENSE_ENABLED = process.env.NEXT_PUBLIC_ADSENSE_ENABLED === 'true'

const AD_ALLOWED_EXACT_PATHS = new Set(['/about', '/blog', '/curriculum', '/faq'])
const AD_ALLOWED_PREFIXES = ['/blog/']

const AD_BLOCKED_PREFIXES = [
  '/admin',
  '/api',
  '/contact',
  '/privacy',
  '/slides',
  '/songs',
  '/terms',
  '/videos',
  '/worksheets',
]

export const CHILD_SAFE_AD_ATTRIBUTES = {
  'data-tag-for-age-treatment': '1',
  'data-tag-for-under-age-of-consent': '1',
} as const

export function normalizePathname(pathname: string) {
  const path = pathname.split(/[?#]/)[0].replace(/\/+$/, '')
  return path || '/'
}

export function isAdEligiblePath(pathname: string) {
  const path = normalizePathname(pathname)

  if (AD_BLOCKED_PREFIXES.some((prefix) => path === prefix || path.startsWith(`${prefix}/`))) {
    return false
  }

  return AD_ALLOWED_EXACT_PATHS.has(path) || AD_ALLOWED_PREFIXES.some((prefix) => path.startsWith(prefix))
}

export function canRenderAds(pathname: string, slot?: string) {
  return ADSENSE_ENABLED && Boolean(ADSENSE_CLIENT) && Boolean(slot?.trim()) && isAdEligiblePath(pathname)
}
