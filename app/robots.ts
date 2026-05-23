import type { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/admin', '/admin/', '/api/'],
      },
      // AdSense crawler — explicit
      {
        userAgent: 'Mediapartners-Google',
        allow: '/',
        disallow: ['/admin', '/admin/', '/api/'],
      },
      // AdsBot — explicit
      {
        userAgent: 'AdsBot-Google',
        allow: '/',
        disallow: ['/admin', '/admin/', '/api/'],
      },
    ],
    sitemap: 'https://minesminis.com/sitemap.xml',
  }
}
