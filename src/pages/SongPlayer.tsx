import { useState, useEffect, useRef, useCallback } from 'react'
import { useParams, Link } from 'react-router-dom'
import { ArrowLeft, SkipBack, Pause, Play, SkipForward, Repeat } from 'lucide-react'
import Layout from '../components/Layout'
import Cover from '../components/Cover'
import { supabase, Song, SongLyric } from '../lib/supabase'
import { extractYouTubeId } from '../lib/youtube'

export default function SongPlayer() {
  const { id } = useParams()
  const [song, setSong] = useState<Song | null>(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [progress, setProgress] = useState(0)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)
  const [loop, setLoop] = useState(false)
  const [error, setError] = useState(false)
  const audioRef = useRef<HTMLAudioElement | null>(null)

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

  // Audio setup
  useEffect(() => {
    if (!song?.audio_url) return
    const audio = new Audio(song.audio_url)
    audioRef.current = audio
    audio.loop = loop

    audio.addEventListener('loadedmetadata', () => setDuration(audio.duration))
    audio.addEventListener('timeupdate', () => {
      setCurrentTime(audio.currentTime)
      if (audio.duration) setProgress((audio.currentTime / audio.duration) * 100)
    })
    audio.addEventListener('ended', () => { setIsPlaying(false); setProgress(0); setCurrentTime(0) })
    audio.addEventListener('error', () => { setIsPlaying(false); setError(true) })

    return () => { audio.pause(); audio.src = '' }
  }, [song?.audio_url, loop])

  const togglePlay = useCallback(() => {
    const audio = audioRef.current
    if (!audio) return
    if (isPlaying) { audio.pause() } else { audio.play() }
    setIsPlaying(!isPlaying)
  }, [isPlaying])

  const seek = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    const audio = audioRef.current
    if (!audio || !audio.duration) return
    const rect = e.currentTarget.getBoundingClientRect()
    const pct = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width))
    audio.currentTime = pct * audio.duration
  }, [])

  const skipBack = useCallback(() => {
    const audio = audioRef.current
    if (audio) audio.currentTime = Math.max(0, audio.currentTime - 10)
  }, [])

  const skipForward = useCallback(() => {
    const audio = audioRef.current
    if (audio) audio.currentTime = Math.min(audio.duration || 0, audio.currentTime + 10)
  }, [])

  const fmt = (s: number) => {
    const m = Math.floor(s / 60)
    const sec = Math.floor(s % 60)
    return `${m}:${sec.toString().padStart(2, '0')}`
  }

  if (error) {
    return (
      <Layout>
        <div style={{ textAlign: 'center', padding: 60 }}>
          <p style={{ fontFamily: 'var(--font-display)', fontSize: 20, fontWeight: 700, color: 'var(--primary)' }}>Content not found</p>
          <Link to="/songs" className="mm-btn primary" style={{ marginTop: 12, textDecoration: 'none', display: 'inline-flex' }}>Back to Songs</Link>
        </div>
      </Layout>
    )
  }

  if (!song) {
    return (
      <Layout>
        <div style={{ textAlign: 'center', padding: 60, color: 'var(--ink-3)' }}>
          <p style={{ fontFamily: 'var(--font-display)', fontSize: 20 }}>Loading...</p>
        </div>
      </Layout>
    )
  }

  const youtubeId = song.youtube_url ? extractYouTubeId(song.youtube_url) : ''

  return (
    <Layout>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
        <Link to="/songs" className="mm-icon-btn" aria-label="Back to Songs"><ArrowLeft size={18} /></Link>
        <span style={{ color: 'var(--ink-3)', fontWeight: 600, fontSize: 14 }}>Songs / {song.title}</span>
      </div>

      {/* Main layout: small video/cover left, big karaoke right */}
      <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 280px) 1fr', gap: 20 }} className="mm-song-layout">
        {/* Left: video/cover + controls */}
        <div>
          {/* Small YouTube embed or cover */}
          {youtubeId ? (
            <div style={{ borderRadius: 18, overflow: 'hidden', aspectRatio: '16/9', boxShadow: 'var(--shadow-1)' }}>
              <iframe
                src={`https://www.youtube.com/embed/${youtubeId}`}
                title={song.title}
                style={{ width: '100%', height: '100%', border: 'none' }}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
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

          {song.audio_url ? (
            <>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10, marginTop: 14 }}>
                <button className="mm-icon-btn" onClick={skipBack} aria-label="Skip back 10s"><SkipBack size={16} /></button>
                <button className="mm-icon-btn primary" style={{ width: 48, height: 48 }} onClick={togglePlay} aria-label={isPlaying ? 'Pause' : 'Play'}>
                  {isPlaying ? <Pause size={20} /> : <Play size={20} />}
                </button>
                <button className="mm-icon-btn" onClick={skipForward} aria-label="Skip forward 10s"><SkipForward size={16} /></button>
                <button className={`mm-icon-btn${loop ? ' primary' : ''}`} onClick={() => setLoop(!loop)} aria-label="Repeat">
                  <Repeat size={16} />
                </button>
              </div>
              <div className="mm-progress" style={{ marginTop: 12, cursor: 'pointer' }} onClick={seek}>
                <div className="mm-progress-fill" style={{ width: `${progress}%`, transition: 'width 0.2s' }} />
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 4, fontSize: 11, color: 'var(--ink-3)', fontWeight: 600 }}>
                <span>{fmt(currentTime)}</span><span>{duration ? fmt(duration) : song.duration}</span>
              </div>
            </>
          ) : (
            <div style={{ marginTop: 14, padding: 14, background: 'var(--surface-2)', borderRadius: 12, textAlign: 'center', fontSize: 13, color: 'var(--ink-3)' }}>
              Audio file not added yet
            </div>
          )}
        </div>

        {/* Right: Karaoke lyrics — main focus */}
        <div style={{ background: 'white', borderRadius: 24, padding: 28, border: '1px solid var(--line)', minHeight: 400 }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
            <div style={{ fontSize: 14, fontWeight: 700, color: 'var(--ink-3)', letterSpacing: 1.5 }}>KARAOKE</div>
            <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--ink-3)' }}>English - Turkish</span>
          </div>

          {(song.lyrics || []).length > 0 ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
              {(song.lyrics || []).map((line: SongLyric, i: number) => (
                <div key={i}>
                  <div style={{
                    fontFamily: 'var(--font-display)',
                    fontSize: line.highlight ? 36 : 22,
                    fontWeight: line.highlight ? 800 : 600,
                    lineHeight: 1.3,
                    color: line.highlight ? 'var(--primary)' : 'var(--ink)',
                    letterSpacing: line.highlight ? -0.5 : 0,
                  }}>
                    {line.en}
                  </div>
                  {line.tr && (
                    <div style={{ fontSize: 16, color: 'var(--ink-2)', fontWeight: 500, fontStyle: 'italic', marginTop: 4 }}>
                      {line.tr}
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div style={{ textAlign: 'center', padding: 40, color: 'var(--ink-3)', fontSize: 14 }}>
              Lyrics not added yet
            </div>
          )}
        </div>
      </div>
    </Layout>
  )
}
