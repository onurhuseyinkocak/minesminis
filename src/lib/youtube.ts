export function extractYouTubeId(url: string): string {
  if (!url) return ''
  // youtu.be short links
  if (url.includes('youtu.be/')) return url.split('youtu.be/')[1]?.split(/[?&#]/)[0] || ''
  // Shorts
  if (url.includes('/shorts/')) return url.split('/shorts/')[1]?.split(/[?&#]/)[0] || ''
  // Standard watch?v=
  if (url.includes('watch?v=')) try { return new URL(url).searchParams.get('v') || '' } catch { return '' }
  // Embed (including youtube-nocookie.com)
  if (url.includes('/embed/')) return url.split('/embed/')[1]?.split(/[?&#]/)[0] || ''
  // Legacy /v/
  if (url.includes('/v/')) return url.split('/v/')[1]?.split(/[?&#]/)[0] || ''
  return ''
}
