import { useState, useEffect } from 'react'
import { Plus, Trash2, Eye, EyeOff, Save, Pencil, Loader, ImagePlus } from 'lucide-react'
import { supabase, Video } from '../../lib/supabase'
import { extractYouTubeId } from '../../lib/youtube'
import { useCoverProgress, CoverProgressBar } from '../../components/CoverProgress'
import toast from 'react-hot-toast'

const coverOptions = ['abc','duck','bus','farm2','hello','dance','days','fruit','rainbow','star','happy','head','bingo','spider','apple']

export default function VideosManager() {
  const [videos, setVideos] = useState<Video[]>([])
  const [editing, setEditing] = useState<Video | null>(null)
  const [loading, setLoading] = useState(true)
  const [fetching, setFetching] = useState(false)
  const [coverPreview, setCoverPreview] = useState('')
  const coverProgress = useCoverProgress()

  const load = async () => {
    const { data } = await supabase.from('mm_videos').select('*').order('created_at', { ascending: false })
    if (data) setVideos(data)
    setLoading(false)
  }

  useEffect(() => { load() }, [])

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
        setEditing(prev => prev ? {
          ...prev,
          title: prev.title || data.title,
          thumbnail_url: prev.thumbnail_url || `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`,
        } : prev)
        toast.success('YouTube info fetched')
      }
    } catch {
      // silent fail — user can fill manually
    }
    setFetching(false)
  }

  const handleYouTubeUrlChange = (url: string) => {
    if (!editing) return
    const vid = extractYouTubeId(url)
    const thumbnail = vid ? `https://img.youtube.com/vi/${vid}/hqdefault.jpg` : ''
    setEditing({ ...editing, youtube_url: url, thumbnail_url: thumbnail })
    if (vid && !editing.title) {
      fetchYouTubeInfo(url)
    }
  }

  const generateCoverNow = async () => {
    if (!editing?.title.trim()) { toast.error('Enter a title first'); return }
    setCoverPreview(''); coverProgress.reset(); coverProgress.setStage('auth')
    try {
      const { data: { session } } = await supabase.auth.getSession()
      const token = session?.access_token || ''
      const itemId = editing.id || `preview-${Date.now()}`
      coverProgress.setStage('generating')
      const res = await fetch('/api/generate-thumbnail', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify({ itemId, title: editing.title, category: editing.category, contentType: 'video', storageBucket: 'slides' }),
      })
      coverProgress.setStage('uploading')
      if (res.ok) {
        const result = await res.json()
        if (result.thumbnailUrl) { setCoverPreview(result.thumbnailUrl + '?t=' + Date.now()); coverProgress.setStage('done'); toast.success(`Cover generated via ${result.source}`) }
        else if (result.coverKind) { setEditing({ ...editing, cover_kind: result.coverKind }); coverProgress.setStage('done'); toast('AI unavailable — random cover selected') }
      } else { coverProgress.setStage('error'); toast.error('Generation failed') }
    } catch { coverProgress.setStage('error'); toast.error('Generation failed') }
  }

  const generateThumbnail = async (videoId: string, title: string, category: string): Promise<void> => {
    try {
      const { data: { session } } = await supabase.auth.getSession()
      const token = session?.access_token || ''
      const res = await fetch('/api/generate-thumbnail', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify({ itemId: videoId, title, category, contentType: 'video', storageBucket: 'slides' }),
      })
      if (res.ok) {
        const result = await res.json()
        if (result.coverKind && !result.thumbnailUrl) {
          await supabase.from('mm_videos').update({ cover_kind: result.coverKind }).eq('id', videoId)
        }
      }
    } catch { /* silent */ }
  }

  const save = async (publish: boolean) => {
    if (!editing) return
    if (!editing.title.trim()) { toast.error('Title is required'); return }
    if (publish && !editing.youtube_url?.trim()) { toast.error('Add a YouTube URL before publishing'); return }
    const { id, created_at: _, ...rest } = editing
    rest.published = publish
    try {
      let savedId = id
      if (id) {
        const { error } = await supabase.from('mm_videos').update(rest).eq('id', id)
        if (error) throw error
      } else {
        const { data: inserted, error } = await supabase.from('mm_videos').insert(rest).select('id').single()
        if (error) throw error
        savedId = inserted.id
      }
      // Cover generation is manual via "Generate AI Cover" button
      toast.success(publish ? 'Published' : 'Saved as draft')
      setEditing(null)
      load()
    } catch (e: unknown) { toast.error(e instanceof Error ? e.message :'Save failed') }
  }

  const remove = async (id: string) => {
    if (!confirm('Are you sure you want to delete this?')) return
    try {
      const { error } = await supabase.from('mm_videos').delete().eq('id', id)
      if (error) throw error
      toast.success('Deleted')
      load()
    } catch (e: unknown) { toast.error(e instanceof Error ? e.message :'Delete failed') }
  }

  const toggle = async (id: string, published: boolean) => {
    try {
      if (!published) {
        const video = videos.find(v => v.id === id)
        if (!video?.youtube_url?.trim()) { toast.error('Add a YouTube URL before publishing'); return }
      }
      const { error } = await supabase.from('mm_videos').update({ published: !published }).eq('id', id)
      if (error) throw error
      toast.success(published ? 'Unpublished' : 'Published')
      load()
    } catch (e: unknown) { toast.error(e instanceof Error ? e.message :'Update failed') }
  }

  const newVideo = (): Video => ({
    id: '',
    title: '',
    cover_kind: 'abc',
    duration: '',
    category: '',
    youtube_url: '',
    thumbnail_url: '',
    lyrics_en: '',
    lyrics_tr: '',
    published: false,
    created_at: '',
  })

  const videoId = editing ? extractYouTubeId(editing.youtube_url) : ''

  if (editing) {
    return (
      <div>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 24 }}>
          <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 28, margin: 0 }}>
            {editing.id ? 'Edit Video' : 'New Video'}
          </h1>
          <div style={{ display: 'flex', gap: 8 }}>
            <button className="mm-btn" onClick={() => setEditing(null)}>Cancel</button>
            <button className="mm-btn" onClick={() => save(false)}><Save size={16} /> Save Draft</button>
            <button className="mm-btn primary" onClick={() => save(true)}><Save size={16} /> Publish</button>
          </div>
        </div>

        {/* YouTube URL — first field, auto-fetches info */}
        <label style={{ display: 'flex', flexDirection: 'column', gap: 6, marginBottom: 16 }}>
          <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--ink-2)' }}>
            YouTube URL {fetching && <Loader size={12} style={{ display: 'inline', animation: 'spin 1s linear infinite' }} />}
          </span>
          <input value={editing.youtube_url}
            onChange={e => handleYouTubeUrlChange(e.target.value)}
            onBlur={() => { if (editing.youtube_url && !editing.title && !fetching) fetchYouTubeInfo(editing.youtube_url) }}
            placeholder="Paste YouTube link — title auto-fills"
            style={{ padding: '12px 16px', borderRadius: 12, border: '1px solid var(--line)', fontSize: 15, fontFamily: 'var(--font-body)' }} />
        </label>

        {/* YouTube thumbnail preview */}
        {videoId && (
          <div style={{ marginBottom: 16, borderRadius: 14, overflow: 'hidden', maxWidth: 320 }}>
            <img src={`https://img.youtube.com/vi/${videoId}/mqdefault.jpg`} alt={`YouTube thumbnail for ${editing.title || 'video'}`}
              style={{ width: '100%', display: 'block', borderRadius: 14 }} />
          </div>
        )}

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
            <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--ink-2)' }}>Duration (e.g. 3:20)</span>
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
        </div>

        {/* AI Cover Generation */}
        <div style={{ marginTop: 16, padding: 16, background: 'var(--surface-2)', borderRadius: 14 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <button className="mm-btn" onClick={generateCoverNow} disabled={coverProgress.stage !== 'idle' && coverProgress.stage !== 'done' && coverProgress.stage !== 'error'} style={{ flexShrink: 0 }}>
              {coverProgress.stage !== 'idle' && coverProgress.stage !== 'done' && coverProgress.stage !== 'error' ? <><Loader size={14} style={{ animation: 'spin 1s linear infinite' }} /> Generating...</> : <><ImagePlus size={14} /> Generate AI Cover</>}
            </button>
            {coverPreview && <img src={coverPreview} alt="Generated cover" style={{ width: 80, height: 80, objectFit: 'cover', borderRadius: 12, border: '2px solid var(--green)' }} />}
            {!coverPreview && coverProgress.stage === 'idle' && <span style={{ fontSize: 12, color: 'var(--ink-3)' }}>AI generates a cover from the title.</span>}
          </div>
          <CoverProgressBar progress={coverProgress.progress} label={coverProgress.stage !== 'idle' ? { auth: 'Authenticating...', generating: 'AI generating image...', uploading: 'Uploading cover...', done: 'Done!', error: 'Failed' }[coverProgress.stage] || '' : ''} />
        </div>
      </div>
    )
  }

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 24 }}>
        <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 28, margin: 0 }}>Videos</h1>
        <button className="mm-btn primary" onClick={() => setEditing(newVideo())}><Plus size={16} /> New Video</button>
      </div>

      {loading ? (
        <p style={{ color: 'var(--ink-3)' }}>Loading...</p>
      ) : videos.length === 0 ? (
        <p style={{ color: 'var(--ink-3)' }}>No videos yet. Add a new one.</p>
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
            {videos.map(v => (
              <tr key={v.id} style={{ borderBottom: '1px solid var(--line)' }}>
                <td style={{ padding: '12px' }}>{v.title}</td>
                <td style={{ padding: '12px', color: 'var(--ink-3)' }}>{v.duration}</td>
                <td style={{ padding: '12px' }}>
                  <span className={`mm-tag ${v.published ? 'green' : ''}`}>{v.published ? 'Published' : 'Draft'}</span>
                </td>
                <td style={{ padding: '12px', display: 'flex', gap: 6 }}>
                  <button className="mm-icon-btn" onClick={() => setEditing(v)} title="Edit" style={{ width: 34, height: 34 }}>
                    <Pencil size={14} />
                  </button>
                  <button className="mm-icon-btn" onClick={() => toggle(v.id, v.published)} title={v.published ? 'Unpublish' : 'Publish'} style={{ width: 34, height: 34 }}>
                    {v.published ? <EyeOff size={14} /> : <Eye size={14} />}
                  </button>
                  <button className="mm-icon-btn" onClick={() => remove(v.id)} title="Delete" style={{ width: 34, height: 34, color: 'var(--primary)' }}>
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
