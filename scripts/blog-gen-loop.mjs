#!/usr/bin/env node
// Continuous blog generation with rate limit awareness.
// Each call pauses 90-180s between to respect Pollinations IP quota.

const ADMIN_KEY = 'ce03784683c9ff14d3f85b0bd9672b0406ad69f028dbed09'
const URL = 'https://minesminis.com/api/blog-cron?count=1'

const target = parseInt(process.argv[2] || '20', 10)
console.log(`Generating ${target} blogs with pacing…`)

let success = 0
let fail = 0
const slugs = []

for (let i = 0; i < target; i++) {
  const start = Date.now()
  try {
    const ctl = new AbortController()
    const timer = setTimeout(() => ctl.abort(), 290000)
    const r = await fetch(URL, {
      method: 'POST',
      headers: { 'x-admin-key': ADMIN_KEY },
      signal: ctl.signal,
    })
    clearTimeout(timer)
    const text = await r.text()
    try {
      const j = JSON.parse(text)
      if (j.generated > 0) {
        success++
        slugs.push(...(j.slugs || []))
        console.log(`[${i + 1}/${target}] OK: ${j.slugs?.[0] || '?'} (${j.duration_ms}ms)`)
      } else {
        fail++
        console.warn(`[${i + 1}/${target}] FAIL: ${(j.errors || []).join(' | ').slice(0, 120)}`)
      }
    } catch {
      fail++
      console.warn(`[${i + 1}/${target}] non-JSON: ${text.slice(0, 120)}`)
    }
  } catch (e) {
    fail++
    console.warn(`[${i + 1}/${target}] EXC: ${String(e).slice(0, 120)}`)
  }
  const elapsed = Date.now() - start
  if (i < target - 1) {
    // Pace: 100-130s between calls to be polite to Pollinations
    const pause = Math.max(20000, 110000 - elapsed) + Math.floor(Math.random() * 25000)
    console.log(`pausing ${(pause / 1000).toFixed(0)}s…`)
    await new Promise((r) => setTimeout(r, pause))
  }
}

console.log(`\nDONE — ${success} success, ${fail} fail.`)
console.log('Slugs:')
slugs.forEach((s) => console.log(`  https://minesminis.com/blog/${s}`))
