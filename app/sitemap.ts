import type { MetadataRoute } from 'next'
import { staticBlogs } from '@/src/content/staticBlogs'

const SITE_URL = 'https://minesminis.com'
const SUPABASE_URL = (process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.VITE_SUPABASE_URL || 'https://kcbblalwwfjevneegmcv.supabase.co').trim()
const SUPABASE_ANON = (process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || process.env.VITE_SUPABASE_ANON_KEY || '').trim()

export const revalidate = 3600

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const today = new Date()

  const staticPages: MetadataRoute.Sitemap = [
    { url: `${SITE_URL}/`, lastModified: today, changeFrequency: 'daily', priority: 1.0 },
    { url: `${SITE_URL}/slides`, lastModified: today, changeFrequency: 'weekly', priority: 0.9 },
    { url: `${SITE_URL}/videos`, lastModified: today, changeFrequency: 'weekly', priority: 0.9 },
    { url: `${SITE_URL}/songs`, lastModified: today, changeFrequency: 'weekly', priority: 0.9 },
    { url: `${SITE_URL}/worksheets`, lastModified: today, changeFrequency: 'weekly', priority: 0.9 },
    { url: `${SITE_URL}/blog`, lastModified: today, changeFrequency: 'daily', priority: 0.9 },
    { url: `${SITE_URL}/curriculum`, lastModified: today, changeFrequency: 'monthly', priority: 0.8 },
    { url: `${SITE_URL}/faq`, lastModified: today, changeFrequency: 'monthly', priority: 0.7 },
    { url: `${SITE_URL}/about`, lastModified: today, changeFrequency: 'monthly', priority: 0.7 },
    { url: `${SITE_URL}/contact`, lastModified: today, changeFrequency: 'monthly', priority: 0.5 },
    { url: `${SITE_URL}/privacy`, lastModified: today, changeFrequency: 'yearly', priority: 0.3 },
    { url: `${SITE_URL}/terms`, lastModified: today, changeFrequency: 'yearly', priority: 0.3 },
  ]

  // Static bundled blog URLs
  const staticBlogUrls: MetadataRoute.Sitemap = staticBlogs.map((b) => ({
    url: `${SITE_URL}/blog/${b.slug}`,
    lastModified: b.published_at ? new Date(b.published_at) : today,
    changeFrequency: 'monthly' as const,
    priority: 0.7,
  }))

  // DB blog URLs
  const dbBlogUrls: MetadataRoute.Sitemap = []
  if (SUPABASE_URL && SUPABASE_ANON) {
    try {
      const r = await fetch(
        `${SUPABASE_URL}/rest/v1/mm_blogs?status=eq.published&select=slug,published_at&order=published_at.desc`,
        { headers: { apikey: SUPABASE_ANON, Authorization: `Bearer ${SUPABASE_ANON}` }, next: { revalidate: 3600 } },
      )
      if (r.ok) {
        const blogs = await r.json()
        for (const b of blogs as any[]) {
          dbBlogUrls.push({
            url: `${SITE_URL}/blog/${b.slug}`,
            lastModified: b.published_at ? new Date(b.published_at) : today,
            changeFrequency: 'weekly',
            priority: 0.7,
          })
        }
      }
    } catch {
      // ignore
    }
  }

  // DB content URLs
  const contentUrls: MetadataRoute.Sitemap = []
  if (SUPABASE_URL && SUPABASE_ANON) {
    try {
      const headers = { apikey: SUPABASE_ANON, Authorization: `Bearer ${SUPABASE_ANON}` }
      const opts = { next: { revalidate: 3600 } }
      const [slides, videos, songs, worksheets] = await Promise.all([
        fetch(`${SUPABASE_URL}/rest/v1/mm_slides?published=eq.true&select=id`, { headers, ...opts }).then((r) => (r.ok ? r.json() : [])).catch(() => []),
        fetch(`${SUPABASE_URL}/rest/v1/mm_videos?published=eq.true&select=id`, { headers, ...opts }).then((r) => (r.ok ? r.json() : [])).catch(() => []),
        fetch(`${SUPABASE_URL}/rest/v1/mm_songs?published=eq.true&select=id`, { headers, ...opts }).then((r) => (r.ok ? r.json() : [])).catch(() => []),
        fetch(`${SUPABASE_URL}/rest/v1/mm_worksheets?published=eq.true&select=id`, { headers, ...opts }).then((r) => (r.ok ? r.json() : [])).catch(() => []),
      ])
      for (const s of slides as any[]) contentUrls.push({ url: `${SITE_URL}/slides/${s.id}`, priority: 0.6, changeFrequency: 'monthly' })
      for (const v of videos as any[]) contentUrls.push({ url: `${SITE_URL}/videos/${v.id}`, priority: 0.6, changeFrequency: 'monthly' })
      for (const s of songs as any[]) contentUrls.push({ url: `${SITE_URL}/songs/${s.id}`, priority: 0.6, changeFrequency: 'monthly' })
      for (const w of worksheets as any[]) contentUrls.push({ url: `${SITE_URL}/worksheets/${w.id}`, priority: 0.6, changeFrequency: 'monthly' })
    } catch {
      // ignore
    }
  }

  // Deduplicate blog URLs
  const seen = new Set<string>()
  const allBlogs = [...dbBlogUrls, ...staticBlogUrls].filter((b) => {
    if (seen.has(b.url)) return false
    seen.add(b.url)
    return true
  })

  return [...staticPages, ...allBlogs, ...contentUrls]
}
