const UNSTABLE_COVER_HOSTS = new Set(['image.pollinations.ai'])

export const BLOG_FALLBACK_IMAGE_PATH = '/images/minesminis-logo-512.png'
export const BLOG_FALLBACK_IMAGE_URL = `https://minesminis.com${BLOG_FALLBACK_IMAGE_PATH}`

export function isReliableCoverUrl(src?: string | null): src is string {
  if (!src) return false
  if (src.startsWith('/')) return true

  try {
    return !UNSTABLE_COVER_HOSTS.has(new URL(src).hostname)
  } catch {
    return false
  }
}

export function publicBlogCoverUrl(src?: string | null) {
  if (!isReliableCoverUrl(src)) return BLOG_FALLBACK_IMAGE_URL
  if (src.startsWith('/')) return new URL(src, 'https://minesminis.com').toString()
  return src
}
