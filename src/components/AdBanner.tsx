type AdFormat = 'horizontal' | 'rectangle' | 'vertical' | 'auto'

// AdSense ads are disabled until publisher approval. Component renders nothing.
// To re-enable after AdSense approval: restore the adsbygoogle <ins> tag implementation.
export default function AdBanner(_props: { format?: AdFormat; className?: string }) {
  return null
}
