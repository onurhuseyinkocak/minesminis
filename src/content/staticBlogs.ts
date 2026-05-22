/**
 * Static blog posts bundled at build time.
 * Used to ensure substantive content for the AdSense approval process.
 * Merged with DB-fetched blogs in BlogList and BlogPost.
 *
 * To add a new static post, append an entry below. To migrate to DB-only,
 * delete entries and the merge in BlogList/BlogPost will still work.
 */

import type { Blog } from '../lib/supabase'

// Note: ID is a deterministic string prefixed with 'static-' so merge logic
// can detect and route by slug instead of UUID.
export type StaticBlog = Omit<Blog, 'id' | 'created_at' | 'updated_at' | 'error_log'> & {
  id: string
  created_at: string
  updated_at: string
  error_log: null
}

import { posts } from './blogs/index'

export const staticBlogs: StaticBlog[] = posts.map((p) => ({
  id: `static-${p.slug}`,
  title: p.title,
  slug: p.slug,
  excerpt: p.excerpt,
  content_html: p.content_html,
  meta_description: p.meta_description,
  keywords: p.keywords,
  category: p.category,
  cover_url: null,
  status: 'published',
  error_log: null,
  reading_time_min: p.reading_time_min,
  published_at: p.published_at,
  created_at: p.published_at,
  updated_at: p.published_at,
}))

export function findStaticBlogBySlug(slug: string): StaticBlog | undefined {
  return staticBlogs.find(b => b.slug === slug)
}

export function getStaticBlogsByCategory(category?: string): StaticBlog[] {
  if (!category || category === 'all') return staticBlogs
  return staticBlogs.filter(b => b.category === category)
}
