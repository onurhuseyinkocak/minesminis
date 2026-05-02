import { useState, useEffect, useRef } from 'react'
import { Plus, Trash2, Eye, EyeOff, Save, Pencil, Loader, Upload, Languages } from 'lucide-react'
import { supabase, Song, SongLyric } from '../../lib/supabase'
import { extractYouTubeId } from '../../lib/youtube'
import toast from 'react-hot-toast'

const coverOptions = ['star','happy','head','farm2','bus','bingo','spider','dance','rainbow','duck','abc','apple','fruit','hello','days']

export default function SongsManager() {
  const [songs, setSongs] = useState<Song[]>([])
  const [editing, setEditing] = useState<Song | null>(null)
  const [loading, setLoading] = useState(true)
  const [fetching, setFetching] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [translating, setTranslating] = useState(false)
  const audioRef = useRef<HTMLInputElement>(null)

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

  const save = async (publish: boolean) => {
    if (!editing) return
    if (!editing.title.trim()) { toast.error('Title is required'); return }
    const { id, created_at: _, ...rest } = editing
    rest.published = publish
    try {
      if (id) {
        const { error } = await supabase.from('mm_songs').update(rest).eq('id', id)
        if (error) throw error
      } else {
        const { error } = await supabase.from('mm_songs').insert(rest)
        if (error) throw error
      }
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

        {editing.youtube_url && extractYouTubeId(editing.youtube_url) && (
          <div style={{ marginBottom: 16, borderRadius: 14, overflow: 'hidden', maxWidth: 320 }}>
            <img src={`https://img.youtube.com/vi/${extractYouTubeId(editing.youtube_url)}/mqdefault.jpg`}
              alt={`YouTube thumbnail for ${editing.title || 'song'}`}
              style={{ width: '100%', display: 'block', borderRadius: 14 }} />
          </div>
        )}

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
                // Fallback: add without translation
                const fallback = englishLines.map(en => ({ en, tr: '', highlight: false }))
                setEditing(prev => prev ? { ...prev, lyrics: [...(prev.lyrics || []), ...fallback] } : prev)
                toast.error('Auto-translate failed — lines added without translation')
              }
              setTranslating(false)
            }} disabled={translating}>
              {translating ? <Loader size={14} style={{ animation: 'spin 1s linear infinite' }} /> : <Languages size={14} />}
              {translating ? 'Translating...' : 'Paste Lyrics (Auto-Translate)'}
            </button>
            <button className="mm-btn" onClick={addLyric}><Plus size={16} /> Add Line</button>
          </div>
        </div>
        <p style={{ fontSize: 12, color: 'var(--ink-3)', margin: '0 0 12px' }}>Paste English lyrics — Turkish translation is generated automatically. Lyrics scroll as the song plays. Bold = chorus lines.</p>

        {(editing.lyrics || []).map((line, i) => (
          <div key={i} className="mm-admin-items-row" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 60px 40px', gap: 8, marginBottom: 8, alignItems: 'center' }}>
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
