import { useState, useEffect, useRef, useCallback } from 'react'
import { useParams, Link } from 'react-router-dom'
import { ArrowLeft, SkipBack, Pause, Play, SkipForward, Repeat } from 'lucide-react'
import Cover from '../components/Cover'
import AdBanner from '../components/AdBanner'
import { supabase, Song, SongLyric } from '../lib/supabase'
import { extractYouTubeId } from '../lib/youtube'

// YouTube IFrame API types
declare global {
  interface Window {
    YT: { Player: new (el: string | HTMLElement, config: Record<string, unknown>) => YTPlayer; PlayerState: Record<string, number> }
    onYouTubeIframeAPIReady: () => void
  }
}
interface YTPlayer {
  getCurrentTime: () => number
  getDuration: () => number
  getPlayerState: () => number
  playVideo: () => void
  pauseVideo: () => void
  seekTo: (s: number, allowSeekAhead: boolean) => void
  destroy: () => void
}

let ytApiLoaded = false
function loadYouTubeAPI(): Promise<void> {
  if (ytApiLoaded || window.YT?.Player) { ytApiLoaded = true; return Promise.resolve() }
  return new Promise(resolve => {
    const tag = document.createElement('script')
    tag.src = 'https://www.youtube.com/iframe_api'
    document.head.appendChild(tag)
    window.onYouTubeIframeAPIReady = () => { ytApiLoaded = true; resolve() }
  })
}

