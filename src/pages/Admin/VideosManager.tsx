import { useState, useEffect } from 'react'
import { Plus, Trash2, Eye, EyeOff, Save, Pencil } from 'lucide-react'
import { supabase, Video } from '../../lib/supabase'
import toast from 'react-hot-toast'

const coverOptions = ['abc','duck','bus','farm2','hello','dance','days','fruit','rainbow','star','happy','head','bingo','spider','apple']

export default function VideosManager() {
  const [videos, setVideos] = useState<Video[]>([])
  const [editing, setEditing] = useState<Video | null>(null)
  const [loading, setLoading] = useState(true)

  const load = async () => {
    const { data } = await supabase.from('mm_videos').select('*').order('created_at', { ascending: false })
    if (data) setVideos(data)
    setLoading(false)
  }

  useEffect(() => { load() }, [])

  const save = async () => {
    if (!editing) return
    if (!editing.title.trim()) { toast.error('Title is required'); return }
    const { id, created_at: _, ...rest } = editing
    try {
      if (id) {
        const { error } = await supabase.from('mm_videos').update(rest).eq('id', id)
        if (error) throw error
      } else {
        const { error } = await supabase.from('mm_videos').insert(rest)
        if (error) throw error
      }
      toast.success('Saved')
      setEditing(null)
      load()
    } catch (e: any) { toast.error(e.message || 'Save failed') }
  }

  const remove = async (id: string) => {
    if (!confirm('Are you sure you want to delete this?')) return
    try {
      const { error } = await supabase.from('mm_videos').delete().eq('id', id)
      if (error) throw error
      toast.success('Deleted')
      load()
    } catch (e: any) { toast.error(e.message || 'Delete failed') }
  }

  const toggle = async (id: string, published: boolean) => {
    try {
      const { error } = await supabase.from('mm_videos').update({ published: !published }).eq('id', id)
      if (error) throw error
      toast.success(published ? 'Unpublished' : 'Published')
      load()
    } catch (e: any) { toast.error(e.message || 'Update failed') }
  }

  const newVideo = (): Video => ({
    id: '',
    title: '',
    cover_kind: 'abc',
    duration: '',
    category: '',
    youtube_url: '',
    lyrics_en: '',
    lyrics_tr: '',
    published: false,
    created_at: '',
  })

  if (editing) {
    return (
      <div>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 24 }}>
          <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 28, margin: 0 }}>
            {editing.id ? 'Edit Video' : 'New Video'}
          </h1>
          <div style={{ display: 'flex', gap: 8 }}>
            <button className="mm-btn" onClick={() => setEditing(null)}>Cancel</button>
            <button className="mm-btn primary" onClick={save}><Save size={16} /> Save</button>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 24 }}>
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
          <label style={{ display: 'flex', flexDirection: 'column', gap: 6, gridColumn: 'span 2' }}>
            <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--ink-2)' }}>YouTube URL</span>
            <input value={editing.youtube_url} onChange={e => setEditing({ ...editing, youtube_url: e.target.value })}
              placeholder="https://youtube.com/watch?v=..."
              style={{ padding: '12px 16px', borderRadius: 12, border: '1px solid var(--line)', fontSize: 15, fontFamily: 'var(--font-body)' }} />
          </label>
          <label style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--ink-2)' }}>English Lyrics</span>
            <textarea value={editing.lyrics_en} onChange={e => setEditing({ ...editing, lyrics_en: e.target.value })}
              rows={6} style={{ padding: '12px 16px', borderRadius: 12, border: '1px solid var(--line)', fontSize: 14, fontFamily: 'var(--font-body)', resize: 'vertical' }} />
          </label>
          <label style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--ink-2)' }}>Turkish Lyrics</span>
            <textarea value={editing.lyrics_tr} onChange={e => setEditing({ ...editing, lyrics_tr: e.target.value })}
              rows={6} style={{ padding: '12px 16px', borderRadius: 12, border: '1px solid var(--line)', fontSize: 14, fontFamily: 'var(--font-body)', resize: 'vertical' }} />
          </label>
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
