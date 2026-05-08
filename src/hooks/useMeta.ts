import { useEffect } from 'react'

interface MetaOptions {
  title: string
  description?: string
  url?: string
  image?: string
}

export function useMeta({ title, description, url, image }: MetaOptions) {
  useEffect(() => {
    document.title = title

    const setMeta = (property: string, content: string) => {
      let el = document.querySelector(`meta[property="${property}"]`) as HTMLMetaElement | null
      if (!el) {
        el = document.createElement('meta')
        el.setAttribute('property', property)
        document.head.appendChild(el)
      }
      el.content = content
    }

    const setNameMeta = (name: string, content: string) => {
      let el = document.querySelector(`meta[name="${name}"]`) as HTMLMetaElement | null
      if (!el) {
        el = document.createElement('meta')
        el.setAttribute('name', name)
        document.head.appendChild(el)
      }
      el.content = content
    }

    setMeta('og:title', title)
    if (description) {
      setNameMeta('description', description)
      setMeta('og:description', description)
      setNameMeta('twitter:description', description)
    }
    if (url) {
      setMeta('og:url', url)
      let canonical = document.querySelector('link[rel="canonical"]') as HTMLLinkElement | null
      if (!canonical) {
        canonical = document.createElement('link')
        canonical.rel = 'canonical'
        document.head.appendChild(canonical)
      }
      canonical.href = url
    }
    if (image) {
      setMeta('og:image', image)
      setNameMeta('twitter:image', image)
    }
    setNameMeta('twitter:title', title)
  }, [title, description, url, image])
}
