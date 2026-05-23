'use client'

import Link from 'next/link'
import { ArrowLeft, Download, Printer, Maximize } from 'lucide-react'
import type { Worksheet } from '../lib/supabase'

export default function WorksheetPlayer({ worksheet }: { worksheet: Worksheet }) {
  const getEmbedUrl = (url: string) => {
    if (url.includes('docs.google.com')) return url
    if (url.match(/\.pdf(\?|$)/i)) return `https://docs.google.com/gview?url=${encodeURIComponent(url)}&embedded=true`
    return `https://docs.google.com/gview?url=${encodeURIComponent(url)}&embedded=true`
  }

  return (
    <>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 12, flexWrap: 'wrap' }}>
        <Link href="/worksheets" className="mm-icon-btn" aria-label="Çalışma kâğıtlarına dön"><ArrowLeft size={18} /></Link>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontFamily: 'var(--font-display)', fontSize: 20, fontWeight: 700, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{worksheet.title}</div>
          <div style={{ fontSize: 13, color: 'var(--ink-3)' }}>
            {worksheet.page_count} sayfa · {worksheet.level}
          </div>
        </div>
      </div>
      <div style={{ display: 'flex', gap: 8, marginBottom: 16, flexWrap: 'wrap' }}>
        {worksheet.file_url && (
          <>
            <a href={worksheet.file_url} download className="mm-btn" style={{ textDecoration: 'none', fontSize: 13, padding: '10px 16px' }}>
              <Download size={14} /> İndir
            </a>
            <a
              href={`https://docs.google.com/gview?url=${encodeURIComponent(worksheet.file_url)}`}
              target="_blank" rel="noreferrer" className="mm-btn" style={{ textDecoration: 'none', fontSize: 13, padding: '10px 16px' }}
            >
              <Printer size={14} /> Yazdır
            </a>
          </>
        )}
        <button className="mm-btn dark" onClick={() => document.documentElement.requestFullscreen?.()} aria-label="Tam ekran" style={{ fontSize: 13, padding: '10px 16px' }}>
          <Maximize size={14} /> Tam ekran
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
          <p style={{ fontFamily: 'var(--font-display)', fontSize: 20, fontWeight: 700 }}>Çalışma kâğıdı dosyası henüz yüklenmedi</p>
        </div>
      )}
    </>
  )
}
