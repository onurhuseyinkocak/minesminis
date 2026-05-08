import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { ArrowLeft, Download, Printer, Maximize } from 'lucide-react'
import AdBanner from '../components/AdBanner'
import { supabase, Worksheet } from '../lib/supabase'
import { useMeta } from '../hooks/useMeta'

export default function WorksheetPlayer() {
  const { id } = useParams()
  const [worksheet, setWorksheet] = useState<Worksheet | null>(null)
  const [error, setError] = useState(false)

  useEffect(() => {
    if (id) {
      supabase.from('mm_worksheets').select('*').eq('id', id).eq('published', true).single()
        .then(({ data, error: err }) => {
          if (err || !data) { setError(true); return }
          setWorksheet(data)
        })
    }
  }, [id])

  useMeta({
    title: worksheet ? `${worksheet.title} - minesminis` : 'minesminis',
    description: worksheet ? `${worksheet.title} - indirilebilir Ingilizce calisma kagidi` : undefined,
    url: worksheet ? `https://minesminis.com/worksheets/${worksheet.id}` : undefined,
  })

  const getEmbedUrl = (url: string) => {
    if (url.includes('docs.google.com')) return url
    if (url.match(/\.pdf(\?|$)/i)) {
      return `https://docs.google.com/gview?url=${encodeURIComponent(url)}&embedded=true`
    }
    return `https://docs.google.com/gview?url=${encodeURIComponent(url)}&embedded=true`
  }

  if (error) {
    return (
      <div style={{ textAlign: 'center', padding: 60 }}>
        <p style={{ fontFamily: 'var(--font-display)', fontSize: 20, fontWeight: 700, color: 'var(--primary)' }}>Content not found</p>
        <Link to="/worksheets" className="mm-btn primary" style={{ marginTop: 12, textDecoration: 'none', display: 'inline-flex' }}>Back to Worksheets</Link>
      </div>
    )
  }

  if (!worksheet) {
    return (
      <div className="mm-skeleton">
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
          <div style={{ width: 44, height: 44, borderRadius: '50%', background: 'var(--surface-2)' }} />
          <div>
            <div style={{ height: 20, width: 200, background: 'var(--surface-2)', borderRadius: 8 }} />
            <div style={{ height: 14, width: 120, background: 'var(--surface-2)', borderRadius: 8, marginTop: 6 }} />
          </div>
        </div>
        <div style={{ height: 'min(700px, 70vh)', background: 'var(--surface-2)', borderRadius: 28 }} />
      </div>
    )
  }

  return (
    <>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 12, flexWrap: 'wrap' }}>
        <Link to="/worksheets" className="mm-icon-btn" aria-label="Back to Worksheets"><ArrowLeft size={18} /></Link>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontFamily: 'var(--font-display)', fontSize: 20, fontWeight: 700, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{worksheet.title}</div>
          <div style={{ fontSize: 13, color: 'var(--ink-3)' }}>
            {worksheet.page_count} page{worksheet.page_count !== 1 ? 's' : ''} &middot; {worksheet.level}
          </div>
        </div>
      </div>
      <div style={{ display: 'flex', gap: 8, marginBottom: 16, flexWrap: 'wrap' }}>
        {worksheet.file_url && (
          <>
            <a href={worksheet.file_url} download className="mm-btn" style={{ textDecoration: 'none', fontSize: 13, padding: '10px 16px' }}>
              <Download size={14} /> Download
            </a>
            <a
              href={`https://docs.google.com/gview?url=${encodeURIComponent(worksheet.file_url)}`}
              target="_blank" rel="noreferrer" className="mm-btn" style={{ textDecoration: 'none', fontSize: 13, padding: '10px 16px' }}
            >
              <Printer size={14} /> Print
            </a>
          </>
        )}
        <button className="mm-btn dark" onClick={() => document.documentElement.requestFullscreen?.()} aria-label="Fullscreen" style={{ fontSize: 13, padding: '10px 16px' }}>
          <Maximize size={14} /> Fullscreen
        </button>
      </div>

      {worksheet.description && (
        <p style={{ fontSize: 15, color: 'var(--ink-2)', marginBottom: 16, lineHeight: 1.5 }}>{worksheet.description}</p>
      )}

      {worksheet.file_url ? (
        <div style={{ background: 'white', borderRadius: 28, overflow: 'hidden', border: '1px solid var(--line)', boxShadow: 'var(--shadow-1)' }}>
          <div style={{ height: 'min(700px, 70vh)', position: 'relative' }}>
            <iframe
              src={getEmbedUrl(worksheet.file_url)}
              title={worksheet.title}
              style={{ width: '100%', height: '100%', border: 'none' }}
              allowFullScreen
              sandbox="allow-scripts allow-same-origin allow-popups allow-forms"
            />
          </div>
        </div>
      ) : (
        <div style={{ textAlign: 'center', padding: 60, color: 'var(--ink-3)', background: 'white', borderRadius: 28, border: '1px solid var(--line)' }}>
          <p style={{ fontFamily: 'var(--font-display)', fontSize: 20, fontWeight: 700 }}>Worksheet file not uploaded yet</p>
        </div>
      )}

      <AdBanner format="auto" />
    </>
  )
}
