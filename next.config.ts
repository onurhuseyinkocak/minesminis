import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  reactStrictMode: true,
  // Skip lint during build — Next.js still type-checks
  eslint: { ignoreDuringBuilds: true },
  // Allow images from supabase storage + youtube embeds.
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'kcbblalwwfjevneegmcv.supabase.co' },
      { protocol: 'https', hostname: 'i.ytimg.com' },
      { protocol: 'https', hostname: 'img.youtube.com' },
      { protocol: 'https', hostname: 'image.pollinations.ai' },
    ],
  },
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          { key: 'Strict-Transport-Security', value: 'max-age=63072000; includeSubDomains; preload' },
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'X-Frame-Options', value: 'SAMEORIGIN' },
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
          {
            key: 'Content-Security-Policy',
            value: [
              "default-src 'self'",
              "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://pagead2.googlesyndication.com https://www.googletagservices.com https://adservice.google.com https://partner.googleadservices.com https://tpc.googlesyndication.com https://www.google.com https://googleads.g.doubleclick.net https://www.youtube.com https://s.ytimg.com",
              "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
              "img-src 'self' https: data:",
              "font-src 'self' https://fonts.gstatic.com",
              "frame-src https://www.youtube.com https://www.youtube-nocookie.com https://googleads.g.doubleclick.net https://tpc.googlesyndication.com https://www.google.com https://*.google.com https://docs.google.com https://view.officeapps.live.com https://drive.google.com",
              "connect-src 'self' https://*.supabase.co https://pagead2.googlesyndication.com https://*.googlesyndication.com https://*.doubleclick.net https://noembed.com https://ep1.adtrafficquality.google https://*.google.com https://text.pollinations.ai https://image.pollinations.ai",
              "object-src 'none'",
              "base-uri 'self'",
            ].join('; '),
          },
        ],
      },
    ]
  },
}

export default nextConfig
