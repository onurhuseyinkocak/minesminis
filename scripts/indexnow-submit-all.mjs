#!/usr/bin/env node
const KEY = '93a5ce89726a1b34519dce3d67ef74d5'
const HOST = 'minesminis.com'
const KEY_LOC = `https://${HOST}/${KEY}.txt`

const ENDPOINTS = [
  'https://api.indexnow.org/IndexNow',
  'https://www.bing.com/indexnow',
  'https://yandex.com/indexnow',
]

async function main() {
  const r = await fetch(`https://${HOST}/sitemap.xml`)
  const xml = await r.text()
  const urls = [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1])
  console.log(`Found ${urls.length} URLs in sitemap`)

  const body = JSON.stringify({ host: HOST, key: KEY, keyLocation: KEY_LOC, urlList: urls.slice(0, 10000) })

  for (const ep of ENDPOINTS) {
    try {
      const r = await fetch(ep, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body })
      console.log(`${ep} → ${r.status}`)
    } catch (e) {
      console.error(`${ep} → ${e.message}`)
    }
  }
}

main().catch((e) => {
  console.error(e)
  process.exit(1)
})
