import Link from 'next/link'
import { ChevronRight } from 'lucide-react'

export type BreadcrumbItem = { name: string; url?: string }

export default function Breadcrumb({ items }: { items: BreadcrumbItem[] }) {
  if (items.length === 0) return null
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((it, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: it.name,
      ...(it.url ? { item: it.url } : {}),
    })),
  }
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
      <nav aria-label="Breadcrumb" style={{ fontSize: 13, color: 'var(--ink-3)', marginBottom: 12, display: 'flex', alignItems: 'center', gap: 6, flexWrap: 'wrap' }}>
        {items.map((it, i) => {
          const last = i === items.length - 1
          return (
            <span key={i} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              {i > 0 && <ChevronRight size={14} />}
              {!last && it.url ? (
                <Link href={it.url.replace('https://minesminis.com', '') || '/'} style={{ color: 'var(--ink-3)', textDecoration: 'none' }}>{it.name}</Link>
              ) : (
                <span style={{ color: last ? 'var(--ink-1)' : 'var(--ink-3)' }}>{it.name}</span>
              )}
            </span>
          )
        })}
      </nav>
    </>
  )
}
