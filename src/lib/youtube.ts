const YT_ID_RE = /^[a-zA-Z0-9_-]{11}$/

export function extractYouTubeId(url: string): string {
  if (!url) return ''
  let raw = ''
  // youtu.be short links
  if (url.includes('youtu.be/')) raw = url.split('youtu.be/')[1]?.split(/[?&#]/)[0] || ''
  // Shorts
  else if (url.includes('/shorts/')) raw = url.split('/shorts/')[1]?.split(/[?&#]/)[0] || ''
  // Standard watch?v=
  else if (url.includes('watch?v=')) try { raw = new URL(url).searchParams.get('v') || '' } catch { return '' }
  // Embed (including youtube-nocookie.com)
  else if (url.includes('/embed/')) raw = url.split('/embed/')[1]?.split(/[?&#]/)[0] || ''
  // Legacy /v/
  else if (url.includes('/v/')) raw = url.split('/v/')[1]?.split(/[?&#]/)[0] || ''

  return YT_ID_RE.test(raw) ? raw : ''
}
