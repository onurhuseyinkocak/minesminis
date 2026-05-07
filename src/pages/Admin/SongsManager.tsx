import { useState, useEffect, useRef, useCallback } from 'react'
import { Plus, Trash2, Eye, EyeOff, Save, Pencil, Loader, Upload, Languages, Timer, RotateCcw, ImagePlus } from 'lucide-react'
import { supabase, Song, SongLyric } from '../../lib/supabase'
import { extractYouTubeId } from '../../lib/youtube'
import toast from 'react-hot-toast'

// YouTube IFrame API types
declare global {
  interface Window {
    YT: { Player: new (el: string | HTMLElement, config: Record<string, unknown>) => YTAdminPlayer; PlayerState: Record<string, number> }
    onYouTubeIframeAPIReady: () => void
  }
}
interface YTAdminPlayer {
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

const coverOptions = ['star','happy','head','farm2','bus','bingo','spider','dance','rainbow','duck','abc','apple','fruit','hello','days']

export default function SongsManager() {
  const [songs, setSongs] = useState<Song[]>([])
  const [editing, setEditing] = useState<Song | null>(null)
  const [loading, setLoading] = useState(true)
  const [fetching, setFetching] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [translating, setTranslating] = useState(false)
  const [generatingCover, setGeneratingCover] = useState(false)
  const [coverPreview, setCoverPreview] = useState('')
  const [timing, setTiming] = useState(false)
  const [timingLine, setTimingLine] = useState(0)
  const [ytCurrentTime, setYtCurrentTime] = useState(0)
  const audioRef = useRef<HTMLInputElement>(null)
  const ytPlayerRef = useRef<YTAdminPlayer | null>(null)
  const ytIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null)
  const ytContainerRef = useRef<HTMLDivElement>(null)

  const fetchYouTubeInfo = async (url: string) => {
    const videoId = extractYouTubeId(url)
    if (!videoId) return
    setFetching(true)
    try {
      const ctrl = new AbortController()
      const timer = setTimeout(() => ctrl.abort(), 5000)
      const res = await fetch(`https://noembed.com/embed?url=${encodeURIComponent(url)}`, { signal: ctrl.signal })
      clearTimeout(timer)
      const data = await res.json()
      if (data.title) {
        setEditing(prev => prev ? { ...prev, title: prev.title || data.title } : prev)
        toast.success('YouTube info fetched')
      }
    } catch {
      // silent fail
    }
    setFetching(false)
  }

  const handleYouTubeUrlChange = (url: string) => {
    if (!editing) return
    setEditing({ ...editing, youtube_url: url })
    if (extractYouTubeId(url) && !editing.title) {
      fetchYouTubeInfo(url)
    }
  }

  const load = async () => {
    const { data } = await supabase.from('mm_songs').select('*').order('created_at', { ascending: false })
    if (data) setSongs(data)
    setLoading(false)
  }

  useEffect(() => { load() }, [])

