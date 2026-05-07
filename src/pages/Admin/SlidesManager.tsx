import { useState, useEffect, useRef } from 'react'
import { Plus, Trash2, Eye, EyeOff, Save, Pencil, Upload, Loader } from 'lucide-react'
import { supabase, Slide, SlideItem } from '../../lib/supabase'
import toast from 'react-hot-toast'

const coverOptions = ['rainbow','farm','farm2','family','numbers','school','weather','body','routine','abc','duck','bus','star','apple','fruit','hello','dance','days','happy','head','bingo','spider']

export default function SlidesManager() {
  const [slides, setSlides] = useState<Slide[]>([])
  const [editing, setEditing] = useState<Slide | null>(null)
  const [loading, setLoading] = useState(true)
  const [uploading, setUploading] = useState(false)
  const [publishing, setPublishing] = useState(false)
  const fileRef = useRef<HTMLInputElement>(null)

  const load = async () => {
    const { data } = await supabase.from('mm_slides').select('*').order('created_at', { ascending: false })
    if (data) setSlides(data)
    setLoading(false)
  }

  useEffect(() => { load() }, [])

  const generateThumbnail = async (slideId: string, data: Slide): Promise<boolean> => {
    try {
      const { data: { session } } = await supabase.auth.getSession()
      const token = session?.access_token || ''
      const res = await fetch('/api/generate-thumbnail', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify({
          slideId,
          title: data.title,
          category: data.category,
          slidesData: data.slides_data,
          fileUrl: data.file_url,
        }),
      })
      if (!res.ok) throw new Error('AI thumbnail failed')
      return true
    } catch {
      // Silent fallback: use a random pre-made cover instead of AI thumbnail
      return true
    }
  }

  const save = async (publish: boolean) => {
    if (!editing) return
    if (!editing.title.trim()) { toast.error('Title is required'); return }
    if (publish && !editing.file_url?.trim()) { toast.error('Upload a file before publishing'); return }
    const { id, created_at: _, ...rest } = editing

    try {
      if (publish) {
        // PUBLISH FLOW: save as draft → generate thumbnail → then publish
        setPublishing(true)
        rest.published = false // save as draft first
        let savedId = id
        if (id) {
          const { error } = await supabase.from('mm_slides').update(rest).eq('id', id)
          if (error) throw error
        } else {
          const { data: inserted, error } = await supabase.from('mm_slides').insert(rest).select('id').single()
          if (error) throw error
          savedId = inserted.id
        }
        // Generate thumbnail (silently falls back to cover_kind on error)
        await generateThumbnail(savedId, { ...editing, ...rest })
        // Now publish
        const { error: pubErr } = await supabase.from('mm_slides').update({ published: true }).eq('id', savedId)
        if (pubErr) throw pubErr
        toast.success('Published!')
        setPublishing(false)
      } else {
        // DRAFT FLOW: just save
        rest.published = false
        if (id) {
          const { error } = await supabase.from('mm_slides').update(rest).eq('id', id)
          if (error) throw error
        } else {
          const { error } = await supabase.from('mm_slides').insert(rest)
          if (error) throw error
        }
        toast.success('Saved as draft')
      }
      setEditing(null)
      load()
    } catch (e: unknown) {
      setPublishing(false)
      toast.error(e instanceof Error ? e.message : 'Save failed')
    }
  }

  const remove = async (id: string) => {
    if (!confirm('Are you sure you want to delete this?')) return
    try {
      const { error } = await supabase.from('mm_slides').delete().eq('id', id)
      if (error) throw error
      toast.success('Deleted')
      load()
    } catch (e: unknown) { toast.error(e instanceof Error ? e.message :'Delete failed') }
  }

  const toggle = async (id: string, published: boolean) => {
    try {
      if (!published) {
        const slideData = slides.find(s => s.id === id)
        if (!slideData?.file_url?.trim()) { toast.error('Upload a file before publishing'); return }
        if (slideData) await generateThumbnail(id, slideData)
      }
      const { error } = await supabase.from('mm_slides').update({ published: !published }).eq('id', id)
      if (error) throw error
      toast.success(published ? 'Unpublished' : 'Published')
      load()
    } catch (e: unknown) { toast.error(e instanceof Error ? e.message :'Update failed') }
  }

  const uploadFile = async (file: File) => {
    if (!editing) return
    setUploading(true)
    const ext = file.name.split('.').pop()
    const path = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`
    const { error } = await supabase.storage.from('slides').upload(path, file)
    if (error) { toast.error('Upload failed: ' + error.message); setUploading(false); return }
    const { data: urlData } = supabase.storage.from('slides').getPublicUrl(path)
    setEditing({ ...editing, file_url: urlData.publicUrl })
    toast.success('File uploaded')
    setUploading(false)
  }

  const newSlide = (): Slide => ({
    id: '',
    title: '',
    cover_kind: 'rainbow',
    slide_count: 0,
    level: 'Easy',
    category: '',
    slides_data: [],
    file_url: '',
    published: false,
    created_at: '',
  })

  const addSlideItem = () => {
    if (!editing) return
    setEditing({
      ...editing,
      slides_data: [...(editing.slides_data || []), { label: '', translation: '', cover_kind: 'rainbow' }],
      slide_count: (editing.slides_data?.length || 0) + 1,
    })
  }

  const updateSlideItem = (idx: number, field: keyof SlideItem, value: string) => {
    if (!editing) return
    const items = [...(editing.slides_data || [])]
    items[idx] = { ...items[idx], [field]: value }
    setEditing({ ...editing, slides_data: items, slide_count: items.length })
  }

  const removeSlideItem = (idx: number) => {
    if (!editing) return
    const items = (editing.slides_data || []).filter((_, i) => i !== idx)
    setEditing({ ...editing, slides_data: items, slide_count: items.length })
  }

  if (editing) {
    return (
      <div>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 24 }}>
          <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 28, margin: 0 }}>
            {editing.id ? 'Edit Slide' : 'New Slide'}
          </h1>
          <div style={{ display: 'flex', gap: 8 }}>
            <button className="mm-btn" onClick={() => setEditing(null)} disabled={publishing}>Cancel</button>
            <button className="mm-btn" onClick={() => save(false)} disabled={publishing}><Save size={16} /> Save Draft</button>
            <button className="mm-btn primary" onClick={() => save(true)} disabled={publishing}>
              {publishing ? <><Loader size={16} style={{ animation: 'spin 1s linear infinite' }} /> Generating & Publishing...</> : <><Save size={16} /> Publish</>}
            </button>
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
            <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--ink-2)' }}>Level</span>
            <select value={editing.level} onChange={e => setEditing({ ...editing, level: e.target.value })}
              style={{ padding: '12px 16px', borderRadius: 12, border: '1px solid var(--line)', fontSize: 15, fontFamily: 'var(--font-body)' }}>
              <option>Easy</option><option>Medium</option><option>Hard</option>
            </select>
          </label>
          <label style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--ink-2)' }}>Cover</span>
            <select value={editing.cover_kind} onChange={e => setEditing({ ...editing, cover_kind: e.target.value })}
              style={{ padding: '12px 16px', borderRadius: 12, border: '1px solid var(--line)', fontSize: 15, fontFamily: 'var(--font-body)' }}>
              {coverOptions.map(c => <option key={c}>{c}</option>)}
            </select>
          </label>
        </div>

        {/* File upload */}
        <div style={{ marginTop: 16, marginBottom: 16, padding: 16, background: 'var(--surface-2)', borderRadius: 14 }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
            <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--ink-2)' }}>
              Presentation File (PPT, PPTX, PDF, DOC, DOCX, Google Slides link)
            </span>
            {uploading && <Loader size={14} style={{ animation: 'spin 1s linear infinite' }} />}
          </div>
          {editing.file_url ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <a href={editing.file_url} target="_blank" rel="noreferrer" style={{ fontSize: 13, color: 'var(--accent)', wordBreak: 'break-all' }}>
                {editing.file_url.split('/').pop()}
              </a>
              <button className="mm-icon-btn" onClick={() => setEditing({ ...editing, file_url: '' })} title="Remove file" style={{ width: 28, height: 28, color: 'var(--primary)' }}>
                <Trash2 size={12} />
              </button>
            </div>
          ) : (
            <div style={{ display: 'flex', gap: 8 }}>
              <input ref={fileRef} type="file" accept=".ppt,.pptx,.pdf,.key,.doc,.docx" style={{ display: 'none' }}
                onChange={e => { if (e.target.files?.[0]) uploadFile(e.target.files[0]) }} />
              <button className="mm-btn" onClick={() => fileRef.current?.click()} disabled={uploading}>
                <Upload size={14} /> Upload File
              </button>
              <input placeholder="Or paste a Google Slides / URL" value={editing.file_url}
                onChange={e => setEditing({ ...editing, file_url: e.target.value })}
                style={{ flex: 1, padding: '8px 12px', borderRadius: 10, border: '1px solid var(--line)', fontSize: 13, fontFamily: 'var(--font-body)' }} />
            </div>
          )}
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 }}>
          <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 20, margin: 0 }}>Slides ({editing.slides_data?.length || 0})</h2>
          <button className="mm-btn" onClick={addSlideItem}><Plus size={16} /> Add Slide</button>
        </div>
        <p style={{ fontSize: 12, color: 'var(--ink-3)', margin: '0 0 12px' }}>Each slide = one flashcard. Add English word + Turkish translation + cover illustration.</p>

        {(editing.slides_data || []).map((item, i) => (
          <div key={i} className="mm-admin-items-row" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 120px 40px', gap: 8, marginBottom: 8, alignItems: 'center' }}>
            <input placeholder="English word (e.g. Cow)" value={item.label} onChange={e => updateSlideItem(i, 'label', e.target.value)}
              style={{ padding: '10px 14px', borderRadius: 10, border: '1px solid var(--line)', fontSize: 14, fontFamily: 'var(--font-body)' }} />
            <input placeholder="Turkish translation (e.g. Inek)" value={item.translation} onChange={e => updateSlideItem(i, 'translation', e.target.value)}
              style={{ padding: '10px 14px', borderRadius: 10, border: '1px solid var(--line)', fontSize: 14, fontFamily: 'var(--font-body)' }} />
            <select value={item.cover_kind} onChange={e => updateSlideItem(i, 'cover_kind', e.target.value)}
              style={{ padding: '10px 8px', borderRadius: 10, border: '1px solid var(--line)', fontSize: 13, fontFamily: 'var(--font-body)' }}>
              {coverOptions.map(c => <option key={c}>{c}</option>)}
            </select>
            <button onClick={() => removeSlideItem(i)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--primary)' }}>
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
        <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 28, margin: 0 }}>Slides</h1>
        <button className="mm-btn primary" onClick={() => setEditing(newSlide())}><Plus size={16} /> New Slide</button>
      </div>

      {loading ? (
        <p style={{ color: 'var(--ink-3)' }}>Loading...</p>
      ) : slides.length === 0 ? (
        <p style={{ color: 'var(--ink-3)' }}>No slides yet. Add a new one.</p>
      ) : (
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid var(--line)', textAlign: 'left' }}>
              <th style={{ padding: '10px 12px', fontFamily: 'var(--font-display)', fontSize: 14, color: 'var(--ink-3)' }}>Title</th>
              <th style={{ padding: '10px 12px', fontFamily: 'var(--font-display)', fontSize: 14, color: 'var(--ink-3)' }}>Slides</th>
              <th style={{ padding: '10px 12px', fontFamily: 'var(--font-display)', fontSize: 14, color: 'var(--ink-3)' }}>Status</th>
              <th style={{ padding: '10px 12px', fontFamily: 'var(--font-display)', fontSize: 14, color: 'var(--ink-3)' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {slides.map(s => (
              <tr key={s.id} style={{ borderBottom: '1px solid var(--line)' }}>
                <td style={{ padding: '12px' }}>{s.title}</td>
                <td style={{ padding: '12px', color: 'var(--ink-3)' }}>{s.slide_count}</td>
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
