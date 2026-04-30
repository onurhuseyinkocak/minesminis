import { useState, useEffect } from 'react'
import { Plus, Trash2, Eye, EyeOff, Save, Pencil } from 'lucide-react'
import { supabase, Slide, SlideItem } from '../../lib/supabase'
import toast from 'react-hot-toast'

const coverOptions = ['rainbow','farm','farm2','family','numbers','school','weather','body','routine','abc','duck','bus','star','apple','fruit','hello','dance','days','happy','head','bingo','spider']

export default function SlidesManager() {
  const [slides, setSlides] = useState<Slide[]>([])
  const [editing, setEditing] = useState<Slide | null>(null)
  const [loading, setLoading] = useState(true)

  const load = async () => {
    const { data } = await supabase.from('mm_slides').select('*').order('created_at', { ascending: false })
    if (data) setSlides(data)
    setLoading(false)
  }

  useEffect(() => { load() }, [])

  const save = async () => {
    if (!editing) return
    if (!editing.title.trim()) { toast.error('Baslik zorunlu'); return }
    const { id, created_at: _, ...rest } = editing
    try {
      if (id) {
        const { error } = await supabase.from('mm_slides').update(rest).eq('id', id)
        if (error) throw error
      } else {
        const { error } = await supabase.from('mm_slides').insert(rest)
        if (error) throw error
      }
      toast.success('Kaydedildi')
      setEditing(null)
      load()
    } catch (e: any) { toast.error(e.message || 'Kayit hatasi') }
  }

  const remove = async (id: string) => {
    if (!confirm('Silmek istediginizden emin misiniz?')) return
    try {
      const { error } = await supabase.from('mm_slides').delete().eq('id', id)
      if (error) throw error
      toast.success('Silindi')
      load()
    } catch (e: any) { toast.error(e.message || 'Silme hatasi') }
  }

  const toggle = async (id: string, published: boolean) => {
    try {
      const { error } = await supabase.from('mm_slides').update({ published: !published }).eq('id', id)
      if (error) throw error
      toast.success(published ? 'Yayindan kaldirildi' : 'Yayinlandi')
      load()
    } catch (e: any) { toast.error(e.message || 'Guncelleme hatasi') }
  }

  const newSlide = (): Slide => ({
    id: '',
    title: '',
    cover_kind: 'rainbow',
    slide_count: 0,
    level: 'Easy',
    category: '',
    slides_data: [],
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
            {editing.id ? 'Slayt Duzenle' : 'Yeni Slayt'}
          </h1>
          <div style={{ display: 'flex', gap: 8 }}>
            <button className="mm-btn" onClick={() => setEditing(null)}>Iptal</button>
            <button className="mm-btn primary" onClick={save}><Save size={16} /> Kaydet</button>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 24 }}>
          <label style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--ink-2)' }}>Baslik</span>
            <input value={editing.title} onChange={e => setEditing({ ...editing, title: e.target.value })}
              style={{ padding: '12px 16px', borderRadius: 12, border: '1px solid var(--line)', fontSize: 15, fontFamily: 'var(--font-body)' }} />
          </label>
          <label style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--ink-2)' }}>Kategori</span>
            <input value={editing.category} onChange={e => setEditing({ ...editing, category: e.target.value })}
              style={{ padding: '12px 16px', borderRadius: 12, border: '1px solid var(--line)', fontSize: 15, fontFamily: 'var(--font-body)' }} />
          </label>
          <label style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--ink-2)' }}>Seviye</span>
            <select value={editing.level} onChange={e => setEditing({ ...editing, level: e.target.value })}
              style={{ padding: '12px 16px', borderRadius: 12, border: '1px solid var(--line)', fontSize: 15, fontFamily: 'var(--font-body)' }}>
              <option>Easy</option><option>Medium</option><option>Hard</option>
            </select>
          </label>
          <label style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--ink-2)' }}>Kapak</span>
            <select value={editing.cover_kind} onChange={e => setEditing({ ...editing, cover_kind: e.target.value })}
              style={{ padding: '12px 16px', borderRadius: 12, border: '1px solid var(--line)', fontSize: 15, fontFamily: 'var(--font-body)' }}>
              {coverOptions.map(c => <option key={c}>{c}</option>)}
            </select>
          </label>
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
          <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 20, margin: 0 }}>Slaytlar ({editing.slides_data?.length || 0})</h2>
          <button className="mm-btn" onClick={addSlideItem}><Plus size={16} /> Slayt Ekle</button>
        </div>

        {(editing.slides_data || []).map((item, i) => (
          <div key={i} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 120px 40px', gap: 8, marginBottom: 8, alignItems: 'center' }}>
            <input placeholder="Label (EN)" value={item.label} onChange={e => updateSlideItem(i, 'label', e.target.value)}
              style={{ padding: '10px 14px', borderRadius: 10, border: '1px solid var(--line)', fontSize: 14, fontFamily: 'var(--font-body)' }} />
            <input placeholder="Ceviri (TR)" value={item.translation} onChange={e => updateSlideItem(i, 'translation', e.target.value)}
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
        <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 28, margin: 0 }}>Slaytlar</h1>
        <button className="mm-btn primary" onClick={() => setEditing(newSlide())}><Plus size={16} /> Yeni Slayt</button>
      </div>

      {loading ? (
        <p style={{ color: 'var(--ink-3)' }}>Yukleniyor...</p>
      ) : slides.length === 0 ? (
        <p style={{ color: 'var(--ink-3)' }}>Henuz slayt yok. Yeni ekleyin.</p>
      ) : (
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid var(--line)', textAlign: 'left' }}>
              <th style={{ padding: '10px 12px', fontFamily: 'var(--font-display)', fontSize: 14, color: 'var(--ink-3)' }}>Baslik</th>
              <th style={{ padding: '10px 12px', fontFamily: 'var(--font-display)', fontSize: 14, color: 'var(--ink-3)' }}>Slayt</th>
              <th style={{ padding: '10px 12px', fontFamily: 'var(--font-display)', fontSize: 14, color: 'var(--ink-3)' }}>Durum</th>
              <th style={{ padding: '10px 12px', fontFamily: 'var(--font-display)', fontSize: 14, color: 'var(--ink-3)' }}>Islem</th>
            </tr>
          </thead>
          <tbody>
            {slides.map(s => (
              <tr key={s.id} style={{ borderBottom: '1px solid var(--line)' }}>
                <td style={{ padding: '12px' }}>{s.title}</td>
                <td style={{ padding: '12px', color: 'var(--ink-3)' }}>{s.slide_count}</td>
                <td style={{ padding: '12px' }}>
                  <span className={`mm-tag ${s.published ? 'green' : ''}`}>{s.published ? 'Yayinda' : 'Taslak'}</span>
                </td>
                <td style={{ padding: '12px', display: 'flex', gap: 6 }}>
                  <button className="mm-icon-btn" onClick={() => setEditing(s)} title="Duzenle" style={{ width: 34, height: 34 }}>
                    <Pencil size={14} />
                  </button>
                  <button className="mm-icon-btn" onClick={() => toggle(s.id, s.published)} title={s.published ? 'Yayindan kaldir' : 'Yayinla'} style={{ width: 34, height: 34 }}>
                    {s.published ? <EyeOff size={14} /> : <Eye size={14} />}
                  </button>
                  <button className="mm-icon-btn" onClick={() => remove(s.id)} title="Sil" style={{ width: 34, height: 34, color: 'var(--primary)' }}>
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
