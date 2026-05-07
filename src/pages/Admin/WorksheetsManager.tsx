import { useState, useEffect, useRef } from 'react'
import { Plus, Trash2, Eye, EyeOff, Save, Pencil, Upload, Loader, ImagePlus } from 'lucide-react'
import { supabase, Worksheet } from '../../lib/supabase'
import toast from 'react-hot-toast'

const coverOptions = ['rainbow','farm','farm2','family','numbers','school','weather','body','routine','abc','duck','bus','star','apple','fruit','hello','dance','days','happy','head','bingo','spider']

export default function WorksheetsManager() {
  const [worksheets, setWorksheets] = useState<Worksheet[]>([])
  const [editing, setEditing] = useState<Worksheet | null>(null)
  const [loading, setLoading] = useState(true)
  const [uploading, setUploading] = useState(false)
  const [generatingCover, setGeneratingCover] = useState(false)
  const [coverPreview, setCoverPreview] = useState('')
  const fileRef = useRef<HTMLInputElement>(null)

  const load = async () => {
    const { data } = await supabase.from('mm_worksheets').select('*').order('created_at', { ascending: false })
    if (data) setWorksheets(data)
    setLoading(false)
  }

  useEffect(() => { load() }, [])

  const generateThumbnail = async (wsId: string, title: string, category: string): Promise<void> => {
    try {
      const { data: { session } } = await supabase.auth.getSession()
      const token = session?.access_token || ''
      const res = await fetch('/api/generate-thumbnail', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify({ itemId: wsId, title, category, contentType: 'printable worksheet', storageBucket: 'worksheets' }),
      })
      if (res.ok) {
        const result = await res.json()
        if (result.coverKind && !result.thumbnailUrl) {
          await supabase.from('mm_worksheets').update({ cover_kind: result.coverKind }).eq('id', wsId)
        }
      }
    } catch { /* silent */ }
  }

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
        body: JSON.stringify({ itemId, title: editing.title, category: editing.category, contentType: 'printable worksheet', storageBucket: 'worksheets' }),
      })
      if (res.ok) {
        const result = await res.json()
        if (result.thumbnailUrl) { setCoverPreview(result.thumbnailUrl + '?t=' + Date.now()); toast.success(`Cover generated via ${result.source}`) }
        else if (result.coverKind) { setEditing({ ...editing, cover_kind: result.coverKind }); toast('AI unavailable — random cover selected') }
      } else toast.error('Generation failed')
    } catch { toast.error('Generation failed') }
    setGeneratingCover(false)
  }

  const save = async (publish: boolean) => {
    if (!editing) return
    if (!editing.title.trim()) { toast.error('Title is required'); return }
    if (publish && !editing.file_url?.trim()) { toast.error('Upload a file before publishing'); return }
    const { id, created_at: _, ...rest } = editing
    rest.published = publish
    try {
      let savedId = id
      if (id) {
        const { error } = await supabase.from('mm_worksheets').update(rest).eq('id', id)
        if (error) throw error
      } else {
        const { data: inserted, error } = await supabase.from('mm_worksheets').insert(rest).select('id').single()
        if (error) throw error
        savedId = inserted.id
      }
      if (publish) generateThumbnail(savedId, rest.title, rest.category)
      toast.success(publish ? 'Published' : 'Saved as draft')
      setEditing(null)
      load()
    } catch (e: unknown) { toast.error(e instanceof Error ? e.message : 'Save failed') }
  }

  const remove = async (id: string) => {
    if (!confirm('Are you sure you want to delete this?')) return
    try {
      const { error } = await supabase.from('mm_worksheets').delete().eq('id', id)
      if (error) throw error
      toast.success('Deleted')
      load()
    } catch (e: unknown) { toast.error(e instanceof Error ? e.message : 'Delete failed') }
  }

  const toggle = async (id: string, published: boolean) => {
    try {
      if (!published) {
        const ws = worksheets.find(w => w.id === id)
        if (!ws?.file_url?.trim()) { toast.error('Upload a file before publishing'); return }
      }
      const { error } = await supabase.from('mm_worksheets').update({ published: !published }).eq('id', id)
      if (error) throw error
      toast.success(published ? 'Unpublished' : 'Published')
      load()
    } catch (e: unknown) { toast.error(e instanceof Error ? e.message : 'Update failed') }
  }

  const uploadFile = async (file: File) => {
    if (!editing) return
    setUploading(true)
    const ext = file.name.split('.').pop()
    const path = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`
    const { error } = await supabase.storage.from('worksheets').upload(path, file)
    if (error) { toast.error('Upload failed: ' + error.message); setUploading(false); return }
    const { data: urlData } = supabase.storage.from('worksheets').getPublicUrl(path)
    setEditing({ ...editing, file_url: urlData.publicUrl })
    toast.success('File uploaded')
    setUploading(false)
  }

  const newWorksheet = (): Worksheet => ({
    id: '',
    title: '',
    cover_kind: 'rainbow',
    level: 'Easy',
    category: '',
    description: '',
    file_url: '',
    page_count: 1,
    published: false,
    created_at: '',
  })

  if (editing) {
    return (
      <div>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 24 }}>
          <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 28, margin: 0 }}>
            {editing.id ? 'Edit Worksheet' : 'New Worksheet'}
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
          <label style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--ink-2)' }}>Page Count</span>
            <input type="number" min={1} value={editing.page_count} onChange={e => setEditing({ ...editing, page_count: parseInt(e.target.value) || 1 })}
              style={{ padding: '12px 16px', borderRadius: 12, border: '1px solid var(--line)', fontSize: 15, fontFamily: 'var(--font-body)' }} />
          </label>
          <label style={{ display: 'flex', flexDirection: 'column', gap: 6, gridColumn: 'span 2' }}>
            <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--ink-2)' }}>Description</span>
            <textarea value={editing.description} onChange={e => setEditing({ ...editing, description: e.target.value })}
              rows={3} placeholder="Brief description of the worksheet"
              style={{ padding: '12px 16px', borderRadius: 12, border: '1px solid var(--line)', fontSize: 15, fontFamily: 'var(--font-body)', resize: 'vertical' }} />
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

        <div style={{ marginTop: 16, padding: 16, background: 'var(--surface-2)', borderRadius: 14 }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
            <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--ink-2)' }}>
              Worksheet File (PDF, DOC, DOCX) {uploading && <Loader size={12} style={{ display: 'inline', animation: 'spin 1s linear infinite' }} />}
            </span>
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
              <input ref={fileRef} type="file" accept=".pdf,.doc,.docx" style={{ display: 'none' }}
                onChange={e => { if (e.target.files?.[0]) uploadFile(e.target.files[0]) }} />
              <button className="mm-btn" onClick={() => fileRef.current?.click()} disabled={uploading}>
                <Upload size={14} /> Upload File
              </button>
              <input placeholder="Or paste a URL" value={editing.file_url}
                onChange={e => setEditing({ ...editing, file_url: e.target.value })}
                style={{ flex: 1, padding: '8px 12px', borderRadius: 10, border: '1px solid var(--line)', fontSize: 13, fontFamily: 'var(--font-body)' }} />
            </div>
          )}
        </div>
      </div>
    )
  }

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 24 }}>
        <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 28, margin: 0 }}>Worksheets</h1>
        <button className="mm-btn primary" onClick={() => setEditing(newWorksheet())}><Plus size={16} /> New Worksheet</button>
      </div>

      {loading ? (
        <p style={{ color: 'var(--ink-3)' }}>Loading...</p>
      ) : worksheets.length === 0 ? (
        <p style={{ color: 'var(--ink-3)' }}>No worksheets yet. Add a new one.</p>
      ) : (
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid var(--line)', textAlign: 'left' }}>
              <th style={{ padding: '10px 12px', fontFamily: 'var(--font-display)', fontSize: 14, color: 'var(--ink-3)' }}>Title</th>
              <th style={{ padding: '10px 12px', fontFamily: 'var(--font-display)', fontSize: 14, color: 'var(--ink-3)' }}>Pages</th>
              <th style={{ padding: '10px 12px', fontFamily: 'var(--font-display)', fontSize: 14, color: 'var(--ink-3)' }}>Status</th>
              <th style={{ padding: '10px 12px', fontFamily: 'var(--font-display)', fontSize: 14, color: 'var(--ink-3)' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {worksheets.map(w => (
              <tr key={w.id} style={{ borderBottom: '1px solid var(--line)' }}>
                <td style={{ padding: '12px' }}>{w.title}</td>
                <td style={{ padding: '12px', color: 'var(--ink-3)' }}>{w.page_count}</td>
                <td style={{ padding: '12px' }}>
                  <span className={`mm-tag ${w.published ? 'green' : ''}`}>{w.published ? 'Published' : 'Draft'}</span>
                </td>
                <td style={{ padding: '12px', display: 'flex', gap: 6 }}>
                  <button className="mm-icon-btn" onClick={() => setEditing(w)} title="Edit" style={{ width: 34, height: 34 }}>
                    <Pencil size={14} />
                  </button>
                  <button className="mm-icon-btn" onClick={() => toggle(w.id, w.published)} title={w.published ? 'Unpublish' : 'Publish'} style={{ width: 34, height: 34 }}>
                    {w.published ? <EyeOff size={14} /> : <Eye size={14} />}
                  </button>
                  <button className="mm-icon-btn" onClick={() => remove(w.id)} title="Delete" style={{ width: 34, height: 34, color: 'var(--primary)' }}>
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
