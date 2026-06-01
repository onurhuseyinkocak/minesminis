const INDEXNOW_KEY = '93a5ce89726a1b34519dce3d67ef74d5'
const HOST = 'minesminis.com'
const KEY_LOCATION = `https://${HOST}/${INDEXNOW_KEY}.txt`
const ENDPOINTS = [
  'https://api.indexnow.org/IndexNow',
  'https://www.bing.com/indexnow',
  'https://yandex.com/indexnow',
]

export async function submitToIndexNow(urls: string[]): Promise<{ endpoint: string; status: number }[]> {
  if (!urls.length) return []
  const body = JSON.stringify({ host: HOST, key: INDEXNOW_KEY, keyLocation: KEY_LOCATION, urlList: urls })
  return Promise.all(
    ENDPOINTS.map(async (endpoint) => {
      try {
        const r = await fetch(endpoint, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json; charset=utf-8' },
          body,
        })
        return { endpoint, status: r.status }
      } catch {
        return { endpoint, status: 0 }
      }
    }),
  )
}
