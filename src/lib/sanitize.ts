const ALLOWED_TAGS = new Set([
  'h2', 'h3', 'h4',
  'p', 'br', 'span',
  'strong', 'em', 'b', 'i', 'u',
  'ul', 'ol', 'li',
  'a',
  'blockquote',
  'code', 'pre',
  'table', 'thead', 'tbody', 'tr', 'td', 'th',
])

const ALLOWED_ATTRS_PER_TAG: Record<string, Set<string>> = {
  a: new Set(['href', 'target', 'rel', 'title']),
  table: new Set(['class']),
  td: new Set(['colspan', 'rowspan']),
  th: new Set(['colspan', 'rowspan', 'scope']),
}

const SAFE_URL = /^(https?:\/\/|\/|mailto:|tel:)/i

function escapeText(s: string): string {
  return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
}

function sanitizeAttrs(tag: string, raw: string): string {
  const allowed = ALLOWED_ATTRS_PER_TAG[tag]
  if (!allowed) return ''
  const attrs: string[] = []
  const re = /([a-zA-Z-]+)\s*=\s*("([^"]*)"|'([^']*)'|[^\s>]+)/g
  let m: RegExpExecArray | null
  while ((m = re.exec(raw)) !== null) {
    const name = m[1].toLowerCase()
    if (!allowed.has(name)) continue
    let value = (m[3] ?? m[4] ?? m[2]).trim()
    if (name === 'href' && !SAFE_URL.test(value)) continue
    value = value.replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
    attrs.push(`${name}="${value}"`)
  }
  if (tag === 'a' && attrs.some((a) => a.startsWith('href="http'))) {
    if (!attrs.some((a) => a.startsWith('rel='))) attrs.push('rel="noopener noreferrer"')
    if (!attrs.some((a) => a.startsWith('target='))) attrs.push('target="_blank"')
  }
  return attrs.length ? ' ' + attrs.join(' ') : ''
}

export function sanitizeHtml(html: string): string {
  if (!html) return ''
  let out = ''
  let i = 0
  while (i < html.length) {
    const lt = html.indexOf('<', i)
    if (lt < 0) {
      out += escapeText(html.slice(i))
      break
    }
    out += escapeText(html.slice(i, lt))
    const gt = html.indexOf('>', lt + 1)
    if (gt < 0) {
      out += escapeText(html.slice(lt))
      break
    }
    const tagRaw = html.slice(lt + 1, gt)
    if (tagRaw.startsWith('!--')) {
      // skip comment
      i = gt + 1
      continue
    }
    const isClose = tagRaw.startsWith('/')
    const tagBody = isClose ? tagRaw.slice(1).trim() : tagRaw.trim()
    const nameMatch = tagBody.match(/^([a-zA-Z][a-zA-Z0-9]*)\b([^]*?)\/?$/)
    if (!nameMatch) {
      i = gt + 1
      continue
    }
    const tag = nameMatch[1].toLowerCase()
    if (!ALLOWED_TAGS.has(tag)) {
      i = gt + 1
      continue
    }
    if (isClose) {
      out += `</${tag}>`
    } else {
      const attrs = sanitizeAttrs(tag, nameMatch[2] || '')
      out += `<${tag}${attrs}>`
    }
    i = gt + 1
  }
  return out
}
