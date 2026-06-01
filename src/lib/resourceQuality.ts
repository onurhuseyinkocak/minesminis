import type { Slide, Song, Video, Worksheet } from './supabase'
import { extractYouTubeId } from './youtube'

type PartialSlide = Pick<Slide, 'file_url' | 'slides_data'>
type PartialSong = Pick<Song, 'audio_url' | 'youtube_url' | 'lyrics'>
type PartialVideo = Pick<Video, 'youtube_url'>
type PartialWorksheet = Pick<Worksheet, 'file_url'>

function hasText(value: unknown) {
  return typeof value === 'string' && value.trim().length > 0
}

export function hasSlideContent(slide: PartialSlide) {
  return hasText(slide.file_url) || (Array.isArray(slide.slides_data) && slide.slides_data.length > 0)
}

export function hasVideoContent(video: PartialVideo) {
  return hasText(video.youtube_url) && Boolean(extractYouTubeId(video.youtube_url))
}

export function hasSongContent(song: PartialSong) {
  const hasLyrics =
    Array.isArray(song.lyrics) &&
    song.lyrics.some((line) => hasText(line?.en) || hasText(line?.tr))

  return hasText(song.audio_url) || hasVideoContent(song) || hasLyrics
}

export function hasWorksheetContent(worksheet: PartialWorksheet) {
  return hasText(worksheet.file_url)
}