  const generateCoverNow = async () => {
    if (!editing?.title.trim()) { toast.error('Enter a title first'); return }
    setGeneratingCover(true); setCoverPreview('')
    try {
      const { data: { session } } = await supabase.auth.getSession()
      const token = session?.access_token || ''
      const itemId = editing.id || `preview-${Date.now()}`
      const res = await fetch('/api/generate-thumbnail', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify({ itemId, title: editing.title, category: editing.category, contentType: 'children song', storageBucket: 'slides' }),
      })
      if (res.ok) {
        const result = await res.json()
        if (result.thumbnailUrl) { setCoverPreview(result.thumbnailUrl + '?t=' + Date.now()); toast.success(`Cover generated via ${result.source}`) }
        else if (result.coverKind) { setEditing({ ...editing, cover_kind: result.coverKind }); toast('AI unavailable — random cover selected') }
      } else toast.error('Generation failed')
    } catch { toast.error('Generation failed') }
    setGeneratingCover(false)
  }

  const generateThumbnail = async (songId: string, title: string, category: string): Promise<void> => {
    try {
      const { data: { session } } = await supabase.auth.getSession()
      const token = session?.access_token || ''
      const res = await fetch('/api/generate-thumbnail', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify({ itemId: songId, title, category, contentType: 'children song', storageBucket: 'slides' }),
      })
      if (res.ok) {
        const result = await res.json()
        if (result.coverKind && !result.thumbnailUrl) {
          await supabase.from('mm_songs').update({ cover_kind: result.coverKind }).eq('id', songId)
        }
      }
    } catch { /* silent */ }
  }

  const save = async (publish: boolean) => {
    if (!editing) return
    if (!editing.title.trim()) { toast.error('Title is required'); return }
    if (publish && !editing.audio_url?.trim() && !editing.youtube_url?.trim()) { toast.error('Add an audio file or YouTube URL before publishing'); return }
    const { id, created_at: _, ...rest } = editing
    rest.published = publish
    try {
      let savedId = id
      if (id) {
        const { error } = await supabase.from('mm_songs').update(rest).eq('id', id)
        if (error) throw error
      } else {
        const { data: inserted, error } = await supabase.from('mm_songs').insert(rest).select('id').single()
        if (error) throw error
        savedId = inserted.id
      }
      if (publish) generateThumbnail(savedId, rest.title, rest.category)
      toast.success(publish ? 'Published' : 'Saved as draft')
      setEditing(null)
      load()
    } catch (e: unknown) { toast.error(e instanceof Error ? e.message :'Save failed') }
  }

  const remove = async (id: string) => {
    if (!confirm('Are you sure you want to delete this?')) return
    try {
      const { error } = await supabase.from('mm_songs').delete().eq('id', id)
      if (error) throw error
      toast.success('Deleted')
      load()
    } catch (e: unknown) { toast.error(e instanceof Error ? e.message :'Delete failed') }
  }

  const toggle = async (id: string, published: boolean) => {
    try {
      if (!published) {
        const song = songs.find(s => s.id === id)
        if (!song?.audio_url?.trim() && !song?.youtube_url?.trim()) { toast.error('Add an audio file or YouTube URL before publishing'); return }
      }
      const { error } = await supabase.from('mm_songs').update({ published: !published }).eq('id', id)
      if (error) throw error
      toast.success(published ? 'Unpublished' : 'Published')
      load()
    } catch (e: unknown) { toast.error(e instanceof Error ? e.message :'Update failed') }
  }

  const uploadAudio = async (file: File) => {
    if (!editing) return
    setUploading(true)
    const ext = file.name.split('.').pop()
    const path = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`
    const { error } = await supabase.storage.from('songs').upload(path, file)
    if (error) { toast.error('Upload failed: ' + error.message); setUploading(false); return }
    const { data: urlData } = supabase.storage.from('songs').getPublicUrl(path)
    setEditing({ ...editing, audio_url: urlData.publicUrl })
    toast.success('Audio uploaded')
    setUploading(false)
  }

  const newSong = (): Song => ({
    id: '',
    title: '',
    cover_kind: 'star',
    duration: '',
    category: '',
    audio_url: '',
    youtube_url: '',
    lyrics: [],
    published: false,
    created_at: '',
  })

  const addLyric = () => {
    if (!editing) return
    setEditing({ ...editing, lyrics: [...(editing.lyrics || []), { en: '', tr: '' }] })
  }

  const updateLyric = (idx: number, field: keyof SongLyric, value: string | boolean) => {
    if (!editing) return
    const items = [...(editing.lyrics || [])]
    items[idx] = { ...items[idx], [field]: value }
    setEditing({ ...editing, lyrics: items })
  }

  const removeLyric = (idx: number) => {
    if (!editing) return
    setEditing({ ...editing, lyrics: (editing.lyrics || []).filter((_, i) => i !== idx) })
  }

  // Start "Tap to Time" mode — load YouTube player
  const startTiming = useCallback(async () => {
    if (!editing?.youtube_url || !extractYouTubeId(editing.youtube_url)) {
      toast.error('YouTube URL required for timing')
      return
    }
    if ((editing.lyrics || []).length === 0) {
      toast.error('Add lyrics first')
      return
    }
    setTiming(true)
    setTimingLine(0)

    await loadYouTubeAPI()
    // Small delay for DOM to render the container
    setTimeout(() => {
      if (!document.getElementById('yt-timing-player')) return
      new window.YT.Player('yt-timing-player', {
        videoId: extractYouTubeId(editing.youtube_url) || '',
        playerVars: { autoplay: 0, controls: 1, modestbranding: 1, rel: 0 },
        events: {
          onReady: (e: { target: YTAdminPlayer }) => {
            ytPlayerRef.current = e.target
          },
          onStateChange: (e: { data: number }) => {
            if (e.data === 1) {
              // Playing — poll currentTime
              if (ytIntervalRef.current) clearInterval(ytIntervalRef.current)
              ytIntervalRef.current = setInterval(() => {
                if (ytPlayerRef.current) setYtCurrentTime(ytPlayerRef.current.getCurrentTime())
              }, 100)
            } else {
              if (ytIntervalRef.current) { clearInterval(ytIntervalRef.current); ytIntervalRef.current = null }
            }
          },
        },
      } as Record<string, unknown>)
    }, 100)
  }, [editing])

  const stopTiming = useCallback(() => {
    setTiming(false)
    if (ytIntervalRef.current) { clearInterval(ytIntervalRef.current); ytIntervalRef.current = null }
    if (ytPlayerRef.current) { try { ytPlayerRef.current.destroy() } catch { /* */ } }
    ytPlayerRef.current = null
  }, [])

  // Tap handler — stamp current YouTube time on the next lyric line
  const tapTimestamp = useCallback(() => {
    if (!editing || !ytPlayerRef.current) return
    const ct = ytPlayerRef.current.getCurrentTime()
    const lyrics = [...(editing.lyrics || [])]
    if (timingLine >= lyrics.length) {
      toast.success('All lines timed!')
      return
    }
    lyrics[timingLine] = { ...lyrics[timingLine], time: Math.round(ct * 10) / 10 }
    setEditing({ ...editing, lyrics })
    setTimingLine(timingLine + 1)
    if (timingLine + 1 >= lyrics.length) {
      toast.success('All lines timed!')
    }
  }, [editing, timingLine])

  const clearTimestamps = useCallback(() => {
    if (!editing) return
    const lyrics = (editing.lyrics || []).map(l => ({ ...l, time: undefined }))
    setEditing({ ...editing, lyrics })
    setTimingLine(0)
    toast.success('Timestamps cleared')
  }, [editing])

  // Auto-Sync: fetch YouTube auto-captions and match timing to lyrics
  const autoSync = useCallback(async () => {
    if (!editing?.youtube_url || !extractYouTubeId(editing.youtube_url)) {
      toast.error('YouTube URL required for auto-sync')
      return
    }
    const lyrics = editing.lyrics || []
    if (lyrics.length === 0) { toast.error('Add lyrics first'); return }

    const videoId = extractYouTubeId(editing.youtube_url)!
    toast('Fetching YouTube captions...')

    // 1. Try to fetch real YouTube captions via our API
    let captionEntries: Array<{ start: number; dur: number; text: string }> = []
    try {
      const res = await fetch(`/api/youtube-captions?v=${videoId}`)
      if (res.ok) {
        const data = await res.json()
        captionEntries = data.entries || []
      }
    } catch { /* silent */ }

    // 2. Get video duration via hidden YT player
    await loadYouTubeAPI()
    const tempDiv = document.createElement('div')
    tempDiv.id = 'yt-autosync-temp'
    tempDiv.style.cssText = 'position:absolute;left:-9999px;width:1px;height:1px'
    document.body.appendChild(tempDiv)

    const dur = await new Promise<number>((resolve) => {
      const timeout = setTimeout(() => { resolve(0) }, 10000)
      new window.YT.Player('yt-autosync-temp', {
        videoId,
        playerVars: { autoplay: 0 },
        events: {
          onReady: (e: { target: YTAdminPlayer }) => {
            clearTimeout(timeout)
            const d = e.target.getDuration()
            try { e.target.destroy() } catch { /* */ }
            resolve(d)
          },
        },
      } as Record<string, unknown>)
    })
    tempDiv.remove()

    if (dur <= 0) { toast.error('Could not get video duration'); return }

    const newLyrics = [...lyrics]

    if (captionEntries.length > 0) {
      // Smart sync: match each lyric line to caption entries by text similarity
      const normalize = (s: string) => s.toLowerCase().replace(/[^\w\s]/g, '').trim()

      // Build a full caption text timeline
      const capWords: Array<{ time: number; word: string }> = []
      for (const entry of captionEntries) {
        const words = entry.text.split(/\s+/)
        for (let i = 0; i < words.length; i++) {
          capWords.push({ time: entry.start + (i / words.length) * entry.dur, word: normalize(words[i]) })
        }
      }

      let searchFrom = 0
      for (let li = 0; li < lyrics.length; li++) {
        const lyricWords = normalize(lyrics[li].en || '').split(/\s+/).filter(Boolean)
        if (lyricWords.length === 0) continue

        // Find the best matching position in caption words
        const firstWord = lyricWords[0]
        let bestScore = 0
        let bestTime = -1

        for (let ci = searchFrom; ci < capWords.length; ci++) {
          if (capWords[ci].word !== firstWord) continue

          // Check how many consecutive lyric words match from this position
          let matched = 0
          for (let j = 0; j < lyricWords.length && ci + j < capWords.length; j++) {
            if (capWords[ci + j].word === lyricWords[j]) matched++
          }
          const score = matched / lyricWords.length
          if (score > bestScore) {
            bestScore = score
            bestTime = capWords[ci].time
          }
          if (score >= 0.8) break // Good enough match
        }

        if (bestTime >= 0 && bestScore >= 0.3) {
          newLyrics[li] = { ...newLyrics[li], time: Math.round(bestTime * 10) / 10 }
          // Advance search window to avoid matching same caption segment twice
          const matchIdx = capWords.findIndex((w, i) => i >= searchFrom && w.time >= bestTime)
          if (matchIdx >= 0) searchFrom = matchIdx + 1
        } else {
          // Fallback: interpolate from neighbors
          newLyrics[li] = { ...newLyrics[li], time: undefined }
        }
      }

      // Fill gaps by interpolation
      for (let i = 0; i < newLyrics.length; i++) {
        if (typeof newLyrics[i].time === 'number') continue
        const prev = i > 0 && typeof newLyrics[i - 1].time === 'number' ? newLyrics[i - 1].time! : 0
        let next = dur
        for (let j = i + 1; j < newLyrics.length; j++) {
          if (typeof newLyrics[j].time === 'number') { next = newLyrics[j].time!; break }
        }
        newLyrics[i] = { ...newLyrics[i], time: Math.round(((prev + next) / 2) * 10) / 10 }
      }

      toast.success(`Smart-synced ${lyrics.length} lines from YouTube captions`)
    } else {
      // Fallback: verse-aware proportional distribution
      toast('No captions found, using verse detection...')
      const lines = lyrics.map(l => (l.en || '').trim().toLowerCase())
      const intro = dur * 0.05
      const outro = dur * 0.08
      const singDur = dur - intro - outro

      const verseStarts: number[] = [0]
      if (lines.length > 5) {
        const firstLine = lines[0]
        const firstWords = firstLine.split(/\s+/)
        for (let i = 1; i < lines.length; i++) {
          const words = lines[i].split(/\s+/)
          const common = firstWords.filter(w => words.includes(w)).length
          if (lines[i] === firstLine || common / Math.max(firstWords.length, words.length) > 0.6) {
            verseStarts.push(i)
          }
        }
      }

      const verseCount = verseStarts.length
      const verseDur = singDur / verseCount

      for (let v = 0; v < verseCount; v++) {
        const vStart = verseStarts[v]
        const vEnd = v + 1 < verseCount ? verseStarts[v + 1] : lines.length
        const vTimeStart = intro + v * verseDur
        const wordCounts: number[] = []
        let totalWords = 0
        for (let i = vStart; i < vEnd; i++) {
          const wc = Math.max(1, (lines[i] || '').split(/\s+/).length)
          wordCounts.push(wc)
          totalWords += wc
        }
        let cumWords = 0
        for (let i = 0; i < vEnd - vStart; i++) {
          const lineTime = vTimeStart + (cumWords / totalWords) * verseDur
          newLyrics[vStart + i] = { ...newLyrics[vStart + i], time: Math.round(lineTime * 10) / 10 }
          cumWords += wordCounts[i]
        }
      }
      toast.success(`Auto-synced ${lyrics.length} lines (verse detection fallback)`)
    }

    const mins = Math.floor(dur / 60)
    const secs = Math.floor(dur % 60)
    const durStr = `${mins}:${secs.toString().padStart(2, '0')}`

    setEditing({ ...editing, lyrics: newLyrics, duration: durStr })
  }, [editing])

  const fmtTime = (s: number) => {
    const m = Math.floor(s / 60)
    const sec = Math.floor(s % 60)
    const ms = Math.floor((s % 1) * 10)
    return `${m}:${sec.toString().padStart(2, '0')}.${ms}`
  }

  if (editing) {
    return (
      <div>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 24 }}>
          <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 28, margin: 0 }}>
            {editing.id ? 'Edit Song' : 'New Song'}
          </h1>
          <div style={{ display: 'flex', gap: 8 }}>
            <button className="mm-btn" onClick={() => setEditing(null)}>Cancel</button>
            <button className="mm-btn" onClick={() => save(false)}><Save size={16} /> Save Draft</button>
            <button className="mm-btn primary" onClick={() => save(true)}><Save size={16} /> Publish</button>
          </div>
        </div>

        <div className="mm-admin-grid">
          <label style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--ink-2)' }}>Title</span>
            <input value={editing.title} onChange={e => setEditing({ ...editing, title: e.target.value })}
              style={{ padding: '12px 16px', borderRadius: 12, border: '1px solid var(--line)', fontSize: 15, fontFamily: 'var(--font-body)' }} />
          </label>
          <label style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--ink-2)' }}>Category</span>
            <input value={editing.category} onChange={e => setEditing({ ...editing, category: e.target.value })}
              style={{ padding: '12px 16px', borderRadius: 12, border: '1px solid var(--line)', fontSize: 15, fontFamily: 'var(--font-body)' }} />
          </label>
          <label style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--ink-2)' }}>Duration (e.g. 2:30)</span>
            <input value={editing.duration} onChange={e => setEditing({ ...editing, duration: e.target.value })}
              style={{ padding: '12px 16px', borderRadius: 12, border: '1px solid var(--line)', fontSize: 15, fontFamily: 'var(--font-body)' }} />
          </label>
          <label style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--ink-2)' }}>Cover</span>
            <select value={editing.cover_kind} onChange={e => setEditing({ ...editing, cover_kind: e.target.value })}
              style={{ padding: '12px 16px', borderRadius: 12, border: '1px solid var(--line)', fontSize: 15, fontFamily: 'var(--font-body)' }}>
              {coverOptions.map(c => <option key={c}>{c}</option>)}
            </select>
          </label>
          <div style={{ gridColumn: 'span 2', display: 'flex', flexDirection: 'column', gap: 6 }}>
            <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--ink-2)' }}>
              Audio File (MP3, WAV, OGG) {uploading && <Loader size={12} style={{ display: 'inline', animation: 'spin 1s linear infinite' }} />}
            </span>
            {editing.audio_url ? (
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <a href={editing.audio_url} target="_blank" rel="noreferrer" style={{ fontSize: 13, color: 'var(--accent)', wordBreak: 'break-all', flex: 1 }}>
                  {editing.audio_url.split('/').pop()}
                </a>
                <button className="mm-icon-btn" onClick={() => setEditing({ ...editing, audio_url: '' })} title="Remove" style={{ width: 28, height: 28, color: 'var(--primary)' }}>
                  <Trash2 size={12} />
                </button>
              </div>
            ) : (
              <div style={{ display: 'flex', gap: 8 }}>
                <input ref={audioRef} type="file" accept=".mp3,.wav,.ogg,.m4a" style={{ display: 'none' }}
                  onChange={e => { if (e.target.files?.[0]) uploadAudio(e.target.files[0]) }} />
                <button className="mm-btn" onClick={() => audioRef.current?.click()} disabled={uploading}>
                  <Upload size={14} /> Upload Audio
                </button>
                <input placeholder="Or paste audio URL" value={editing.audio_url}
                  onChange={e => setEditing({ ...editing, audio_url: e.target.value })}
                  style={{ flex: 1, padding: '8px 12px', borderRadius: 10, border: '1px solid var(--line)', fontSize: 13, fontFamily: 'var(--font-body)' }} />
              </div>
            )}
          </div>
          <label style={{ display: 'flex', flexDirection: 'column', gap: 6, gridColumn: 'span 2' }}>
            <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--ink-2)' }}>
              YouTube URL (optional) {fetching && <Loader size={12} style={{ display: 'inline', animation: 'spin 1s linear infinite' }} />}
            </span>
            <input value={editing.youtube_url || ''} onChange={e => handleYouTubeUrlChange(e.target.value)}
              onBlur={() => { if (editing.youtube_url && !editing.title && !fetching) fetchYouTubeInfo(editing.youtube_url) }}
              placeholder="Paste YouTube link — title auto-fills"
              style={{ padding: '12px 16px', borderRadius: 12, border: '1px solid var(--line)', fontSize: 15, fontFamily: 'var(--font-body)' }} />
          </label>
        </div>

        {/* AI Cover Generation */}
        <div style={{ marginTop: 16, padding: 16, background: 'var(--surface-2)', borderRadius: 14 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <button className="mm-btn" onClick={generateCoverNow} disabled={generatingCover} style={{ flexShrink: 0 }}>
              {generatingCover ? <><Loader size={14} style={{ animation: 'spin 1s linear infinite' }} /> Generating...</> : <><ImagePlus size={14} /> Generate AI Cover</>}
            </button>
            {coverPreview && <img src={coverPreview} alt="Generated cover" style={{ width: 80, height: 80, objectFit: 'cover', borderRadius: 12, border: '2px solid var(--green)' }} />}
            {!coverPreview && <span style={{ fontSize: 12, color: 'var(--ink-3)' }}>AI generates a cover from the title.</span>}
          </div>
        </div>

        {/* Tap to Time UI */}
        {timing ? (
          <div style={{ marginBottom: 20, padding: 20, background: 'var(--surface-2)', borderRadius: 18, border: '2px solid var(--primary)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
              <h3 style={{ fontFamily: 'var(--font-display)', fontSize: 18, margin: 0, color: 'var(--primary)' }}>
                Tap to Time — Line {timingLine + 1}/{(editing.lyrics || []).length}
              </h3>
              <div style={{ display: 'flex', gap: 8 }}>
                <button className="mm-btn" onClick={clearTimestamps}><RotateCcw size={14} /> Reset</button>
                <button className="mm-btn" onClick={stopTiming}>Done</button>
              </div>
            </div>

            <div style={{ borderRadius: 14, overflow: 'hidden', aspectRatio: '16/9', marginBottom: 14 }}>
              <div id="yt-timing-player" ref={ytContainerRef} style={{ width: '100%', height: '100%' }} />
            </div>

            <div style={{ fontSize: 13, color: 'var(--ink-3)', marginBottom: 10, textAlign: 'center' }}>
              Current: <strong>{fmtTime(ytCurrentTime)}</strong>
            </div>

            {/* Tap button */}
            <button
              className="mm-btn primary"
              onClick={tapTimestamp}
              disabled={timingLine >= (editing.lyrics || []).length}
              style={{ width: '100%', padding: '16px', fontSize: 18, fontWeight: 700, borderRadius: 14 }}
            >
              {timingLine < (editing.lyrics || []).length
                ? `TAP — "${(editing.lyrics || [])[timingLine]?.en?.slice(0, 40)}..."`
                : 'All lines timed!'
              }
            </button>

            <p style={{ fontSize: 12, color: 'var(--ink-3)', margin: '8px 0 0', textAlign: 'center' }}>
              Play the video, tap the button exactly when each lyric line starts singing
            </p>
          </div>
        ) : editing.youtube_url && extractYouTubeId(editing.youtube_url) ? (
          <div style={{ marginBottom: 16, borderRadius: 14, overflow: 'hidden', maxWidth: 320 }}>
            <img src={`https://img.youtube.com/vi/${extractYouTubeId(editing.youtube_url)}/mqdefault.jpg`}
              alt={`YouTube thumbnail for ${editing.title || 'song'}`}
              style={{ width: '100%', display: 'block', borderRadius: 14 }} />
          </div>
        ) : null}

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 }}>
          <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 20, margin: 0 }}>Lyrics ({editing.lyrics?.length || 0})</h2>
          <div style={{ display: 'flex', gap: 8 }}>
            <button className="mm-btn" onClick={async () => {
              const text = prompt('Paste English lyrics only (one line per row).\nTurkish translation will be auto-generated!\n\nExample:\nTwinkle twinkle little star\nHow I wonder what you are')
              if (!text) return
              const englishLines = text.split('\n').filter(l => l.trim()).map(l => l.trim())
              // Auto-translate via API
              setTranslating(true)
              toast('Translating lyrics to Turkish...')
              try {
                const { data: { session } } = await supabase.auth.getSession()
                const token = session?.access_token || ''
                const res = await fetch('/api/translate-lyrics', {
                  method: 'POST',
                  headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
                  body: JSON.stringify({ lines: englishLines }),
                })
                if (!res.ok) throw new Error('Translation failed')
                const { lyrics } = await res.json()
                const newLyrics: SongLyric[] = lyrics.map((l: SongLyric) => ({
                  en: l.en || '', tr: l.tr || '', highlight: !!l.highlight,
                }))
                setEditing(prev => prev ? { ...prev, lyrics: [...(prev.lyrics || []), ...newLyrics] } : prev)
                toast.success(`${newLyrics.length} lines added with translations!`)
              } catch {
                // Silent fallback: add lines without translation
                const fallback = englishLines.map(en => ({ en, tr: '', highlight: false }))
                setEditing(prev => prev ? { ...prev, lyrics: [...(prev.lyrics || []), ...fallback] } : prev)
              }
              setTranslating(false)
            }} disabled={translating}>
              {translating ? <Loader size={14} style={{ animation: 'spin 1s linear infinite' }} /> : <Languages size={14} />}
              {translating ? 'Translating...' : 'Paste Lyrics (Auto-Translate)'}
            </button>
            <button className="mm-btn" onClick={addLyric}><Plus size={16} /> Add Line</button>
            {editing.youtube_url && extractYouTubeId(editing.youtube_url) && (editing.lyrics || []).length > 0 && !timing && (
              <>
                <button className="mm-btn" onClick={autoSync}><Timer size={14} /> Auto-Sync</button>
                <button className="mm-btn primary" onClick={startTiming}><Timer size={14} /> Tap to Time</button>
              </>
            )}
          </div>
        </div>
        <p style={{ fontSize: 12, color: 'var(--ink-3)', margin: '0 0 12px' }}>Paste English lyrics — Turkish translation is generated automatically. Use "Tap to Time" to sync karaoke. Bold = chorus lines.</p>

        {(editing.lyrics || []).map((line, i) => (
          <div key={i} className="mm-admin-items-row" style={{
            display: 'grid', gridTemplateColumns: '60px 1fr 1fr 60px 40px', gap: 8, marginBottom: 8, alignItems: 'center',
            background: timing && i === timingLine ? 'var(--primary-light, #FFF0ED)' : undefined,
            borderRadius: 10, padding: timing && i === timingLine ? '4px 8px' : undefined,
          }}>
            <span style={{ fontSize: 12, color: typeof line.time === 'number' ? 'var(--primary)' : 'var(--ink-3)', fontWeight: 600, fontFamily: 'monospace' }}>
              {typeof line.time === 'number' ? fmtTime(line.time) : '—'}
            </span>
            <input placeholder="English" value={line.en} onChange={e => updateLyric(i, 'en', e.target.value)}
              style={{ padding: '10px 14px', borderRadius: 10, border: '1px solid var(--line)', fontSize: 14, fontFamily: 'var(--font-body)' }} />
            <input placeholder="Turkish" value={line.tr} onChange={e => updateLyric(i, 'tr', e.target.value)}
              style={{ padding: '10px 14px', borderRadius: 10, border: '1px solid var(--line)', fontSize: 14, fontFamily: 'var(--font-body)' }} />
            <label style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 12, cursor: 'pointer' }}>
              <input type="checkbox" checked={!!line.highlight} onChange={e => updateLyric(i, 'highlight', e.target.checked)} />
              Bold
            </label>
            <button onClick={() => removeLyric(i)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--primary)' }}>
              <Trash2 size={16} />
            </button>
          </div>
        ))}
      </div>
    )
  }

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 24 }}>
        <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 28, margin: 0 }}>Songs</h1>
        <button className="mm-btn primary" onClick={() => setEditing(newSong())}><Plus size={16} /> New Song</button>
      </div>

      {loading ? (
        <p style={{ color: 'var(--ink-3)' }}>Loading...</p>
      ) : songs.length === 0 ? (
        <p style={{ color: 'var(--ink-3)' }}>No songs yet. Add a new one.</p>
      ) : (
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid var(--line)', textAlign: 'left' }}>
              <th style={{ padding: '10px 12px', fontFamily: 'var(--font-display)', fontSize: 14, color: 'var(--ink-3)' }}>Title</th>
              <th style={{ padding: '10px 12px', fontFamily: 'var(--font-display)', fontSize: 14, color: 'var(--ink-3)' }}>Duration</th>
              <th style={{ padding: '10px 12px', fontFamily: 'var(--font-display)', fontSize: 14, color: 'var(--ink-3)' }}>Status</th>
              <th style={{ padding: '10px 12px', fontFamily: 'var(--font-display)', fontSize: 14, color: 'var(--ink-3)' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {songs.map(s => (
              <tr key={s.id} style={{ borderBottom: '1px solid var(--line)' }}>
                <td style={{ padding: '12px' }}>{s.title}</td>
                <td style={{ padding: '12px', color: 'var(--ink-3)' }}>{s.duration}</td>
                <td style={{ padding: '12px' }}>
                  <span className={`mm-tag ${s.published ? 'green' : ''}`}>{s.published ? 'Published' : 'Draft'}</span>
                </td>
                <td style={{ padding: '12px', display: 'flex', gap: 6 }}>
                  <button className="mm-icon-btn" onClick={() => setEditing(s)} title="Edit" style={{ width: 34, height: 34 }}>
                    <Pencil size={14} />
                  </button>
                  <button className="mm-icon-btn" onClick={() => toggle(s.id, s.published)} title={s.published ? 'Unpublish' : 'Publish'} style={{ width: 34, height: 34 }}>
                    {s.published ? <EyeOff size={14} /> : <Eye size={14} />}
                  </button>
                  <button className="mm-icon-btn" onClick={() => remove(s.id)} title="Delete" style={{ width: 34, height: 34, color: 'var(--primary)' }}>
                    <Trash2 size={14} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  )
}
