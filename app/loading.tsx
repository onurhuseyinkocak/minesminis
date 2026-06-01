export default function Loading() {
  return (
    <div style={{ maxWidth: 1080, margin: '0 auto', padding: 24 }}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        <div className="mm-skeleton" style={{ height: 28, width: '40%', borderRadius: 8 }} />
        <div className="mm-skeleton" style={{ height: 16, width: '70%', borderRadius: 6 }} />
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 16, marginTop: 12 }}>
          {[0, 1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="mm-skeleton" style={{ height: 180, borderRadius: 14 }} />
          ))}
        </div>
      </div>
    </div>
  )
}
