import { useState, useEffect } from 'react'
import { RefreshCw, Trash2, Eye, AlertCircle, CheckCircle, XCircle, Clock } from 'lucide-react'
import { supabase } from '../../lib/supabase'
import type { Blog } from '../../lib/supabase'
import toast from 'react-hot-toast'

type GenLog = {
  id: string
  run_at: string
  blogs_generated: number
  blogs_failed: number
  error_message: string | null
  duration_ms: number
}

export default function BlogsManager() {
  const [blogs, setBlogs] = useState<Blog[]>([])
  const [genLogs, setGenLogs] = useState<GenLog[]>([])
  const [loading, setLoading] = useState(true)
  const [generating, setGenerating] = useState(false)
  const [filter, setFilter] = useState<'all' | 'published' | 'failed'>('all')

  const loadData = async () => {
    const [blogsRes, logsRes] = await Promise.all([
      supabase.from('mm_blogs').select('*').order('created_at', { ascending: false }).limit(50),
      supabase.from('mm_blog_gen_log').select('*').order('run_at', { ascending: false }).limit(10),
    ])
    if (blogsRes.data) setBlogs(blogsRes.data)
    if (logsRes.data) setGenLogs(logsRes.data as GenLog[])
    setLoading(false)
  }

  useEffect(() => { loadData() }, [])

  const handleGenerate = async () => {
    setGenerating(true)
    try {
      const { data: { session } } = await supabase.auth.getSession()
      const res = await fetch('/api/generate-blog', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${session?.access_token}`,
          'Content-Type': 'application/json',
        },
      })
      const result = await res.json()
      if (res.ok) {
        toast.success(`${result.generated} blog olusturuldu`)
        loadData()
      } else {
        toast.error(result.error || 'Blog olusturma hatasi')
      }
    } catch (err: unknown) {
      toast.error('Baglanti hatasi: ' + (err instanceof Error ? err.message : 'unknown'))
    } finally {
      setGenerating(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Bu blog yaziyi silmek istediginize emin misiniz?')) return
    const { error } = await supabase.from('mm_blogs').delete().eq('id', id)
    if (error) { toast.error('Silme hatasi'); return }
    toast.success('Blog silindi')
    setBlogs(prev => prev.filter(b => b.id !== id))
  }

  const handleTogglePublish = async (blog: Blog) => {
    const newStatus = blog.status === 'published' ? 'draft' : 'published'
    const updates: Record<string, string> = { status: newStatus }
    if (newStatus === 'published' && !blog.published_at) {
      updates.published_at = new Date().toISOString()
    }
    const { error } = await supabase.from('mm_blogs').update(updates).eq('id', blog.id)
    if (error) { toast.error('Guncelleme hatasi'); return }
    setBlogs(prev => prev.map(b => b.id === blog.id ? { ...b, ...updates } : b))
    toast.success(newStatus === 'published' ? 'Yayinlandi' : 'Taslaga alindi')
  }

  const handleRetryFailed = async (blog: Blog) => {
    const { error } = await supabase.from('mm_blogs').delete().eq('id', blog.id)
    if (!error) {
      toast.success('Basarisiz blog silindi, yeni uretim icin Generate butonunu kullanin')
      setBlogs(prev => prev.filter(b => b.id !== blog.id))
    }
  }

  const filtered = filter === 'all' ? blogs : blogs.filter(b => b.status === filter)

  const statusIcon = (status: string) => {
    if (status === 'published') return <CheckCircle size={14} color="var(--green)" />
    if (status === 'failed') return <XCircle size={14} color="var(--primary)" />
    return <Clock size={14} color="var(--ink-3)" />
  }

  if (loading) return <div style={{ padding: 32, color: 'var(--ink-3)' }}>Loading blogs...</div>

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <div>
          <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 28, margin: '0 0 4px' }}>Blog Manager</h1>
          <p style={{ color: 'var(--ink-3)', margin: 0, fontSize: 14 }}>
            {blogs.filter(b => b.status === 'published').length} published, {blogs.filter(b => b.status === 'failed').length} failed
          </p>
        </div>
        <button
          className="mm-btn primary"
          onClick={handleGenerate}
          disabled={generating}
          style={{ display: 'flex', alignItems: 'center', gap: 8 }}
        >
          <RefreshCw size={16} className={generating ? 'spinning' : ''} />
          {generating ? 'Generating...' : 'Generate 3 Blogs'}
        </button>
      </div>

      {/* Generation Logs */}
      {genLogs.length > 0 && (
        <div style={{ background: 'white', borderRadius: 12, border: '1px solid var(--line)', padding: 16, marginBottom: 24 }}>
          <h3 style={{ fontFamily: 'var(--font-display)', fontSize: 16, margin: '0 0 12px' }}>Generation Log</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {genLogs.slice(0, 5).map(log => (
              <div key={log.id} style={{ display: 'flex', alignItems: 'center', gap: 12, fontSize: 13, padding: '8px 0', borderBottom: '1px solid var(--line)' }}>
                <span style={{ color: 'var(--ink-3)', minWidth: 120 }}>
                  {new Date(log.run_at).toLocaleString('tr-TR')}
                </span>
                <span style={{ color: 'var(--green)', fontWeight: 600 }}>{log.blogs_generated} OK</span>
                {log.blogs_failed > 0 && <span style={{ color: 'var(--primary)', fontWeight: 600 }}>{log.blogs_failed} FAIL</span>}
                <span style={{ color: 'var(--ink-3)' }}>{log.duration_ms}ms</span>
                {log.error_message && (
                  <span style={{ color: 'var(--primary)', fontSize: 12, flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}
                    title={log.error_message}>
                    <AlertCircle size={12} style={{ verticalAlign: 'middle', marginRight: 4 }} />
                    {log.error_message}
                  </span>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Filter Tabs */}
      <div className="mm-chips" style={{ marginBottom: 16 }}>
        {(['all', 'published', 'failed'] as const).map(f => (
          <button key={f} className={`mm-chip${filter === f ? ' active' : ''}`} onClick={() => setFilter(f)}>
            {f === 'all' ? 'All' : f === 'published' ? 'Published' : 'Failed'} ({
              f === 'all' ? blogs.length : blogs.filter(b => b.status === f).length
            })
          </button>
        ))}
      </div>

      {/* Blog List */}
      {filtered.length === 0 ? (
        <div style={{ textAlign: 'center', padding: 40, color: 'var(--ink-3)' }}>
          <p style={{ fontFamily: 'var(--font-display)', fontSize: 18 }}>No blogs yet</p>
          <p style={{ fontSize: 14 }}>Click "Generate 3 Blogs" to create SEO content</p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {filtered.map(blog => (
            <div key={blog.id} style={{
              background: 'white', borderRadius: 12, border: '1px solid var(--line)',
              padding: 16, display: 'flex', alignItems: 'center', gap: 14,
            }}>
              {/* Cover thumbnail */}
              {blog.cover_url ? (
                <img src={blog.cover_url} alt="" style={{ width: 60, height: 42, borderRadius: 8, objectFit: 'cover', flexShrink: 0 }} />
              ) : (
                <div style={{ width: 60, height: 42, borderRadius: 8, background: 'var(--surface-2)', flexShrink: 0 }} />
              )}

              {/* Info */}
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                  {statusIcon(blog.status)}
                  <span style={{ fontFamily: 'var(--font-display)', fontWeight: 600, fontSize: 14, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {blog.title}
                  </span>
                </div>
                <div style={{ fontSize: 12, color: 'var(--ink-3)', display: 'flex', gap: 10 }}>
                  <span className={`mm-tag ${blog.category === 'teacher-resources' ? 'blue' : 'green'}`} style={{ fontSize: 11 }}>
                    {blog.category === 'teacher-resources' ? 'Ogretmen' : 'Cocuklar'}
                  </span>
                  <span>{new Date(blog.created_at).toLocaleDateString('tr-TR')}</span>
                  {blog.reading_time_min > 0 && <span>{blog.reading_time_min} dk</span>}
                </div>
                {blog.error_log && (
                  <div style={{ fontSize: 12, color: 'var(--primary)', marginTop: 4 }}>
                    <AlertCircle size={11} style={{ verticalAlign: 'middle', marginRight: 4 }} />
                    {blog.error_log}
                  </div>
                )}
              </div>

              {/* Actions */}
              <div style={{ display: 'flex', gap: 6, flexShrink: 0 }}>
                {blog.status === 'published' && (
                  <a href={`/blog/${blog.slug}`} target="_blank" rel="noopener noreferrer"
                    style={{ width: 36, height: 36, borderRadius: 8, border: '1px solid var(--line)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--ink-2)', background: 'white' }}
                    title="View">
                    <Eye size={16} />
                  </a>
                )}
                {blog.status === 'failed' ? (
                  <button onClick={() => handleRetryFailed(blog)}
                    style={{ width: 36, height: 36, borderRadius: 8, border: '1px solid var(--line)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--accent)', background: 'white', cursor: 'pointer' }}
                    title="Delete failed & retry">
                    <RefreshCw size={16} />
                  </button>
                ) : (
                  <button onClick={() => handleTogglePublish(blog)}
                    style={{ width: 36, height: 36, borderRadius: 8, border: '1px solid var(--line)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: blog.status === 'published' ? 'var(--green)' : 'var(--ink-3)', background: 'white', cursor: 'pointer' }}
                    title={blog.status === 'published' ? 'Unpublish' : 'Publish'}>
                    <CheckCircle size={16} />
                  </button>
                )}
                <button onClick={() => handleDelete(blog.id)}
                  style={{ width: 36, height: 36, borderRadius: 8, border: '1px solid var(--line)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--primary)', background: 'white', cursor: 'pointer' }}
                  title="Delete">
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
