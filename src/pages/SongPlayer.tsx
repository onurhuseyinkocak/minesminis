import { useState, useEffect, useRef, useCallback } from 'react'
import { useParams, Link } from 'react-router-dom'
import { ArrowLeft, SkipBack, Pause, Play, SkipForward, Repeat } from 'lucide-react'
import Layout from '../components/Layout'
import Cover from '../components/Cover'
import { supabase } from '../lib/supabase'

export default function SongPlayer() {
  const { id } = useParams()
  const [song, setSong] = useState<any>(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [progress, setProgress] = useState(0)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)
  const [loop, setLoop] = useState(false)
  const [error, setError] = useState(false)
  const audioRef = useRef<HTMLAudioElement | null>(null)

  useEffect(() => {
    if (id) {
      supabase.from('mm_songs').select('*').eq('id', id).single()
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
          <p style={{ fontFamily: 'var(--font-display)', fontSize: 20, fontWeight: 700, color: 'var(--primary)' }}>Icerik bulunamadi</p>
          <Link to="/songs" className="mm-btn primary" style={{ marginTop: 12, textDecoration: 'none', display: 'inline-flex' }}>Sarkilara don</Link>
        </div>
      </Layout>
    )
  }

  if (!song) {
    return (
      <Layout>
        <div style={{ textAlign: 'center', padding: 60, color: 'var(--ink-3)' }}>
          <p style={{ fontFamily: 'var(--font-display)', fontSize: 20 }}>Yukleniyor...</p>
        </div>
      </Layout>
    )
  }

  return (
    <Layout>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
        <Link to="/songs" className="mm-icon-btn" aria-label="Sarkilara don"><ArrowLeft size={18} /></Link>
        <span style={{ color: 'var(--ink-3)', fontWeight: 600, fontSize: 14 }}>Sarkilar / {song.title}</span>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '320px 1fr', gap: 20 }}>
        {/* Cover + controls */}
        <div>
          <div style={{ borderRadius: 28, overflow: 'hidden', boxShadow: 'var(--shadow-2)', aspectRatio: '1' }}>
            <Cover kind={song.cover_kind} />
          </div>
          <div style={{ marginTop: 16 }}>
            <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 26, margin: 0, letterSpacing: -0.5 }}>{song.title}</h2>
            <p style={{ fontSize: 14, color: 'var(--ink-3)', margin: '4px 0 0' }}>{song.category} - {song.duration}</p>
          </div>

          {song.audio_url ? (
            <>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 12, marginTop: 18 }}>
                <button className="mm-icon-btn" onClick={skipBack} aria-label="10 saniye geri"><SkipBack size={18} /></button>
                <button className="mm-icon-btn primary" style={{ width: 56, height: 56 }} onClick={togglePlay} aria-label={isPlaying ? 'Durdur' : 'Oynat'}>
                  {isPlaying ? <Pause size={22} /> : <Play size={22} />}
                </button>
                <button className="mm-icon-btn" onClick={skipForward} aria-label="10 saniye ileri"><SkipForward size={18} /></button>
                <button className={`mm-icon-btn${loop ? ' primary' : ''}`} onClick={() => setLoop(!loop)} aria-label="Tekrarla">
                  <Repeat size={18} />
                </button>
              </div>
              <div className="mm-progress" style={{ marginTop: 16, cursor: 'pointer' }} onClick={seek}>
                <div className="mm-progress-fill" style={{ width: `${progress}%`, transition: 'width 0.2s' }} />
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 6, fontSize: 12, color: 'var(--ink-3)', fontWeight: 600 }}>
                <span>{fmt(currentTime)}</span><span>{duration ? fmt(duration) : song.duration}</span>
              </div>
            </>
          ) : (
            <div style={{ marginTop: 18, padding: 16, background: 'var(--surface-2)', borderRadius: 14, textAlign: 'center', fontSize: 13, color: 'var(--ink-3)' }}>
              Ses dosyasi henuz eklenmedi
            </div>
          )}
        </div>

        {/* Lyrics */}
        <div style={{ background: 'white', borderRadius: 28, padding: 28, border: '1px solid var(--line)' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 18 }}>
            <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--ink-3)', letterSpacing: 1.5 }}>SOZLER</div>
            <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--ink-3)' }}>Ingilizce - Turkce</span>
          </div>

          {(song.lyrics || []).length > 0 ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              {(song.lyrics || []).map((line: any, i: number) => (
                <div key={i}>
                  <div style={{
                    fontFamily: line.highlight ? 'var(--font-display)' : undefined,
                    fontSize: line.highlight ? 32 : 18,
                    fontWeight: line.highlight ? 800 : 500,
                    lineHeight: 1.2,
                    color: line.highlight ? 'var(--primary)' : 'var(--ink-3)',
                    letterSpacing: line.highlight ? -0.5 : 0,
                  }}>
                    {line.en}
                  </div>
                  {line.tr && (
                    <div style={{ fontSize: 15, color: 'var(--ink-2)', fontWeight: 500, fontStyle: 'italic', marginTop: 4 }}>
                      {line.tr}
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div style={{ textAlign: 'center', padding: 40, color: 'var(--ink-3)', fontSize: 14 }}>
              Sozler henuz eklenmedi
            </div>
          )}
        </div>
      </div>
    </Layout>
  )
}
