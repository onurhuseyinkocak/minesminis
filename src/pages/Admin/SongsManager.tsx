import { useState, useEffect } from 'react'
import { Plus, Trash2, Eye, EyeOff, Save, Pencil } from 'lucide-react'
import { supabase, Song, SongLyric } from '../../lib/supabase'
import toast from 'react-hot-toast'

const coverOptions = ['star','happy','head','farm2','bus','bingo','spider','dance','rainbow','duck','abc','apple','fruit','hello','days']

export default function SongsManager() {
  const [songs, setSongs] = useState<Song[]>([])
  const [editing, setEditing] = useState<Song | null>(null)
  const [loading, setLoading] = useState(true)

  const load = async () => {
    const { data } = await supabase.from('mm_songs').select('*').order('created_at', { ascending: false })
    if (data) setSongs(data)
    setLoading(false)
  }

  useEffect(() => { load() }, [])

  const save = async () => {
    if (!editing) return
    if (!editing.title.trim()) { toast.error('Baslik zorunlu'); return }
    const { id, created_at: _, ...rest } = editing
    try {
      if (id) {
        const { error } = await supabase.from('mm_songs').update(rest).eq('id', id)
        if (error) throw error
      } else {
        const { error } = await supabase.from('mm_songs').insert(rest)
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
      const { error } = await supabase.from('mm_songs').delete().eq('id', id)
      if (error) throw error
      toast.success('Silindi')
      load()
    } catch (e: any) { toast.error(e.message || 'Silme hatasi') }
  }

  const toggle = async (id: string, published: boolean) => {
    try {
      const { error } = await supabase.from('mm_songs').update({ published: !published }).eq('id', id)
      if (error) throw error
      toast.success(published ? 'Yayindan kaldirildi' : 'Yayinlandi')
      load()
    } catch (e: any) { toast.error(e.message || 'Guncelleme hatasi') }
  }

  const newSong = (): Song => ({
    id: '',
    title: '',
    cover_kind: 'star',
    duration: '',
    category: '',
    audio_url: '',
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
            {editing.id ? 'Sarki Duzenle' : 'Yeni Sarki'}
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
            <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--ink-2)' }}>Sure (orn: 2:30)</span>
            <input value={editing.duration} onChange={e => setEditing({ ...editing, duration: e.target.value })}
              style={{ padding: '12px 16px', borderRadius: 12, border: '1px solid var(--line)', fontSize: 15, fontFamily: 'var(--font-body)' }} />
          </label>
          <label style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--ink-2)' }}>Kapak</span>
            <select value={editing.cover_kind} onChange={e => setEditing({ ...editing, cover_kind: e.target.value })}
              style={{ padding: '12px 16px', borderRadius: 12, border: '1px solid var(--line)', fontSize: 15, fontFamily: 'var(--font-body)' }}>
              {coverOptions.map(c => <option key={c}>{c}</option>)}
            </select>
          </label>
          <label style={{ display: 'flex', flexDirection: 'column', gap: 6, gridColumn: 'span 2' }}>
            <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--ink-2)' }}>Audio URL</span>
            <input value={editing.audio_url} onChange={e => setEditing({ ...editing, audio_url: e.target.value })}
              placeholder="https://..."
              style={{ padding: '12px 16px', borderRadius: 12, border: '1px solid var(--line)', fontSize: 15, fontFamily: 'var(--font-body)' }} />
          </label>
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
          <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 20, margin: 0 }}>Sozler ({editing.lyrics?.length || 0})</h2>
          <button className="mm-btn" onClick={addLyric}><Plus size={16} /> Satir Ekle</button>
        </div>

        {(editing.lyrics || []).map((line, i) => (
          <div key={i} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 60px 40px', gap: 8, marginBottom: 8, alignItems: 'center' }}>
            <input placeholder="English" value={line.en} onChange={e => updateLyric(i, 'en', e.target.value)}
              style={{ padding: '10px 14px', borderRadius: 10, border: '1px solid var(--line)', fontSize: 14, fontFamily: 'var(--font-body)' }} />
            <input placeholder="Turkce" value={line.tr} onChange={e => updateLyric(i, 'tr', e.target.value)}
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
        <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 28, margin: 0 }}>Sarkilar</h1>
        <button className="mm-btn primary" onClick={() => setEditing(newSong())}><Plus size={16} /> Yeni Sarki</button>
      </div>

      {loading ? (
        <p style={{ color: 'var(--ink-3)' }}>Yukleniyor...</p>
      ) : songs.length === 0 ? (
        <p style={{ color: 'var(--ink-3)' }}>Henuz sarki yok. Yeni ekleyin.</p>
      ) : (
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid var(--line)', textAlign: 'left' }}>
              <th style={{ padding: '10px 12px', fontFamily: 'var(--font-display)', fontSize: 14, color: 'var(--ink-3)' }}>Baslik</th>
              <th style={{ padding: '10px 12px', fontFamily: 'var(--font-display)', fontSize: 14, color: 'var(--ink-3)' }}>Sure</th>
              <th style={{ padding: '10px 12px', fontFamily: 'var(--font-display)', fontSize: 14, color: 'var(--ink-3)' }}>Durum</th>
              <th style={{ padding: '10px 12px', fontFamily: 'var(--font-display)', fontSize: 14, color: 'var(--ink-3)' }}>Islem</th>
            </tr>
          </thead>
          <tbody>
            {songs.map(s => (
              <tr key={s.id} style={{ borderBottom: '1px solid var(--line)' }}>
                <td style={{ padding: '12px' }}>{s.title}</td>
                <td style={{ padding: '12px', color: 'var(--ink-3)' }}>{s.duration}</td>
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
