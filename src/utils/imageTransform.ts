/**
 * Supabase Storage Image Transformation Helper
 *
 * Supabase Storage supports on-the-fly image resizing via URL parameters.
 * Only works for images stored in Supabase Storage buckets (not external URLs).
 * Docs: https://supabase.com/docs/guides/storage/serving/image-transformations
 *
 * Usage:
 *   import { getSupabaseImageUrl } from '../utils/imageTransform';
 *   <img src={getSupabaseImageUrl(word.image_url, { width: 200, height: 200 })} />
 */

export interface ImageTransformOptions {
  width?: number;
  height?: number;
  quality?: number; // 1-100, default 80
  resize?: 'cover' | 'contain' | 'fill';
  format?: 'origin' | 'avif' | 'webp';
}

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL as string | undefined;

/**
 * Returns a Supabase image URL with transformation parameters appended.
 * Falls back to the original URL if it's not a Supabase Storage URL.
 */
export function getSupabaseImageUrl(
  url: string | null | undefined,
  options: ImageTransformOptions = {}
): string | null {
  if (!url) return null;

  // Only apply transforms to Supabase Storage URLs
  const isSupabaseUrl =
    (SUPABASE_URL && url.startsWith(SUPABASE_URL)) ||
    url.includes('.supabase.co/storage/');

  if (!isSupabaseUrl) return url;

  // Supabase image transform endpoint: /render/image/public/
  // Convert: /storage/v1/object/public/ → /storage/v1/render/image/public/
  const transformUrl = url.replace(
    '/storage/v1/object/public/',
    '/storage/v1/render/image/public/'
  );

  const params = new URLSearchParams();
  if (options.width) params.set('width', String(options.width));
  if (options.height) params.set('height', String(options.height));
  if (options.quality) params.set('quality', String(options.quality));
  if (options.resize) params.set('resize', options.resize);
  if (options.format) params.set('format', options.format);

  const queryString = params.toString();
  if (!queryString) return url;

  return `${transformUrl}?${queryString}`;
}

/**
 * Preset: thumbnail for word/game cards (200×200, 80% quality, cover crop)
 */
export function getCardThumbnailUrl(url: string | null | undefined): string | null {
  return getSupabaseImageUrl(url, { width: 200, height: 200, quality: 80, resize: 'cover' });
}

/**
 * Preset: small avatar (80×80, 85% quality)
 */
export function getAvatarThumbnailUrl(url: string | null | undefined): string | null {
  return getSupabaseImageUrl(url, { width: 80, height: 80, quality: 85, resize: 'cover' });
}

/**
 * Preset: blog cover hero (1200×630, 85% quality)
 */
export function getBlogCoverUrl(url: string | null | undefined): string | null {
  return getSupabaseImageUrl(url, { width: 1200, height: 630, quality: 85, resize: 'cover' });
}