export default function SongPlayer() {
  const { id } = useParams()
  const [song, setSong] = useState<Song | null>(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [progress, setProgress] = useState(0)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)
  const [loop, setLoop] = useState(false)
  const [error, setError] = useState(false)
  const [activeLine, setActiveLine] = useState(-1)
  const audioRef = useRef<HTMLAudioElement | null>(null)
  const ytPlayerRef = useRef<YTPlayer | null>(null)
  const ytIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null)
  const lyricsRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (id) {
      supabase.from('mm_songs').select('*').eq('id', id).eq('published', true).single()
        .then(({ data, error: err }) => {
          if (err || !data) { setError(true); return }
          setSong(data)
        })
    }
  }, [id])

  useEffect(() => { document.title = song ? `${song.title} - minesminis` : 'minesminis' }, [song])

  // YouTube Player setup (for karaoke sync)
  const youtubeId = song?.youtube_url ? extractYouTubeId(song.youtube_url) : ''
  // Always use YT Player API when youtube exists (for karaoke sync)
  const useYouTube = !!youtubeId

  useEffect(() => {
    if (!useYouTube || !youtubeId) return
    let player: YTPlayer | null = null

    loadYouTubeAPI().then(() => {
      const el = document.getElementById('yt-karaoke-player')
      if (!el) return
      player = new window.YT.Player('yt-karaoke-player', {
        videoId: youtubeId,
        playerVars: { autoplay: 0, controls: 1, modestbranding: 1, rel: 0 },
        events: {
          onReady: (e: { target: YTPlayer }) => {
            ytPlayerRef.current = e.target
            setDuration(e.target.getDuration())
          },
          onStateChange: (e: { data: number }) => {
            // 1 = playing, 2 = paused
            const playing = e.data === 1
            setIsPlaying(playing)
            if (playing) {
              // Poll currentTime while playing
              if (ytIntervalRef.current) clearInterval(ytIntervalRef.current)
              ytIntervalRef.current = setInterval(() => {
                if (ytPlayerRef.current) {
                  const ct = ytPlayerRef.current.getCurrentTime()
                  const dur = ytPlayerRef.current.getDuration()
                  setCurrentTime(ct)
                  if (dur) setProgress((ct / dur) * 100)
                }
              }, 250)
            } else {
              if (ytIntervalRef.current) { clearInterval(ytIntervalRef.current); ytIntervalRef.current = null }
            }
          },
        },
      } as Record<string, unknown>)
    })

    return () => {
      if (ytIntervalRef.current) clearInterval(ytIntervalRef.current)
      if (player) { try { player.destroy() } catch { /* */ } }
      ytPlayerRef.current = null
    }
  }, [useYouTube, youtubeId])

  // Audio setup (for songs with audio_url but NO youtube — avoid dual players)
  useEffect(() => {
    if (!song?.audio_url || useYouTube) return
    const audio = new Audio(song.audio_url)
    audioRef.current = audio
    audio.loop = loop

    const onMeta = () => setDuration(audio.duration)
    const onTime = () => {
      setCurrentTime(audio.currentTime)
      if (audio.duration) setProgress((audio.currentTime / audio.duration) * 100)
    }
    const onEnd = () => { setIsPlaying(false); setProgress(0); setCurrentTime(0); setActiveLine(-1) }
    const onErr = () => { setIsPlaying(false); setError(true) }

    audio.addEventListener('loadedmetadata', onMeta)
    audio.addEventListener('timeupdate', onTime)
    audio.addEventListener('ended', onEnd)
    audio.addEventListener('error', onErr)

    return () => {
      audio.removeEventListener('loadedmetadata', onMeta)
      audio.removeEventListener('timeupdate', onTime)
      audio.removeEventListener('ended', onEnd)
      audio.removeEventListener('error', onErr)
      audio.pause()
      audio.src = ''
    }
  }, [song?.audio_url, loop, useYouTube])

  // Karaoke sync — use per-line timestamps
  useEffect(() => {
    if (!song?.lyrics?.length) { setActiveLine(-1); return }
    const lyrics = song.lyrics
    const hasTimestamps = lyrics.some((l: SongLyric) => typeof l.time === 'number')

    if (!hasTimestamps) {
      // Fallback: word-weighted approximate sync with intro/outro buffer
      if (duration <= 0) { setActiveLine(-1); return }
      // Reserve ~15% for intro, ~10% for outro
      const intro = duration * 0.15
      const outro = duration * 0.10
      const lyricDuration = duration - intro - outro
      if (lyricDuration <= 0) { setActiveLine(-1); return }
      const totalWords = lyrics.reduce((sum: number, l: SongLyric) => {
        const text = (l.en || '').trim()
        return sum + (text ? text.split(/\s+/).length : 0)
      }, 0)
      if (totalWords === 0) { setActiveLine(-1); return }
      let cumWords = 0
      let idx = -1
      for (let i = 0; i < lyrics.length; i++) {
        const text = (lyrics[i].en || '').trim()
        const words = text ? text.split(/\s+/).length : 0
        const lineStart = intro + (cumWords / totalWords) * lyricDuration
        if (currentTime >= lineStart) idx = i
        cumWords += words
      }
      setActiveLine(idx)
      return
    }

    // Find active line: last line whose timestamp <= currentTime
    let idx = -1
    for (let i = 0; i < lyrics.length; i++) {
      if (typeof lyrics[i].time === 'number' && currentTime >= lyrics[i].time!) {
        idx = i
      }
    }
    setActiveLine(idx)
  }, [currentTime, song?.lyrics, duration])

  // Auto-scroll to active line
  useEffect(() => {
    if (activeLine < 0 || !lyricsRef.current) return
    const el = lyricsRef.current.children[activeLine] as HTMLElement
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'center' })
  }, [activeLine])

  const togglePlay = useCallback(() => {
    if (useYouTube && ytPlayerRef.current) {
      if (isPlaying) ytPlayerRef.current.pauseVideo()
      else ytPlayerRef.current.playVideo()
      return
    }
    const audio = audioRef.current
    if (!audio) return
    if (isPlaying) { audio.pause() } else { audio.play() }
    setIsPlaying(!isPlaying)
  }, [isPlaying, useYouTube])

  const seek = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (useYouTube && ytPlayerRef.current) {
      const rect = e.currentTarget.getBoundingClientRect()
      const pct = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width))
      ytPlayerRef.current.seekTo(pct * (ytPlayerRef.current.getDuration() || 0), true)
      return
    }
    const audio = audioRef.current
    if (!audio || !audio.duration) return
    const rect = e.currentTarget.getBoundingClientRect()
    const pct = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width))
    audio.currentTime = pct * audio.duration
  }, [useYouTube])

  const skipBack = useCallback(() => {
    if (useYouTube && ytPlayerRef.current) {
      ytPlayerRef.current.seekTo(Math.max(0, ytPlayerRef.current.getCurrentTime() - 10), true)
      return
    }
    const audio = audioRef.current
    if (audio) audio.currentTime = Math.max(0, audio.currentTime - 10)
  }, [useYouTube])

  const skipForward = useCallback(() => {
    if (useYouTube && ytPlayerRef.current) {
      ytPlayerRef.current.seekTo(ytPlayerRef.current.getCurrentTime() + 10, true)
      return
    }
    const audio = audioRef.current
    if (audio) audio.currentTime = Math.min(audio.duration || 0, audio.currentTime + 10)
  }, [useYouTube])

  const fmt = (s: number) => {
    const m = Math.floor(s / 60)
    const sec = Math.floor(s % 60)
    return `${m}:${sec.toString().padStart(2, '0')}`
  }

  if (error) {
    return (
      <>
        <div style={{ textAlign: 'center', padding: 60 }}>
          <p style={{ fontFamily: 'var(--font-display)', fontSize: 20, fontWeight: 700, color: 'var(--primary)' }}>Content not found</p>
          <Link to="/songs" className="mm-btn primary" style={{ marginTop: 12, textDecoration: 'none', display: 'inline-flex' }}>Back to Songs</Link>
        </div>
      </>
    )
  }

  if (!song) {
    return (
      <>
        <div style={{ textAlign: 'center', padding: 60, color: 'var(--ink-3)' }}>
          <p style={{ fontFamily: 'var(--font-display)', fontSize: 20 }}>Loading...</p>
        </div>
      </>
    )
  }

  const hasLyrics = (song.lyrics || []).length > 0

  return (
    <>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
        <Link to="/songs" className="mm-icon-btn" aria-label="Back to Songs"><ArrowLeft size={18} /></Link>
        <span style={{ color: 'var(--ink-3)', fontWeight: 600, fontSize: 14 }}>Songs / {song.title}</span>
      </div>

      {/* Main layout: video/cover left, lyrics right (if available) */}
      <div style={{ display: 'grid', gridTemplateColumns: hasLyrics ? 'minmax(0, 280px) 1fr' : '1fr', gap: 20, maxWidth: hasLyrics ? undefined : 560 }} className="mm-song-layout">
        {/* Left: video/cover + controls */}
        <div>
          {youtubeId ? (
            <div style={{ borderRadius: 18, overflow: 'hidden', aspectRatio: '16/9', boxShadow: 'var(--shadow-1)' }}>
              <div id="yt-karaoke-player" style={{ width: '100%', height: '100%' }} />
            </div>
          ) : (
            <div style={{ borderRadius: 18, overflow: 'hidden', boxShadow: 'var(--shadow-1)', aspectRatio: '1' }}>
              <Cover kind={song.cover_kind} />
            </div>
          )}

          <div style={{ marginTop: 14 }}>
            <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 22, margin: 0, letterSpacing: -0.5 }}>{song.title}</h2>
            <p style={{ fontSize: 13, color: 'var(--ink-3)', margin: '4px 0 0' }}>{song.category} - {song.duration}</p>
          </div>

          {(song.audio_url || useYouTube) ? (
            <>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10, marginTop: 14 }}>
                <button className="mm-icon-btn" onClick={skipBack} aria-label="Skip back 10s"><SkipBack size={16} /></button>
                <button className="mm-icon-btn primary" style={{ width: 48, height: 48 }} onClick={togglePlay} aria-label={isPlaying ? 'Pause' : 'Play'}>
                  {isPlaying ? <Pause size={20} /> : <Play size={20} />}
                </button>
                <button className="mm-icon-btn" onClick={skipForward} aria-label="Skip forward 10s"><SkipForward size={16} /></button>
                {!useYouTube && (
                  <button className={`mm-icon-btn${loop ? ' primary' : ''}`} onClick={() => setLoop(!loop)} aria-label="Repeat">
                    <Repeat size={16} />
                  </button>
                )}
              </div>
              <div className="mm-progress" style={{ marginTop: 12, cursor: 'pointer' }} onClick={seek}>
                <div className="mm-progress-fill" style={{ width: `${progress}%`, transition: 'width 0.2s' }} />
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 4, fontSize: 12, color: 'var(--ink-3)', fontWeight: 600 }}>
                <span>{fmt(currentTime)}</span><span>{duration ? fmt(duration) : song.duration}</span>
              </div>
            </>
          ) : (
            <div style={{ marginTop: 14, padding: 14, background: 'var(--surface-2)', borderRadius: 12, textAlign: 'center', fontSize: 13, color: 'var(--ink-3)' }}>
              Audio file not added yet
            </div>
          )}
        </div>

        {/* Right: Karaoke lyrics panel */}
        {hasLyrics && (
          <div style={{ background: 'white', borderRadius: 24, padding: 28, border: '1px solid var(--line)', maxHeight: 500, overflow: 'auto' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
              <div style={{ fontSize: 14, fontWeight: 700, color: 'var(--ink-3)', letterSpacing: 1.5 }}>
                {(song.audio_url || useYouTube) ? 'KARAOKE' : 'LYRICS'}
              </div>
              <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--ink-3)' }}>English - Turkish</span>
            </div>

            <div ref={lyricsRef} style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
              {song.lyrics.map((line: SongLyric, i: number) => {
                const isActive = i === activeLine
                return (
                  <div key={i} style={{
                    padding: '8px 12px',
                    borderRadius: 12,
                    background: isActive ? 'var(--primary-light, #FFF0ED)' : 'transparent',
                    transition: 'all 0.3s ease',
                    transform: isActive ? 'scale(1.02)' : 'scale(1)',
                  }}>
                    <div style={{
                      fontFamily: 'var(--font-display)',
                      fontSize: isActive ? 28 : (line.highlight ? 24 : 20),
                      fontWeight: isActive || line.highlight ? 800 : 600,
                      lineHeight: 1.3,
                      color: isActive ? 'var(--primary)' : (line.highlight ? 'var(--ink)' : 'var(--ink-2)'),
                      transition: 'all 0.3s ease',
                    }}>
                      {line.en}
                    </div>
                    {line.tr && (
                      <div style={{
                        fontSize: isActive ? 16 : 14,
                        color: isActive ? 'var(--primary)' : 'var(--ink-3)',
                        fontWeight: 500,
                        fontStyle: 'italic',
                        marginTop: 4,
                        opacity: isActive ? 1 : 0.7,
                        transition: 'all 0.3s ease',
                      }}>
                        {line.tr}
                      </div>
                    )}
                  </div>
                )
              })}
            </div>
          </div>
        )}
      </div>

      <AdBanner format="auto" />
    </>
  )
}
