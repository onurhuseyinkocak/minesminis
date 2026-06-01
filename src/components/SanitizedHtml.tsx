import { sanitizeHtml } from '../lib/sanitize'

export default function SanitizedHtml({ html, className }: { html: string; className?: string }) {
  const clean = sanitizeHtml(html)
  return (
    <div
      className={className}
      style={{ fontFamily: 'var(--font-body)', fontSize: 17, lineHeight: 1.75, color: 'var(--ink)', marginTop: 24 }}
      dangerouslySetInnerHTML={{ __html: clean }}
    />
  )
}
