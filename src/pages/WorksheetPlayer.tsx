import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { ArrowLeft, Download, Printer, Maximize } from 'lucide-react'
import AdBanner from '../components/AdBanner'
import { supabase, Worksheet } from '../lib/supabase'

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

  useEffect(() => { document.title = worksheet ? `${worksheet.title} - minesminis` : 'minesminis' }, [worksheet])

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
      <div style={{ textAlign: 'center', padding: 60, color: 'var(--ink-3)' }}>
        <p style={{ fontFamily: 'var(--font-display)', fontSize: 20 }}>Loading...</p>
      </div>
    )
  }

  return (
    <>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <Link to="/worksheets" className="mm-icon-btn" aria-label="Back to Worksheets"><ArrowLeft size={18} /></Link>
          <div>
            <div style={{ fontFamily: 'var(--font-display)', fontSize: 20, fontWeight: 700 }}>{worksheet.title}</div>
            <div style={{ fontSize: 13, color: 'var(--ink-3)' }}>
              {worksheet.page_count} page{worksheet.page_count !== 1 ? 's' : ''} &middot; {worksheet.level}
            </div>
          </div>
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          {worksheet.file_url && (
            <>
              <a href={worksheet.file_url} download className="mm-btn" style={{ textDecoration: 'none' }}>
                <Download size={16} /> Download
              </a>
              <a
                href={`https://docs.google.com/gview?url=${encodeURIComponent(worksheet.file_url)}`}
                target="_blank" rel="noreferrer" className="mm-btn" style={{ textDecoration: 'none' }}
              >
                <Printer size={16} /> Print
              </a>
            </>
          )}
          <button className="mm-btn dark" onClick={() => document.documentElement.requestFullscreen?.()} aria-label="Fullscreen">
            <Maximize size={16} /> Fullscreen
          </button>
        </div>
      </div>

      {worksheet.description && (
        <p style={{ fontSize: 15, color: 'var(--ink-2)', marginBottom: 16, lineHeight: 1.5 }}>{worksheet.description}</p>
      )}

      {worksheet.file_url ? (
        <div style={{ background: 'white', borderRadius: 28, overflow: 'hidden', border: '1px solid var(--line)', boxShadow: 'var(--shadow-1)' }}>
          <div style={{ height: 700, position: 'relative' }}>
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
