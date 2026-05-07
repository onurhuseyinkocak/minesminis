import { useEffect, useRef, useState } from 'react'

type Stage = 'idle' | 'auth' | 'generating' | 'uploading' | 'done' | 'error'

const STAGE_INFO: Record<Stage, { label: string; target: number }> = {
  idle: { label: '', target: 0 },
  auth: { label: 'Authenticating...', target: 8 },
  generating: { label: 'AI generating image...', target: 72 },
  uploading: { label: 'Uploading cover...', target: 92 },
  done: { label: 'Done!', target: 100 },
  error: { label: 'Failed', target: 0 },
}

export function useCoverProgress() {
  const [stage, setStage] = useState<Stage>('idle')
  const [progress, setProgress] = useState(0)
  const intervalRef = useRef<ReturnType<typeof setInterval>>()

  useEffect(() => {
    if (intervalRef.current) clearInterval(intervalRef.current)
    const info = STAGE_INFO[stage]
    if (stage === 'idle' || stage === 'error') { setProgress(0); return }
    if (stage === 'done') { setProgress(100); return }

    intervalRef.current = setInterval(() => {
      setProgress(prev => {
        if (prev >= info.target) return prev
        const remaining = info.target - prev
        const step = Math.max(0.3, remaining * 0.04)
        return Math.min(prev + step, info.target)
      })
    }, 150)

    return () => { if (intervalRef.current) clearInterval(intervalRef.current) }
  }, [stage])

  const reset = () => { setStage('idle'); setProgress(0) }

  return { stage, setStage, progress, reset }
}

export function CoverProgressBar({ progress, label }: { progress: number; label: string }) {
  if (progress <= 0) return null
  return (
    <div style={{ width: '100%', marginTop: 10 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
        <span style={{ fontSize: 12, color: 'var(--ink-2)', fontWeight: 600 }}>{label}</span>
        <span style={{ fontSize: 12, color: 'var(--ink-3)' }}>{Math.round(progress)}%</span>
      </div>
      <div style={{ width: '100%', height: 6, background: 'var(--line)', borderRadius: 3, overflow: 'hidden' }}>
        <div style={{
          width: `${progress}%`,
          height: '100%',
          background: progress >= 100 ? 'var(--green)' : 'var(--primary)',
          borderRadius: 3,
          transition: 'width 0.15s ease-out, background 0.3s',
        }} />
      </div>
    </div>
  )
}
