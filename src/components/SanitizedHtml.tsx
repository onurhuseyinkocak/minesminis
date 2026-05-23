// Server component — uses isomorphic-dompurify under the hood via jsdom-free path.
// Since we only render trusted static content + DB-stored HTML, we sanitize at render.
import DOMPurify from 'isomorphic-dompurify'

const allowedTags = ['h2', 'h3', 'h4', 'p', 'ul', 'ol', 'li', 'strong', 'em', 'a', 'blockquote', 'br', 'span', 'table', 'thead', 'tbody', 'tr', 'td', 'th', 'code']
const allowedAttr = ['href', 'target', 'rel', 'class', 'border', 'cellpadding']

export default function SanitizedHtml({ html, className }: { html: string; className?: string }) {
  const clean = DOMPurify.sanitize(html, { ALLOWED_TAGS: allowedTags, ALLOWED_ATTR: allowedAttr })
  return (
    <div
      className={className}
      style={{ fontFamily: 'var(--font-body)', fontSize: 17, lineHeight: 1.75, color: 'var(--ink)', marginTop: 24 }}
      dangerouslySetInnerHTML={{ __html: clean }}
    />
  )
}
