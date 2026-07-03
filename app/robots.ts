import type { MetadataRoute } from 'next'

const DISALLOW = ['/admin', '/admin/', '/api/']

const allowAll = (userAgent: string) => ({ userAgent, allow: '/', disallow: DISALLOW })

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      { userAgent: '*', allow: '/', disallow: DISALLOW },

      // Google ecosystem
      allowAll('Googlebot'),
      allowAll('Googlebot-Image'),
      allowAll('Googlebot-News'),
      allowAll('Googlebot-Video'),
      allowAll('Mediapartners-Google'),
      allowAll('AdsBot-Google'),
      allowAll('AdsBot-Google-Mobile'),
      allowAll('Google-Extended'), // Gemini / AI Overviews training

      // Bing / Yandex / Apple / DuckDuckGo
      allowAll('Bingbot'),
      allowAll('YandexBot'),
      allowAll('Applebot'),
      allowAll('Applebot-Extended'), // Apple Intelligence
      allowAll('DuckDuckBot'),

      // AI search crawlers (we WANT to be cited in AI answers)
      allowAll('GPTBot'),
      allowAll('OAI-SearchBot'),
      allowAll('ChatGPT-User'),
      allowAll('ClaudeBot'),
      allowAll('Claude-User'),
      allowAll('Claude-SearchBot'),
      allowAll('Claude-Web'),
      allowAll('anthropic-ai'),
      allowAll('PerplexityBot'),
      allowAll('Perplexity-User'),
      allowAll('YouBot'),
      allowAll('DuckAssistBot'),
      allowAll('MistralAI-User'),
      allowAll('CCBot'),
      allowAll('Bytespider'),
      allowAll('Diffbot'),
      allowAll('Meta-ExternalAgent'),
      allowAll('Meta-ExternalFetcher'),
      allowAll('Amazonbot'),
      allowAll('cohere-ai'),
      allowAll('cohere-training-data-crawler'),
    ],
    sitemap: [
      'https://minesminis.com/sitemap.xml',
      'https://minesminis.com/sitemap-topics.xml',
      'https://minesminis.com/sitemap-news.xml',
      'https://minesminis.com/sitemap-images.xml',
    ],
    host: 'https://minesminis.com',
  }
}
