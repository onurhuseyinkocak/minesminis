import React from 'react';
import { AVATAR_ITEMS } from '../data/avatarItems';
import type { AvatarConfig } from '../services/avatarService';
import './AvatarDisplay.css';

interface AvatarDisplayProps {
  config: AvatarConfig;
  letter?: string;
  size?: number;
  animated?: boolean;
  className?: string;
}

function getItem(id: string | null) {
  if (!id) return null;
  return AVATAR_ITEMS.find((i) => i.id === id) ?? null;
}

/**
 * Renders a layered SVG avatar:
 * 1. Background circle (bg item color / gradient)
 * 2. Base color circle
 * 3. Initial letter
 * 4. Hat (top)
 * 5. Accessory (bottom/side)
 * 6. Frame ring
 */
const AvatarDisplay: React.FC<AvatarDisplayProps> = ({
  config,
  letter = '?',
  size = 80,
  animated = false,
  className,
}) => {
  const colorItem  = getItem(config.color);
  const hatItem    = getItem(config.hat);
  const accItem    = getItem(config.accessory);
  const bgItem     = getItem(config.background);
  const frameItem  = getItem(config.frame);

  const baseColor  = colorItem?.color ?? '#4A90D9';
  const bgColor    = bgItem?.color   ?? 'transparent';

  // Resolve background: gradient strings need foreignObject or a linearGradient; we
  // embed a simple gradient via defs when the color string starts with "linear-gradient".
  const isGradientBg = typeof bgColor === 'string' && bgColor.startsWith('linear-gradient');

  // Parse gradient stops from "linear-gradient(160deg, #hex 0%, #hex 100%)" for SVG defs
  function parseGradientStops(css: string): { color: string; offset: string }[] {
    const stopRegex = /(#[0-9a-fA-F]{3,8}|rgba?\([^)]+\))\s+(\d+)%/g;
    const stops: { color: string; offset: string }[] = [];
    let m: RegExpExecArray | null;
    while ((m = stopRegex.exec(css)) !== null) {
      stops.push({ color: m[1], offset: m[2] + '%' });
    }
    return stops.length ? stops : [{ color: '#4A90D9', offset: '0%' }, { color: '#0EA5E9', offset: '100%' }];
  }

  function parseGradientAngle(css: string): number {
    const m = css.match(/(\d+)deg/);
    return m ? parseInt(m[1], 10) : 160;
  }

  function angleToXY(deg: number): { x1: string; y1: string; x2: string; y2: string } {
    const rad = ((deg - 90) * Math.PI) / 180;
    const x = Math.cos(rad);
    const y = Math.sin(rad);
    return {
      x1: `${50 - x * 50}%`,
      y1: `${50 - y * 50}%`,
      x2: `${50 + x * 50}%`,
      y2: `${50 + y * 50}%`,
    };
  }

  const bgGradientId = `avatar-bg-grad-${config.background ?? 'none'}`;
  const bgGradientStops = isGradientBg ? parseGradientStops(bgColor) : [];
  const bgGradientAngle = isGradientBg ? parseGradientAngle(bgColor) : 160;
  const bgGradientXY    = isGradientBg ? angleToXY(bgGradientAngle) : null;

  const r = size / 2;
  const cx = r;
  const cy = r;
  const baseR  = r * 0.72;        // main character circle radius
  const bgR    = r * 0.88;        // background circle radius
  const frameW = r * 0.10;        // frame stroke width

  const fontSize = size * 0.28;

  const wrapCls = [
    'avatar-display',
    animated ? 'avatar-display--animated' : '',
    className ?? '',
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <div className={wrapCls} style={{ width: size, height: size }}>
      <svg
        className="avatar-display__svg"
        width={size}
        height={size}
        viewBox={`0 0 ${size} ${size}`}
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
      >
        <defs>
          {/* Background gradient (only rendered when needed) */}
          {isGradientBg && bgGradientXY && (
            <linearGradient
              id={bgGradientId}
              x1={bgGradientXY.x1}
              y1={bgGradientXY.y1}
              x2={bgGradientXY.x2}
              y2={bgGradientXY.y2}
              gradientUnits="objectBoundingBox"
            >
              {bgGradientStops.map((s, i) => (
                <stop key={i} offset={s.offset} stopColor={s.color} />
              ))}
            </linearGradient>
          )}
        </defs>

        {/* ── 1. Background layer ── */}
        {bgItem && (
          <circle
            cx={cx}
            cy={cy}
            r={bgR}
            fill={isGradientBg ? `url(#${bgGradientId})` : bgColor}
          />
        )}

        {/* ── 2. Base color circle ── */}
        <circle cx={cx} cy={cy} r={baseR} fill={baseColor} />

        {/* ── 3. Initial letter ── */}
        <text
          x={cx}
          y={cy + fontSize * 0.36}
          textAnchor="middle"
          fontSize={fontSize}
          fontWeight="800"
          fontFamily="Nunito, sans-serif"
          fill="rgba(255,255,255,0.95)"
        >
          {letter.charAt(0).toUpperCase()}
        </text>

        {/* ── 4. Hat ── */}
        {hatItem && hatItem.svgPath && (
          <g
            transform={`translate(${cx - 40}, ${cy - 40}) scale(${size / 80})`}
            dangerouslySetInnerHTML={{ __html: hatItem.svgPath }}
          />
        )}

        {/* ── 5. Accessory ── */}
        {accItem && accItem.svgPath && (
          <g
            transform={`translate(${cx - 40}, ${cy - 40}) scale(${size / 80})`}
            dangerouslySetInnerHTML={{ __html: accItem.svgPath }}
          />
        )}

        {/* ── 6. Frame ring ── */}
        {frameItem && (
          <circle
            cx={cx}
            cy={cy}
            r={bgR + frameW * 0.5}
            fill="none"
            stroke={frameItem.color ?? '#FFD700'}
            strokeWidth={frameW}
          />
        )}
      </svg>
    </div>
  );
};

export default AvatarDisplay;
