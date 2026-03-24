import React from 'react';

export type KidIconName =
  | 'home' | 'learn' | 'games' | 'library' | 'stories'
  | 'garden' | 'reading' | 'fire' | 'star' | 'trophy'
  | 'book' | 'music' | 'video' | 'puzzle' | 'heart'
  | 'check' | 'lock' | 'play' | 'mic' | 'logout';

export interface KidIconProps {
  name: KidIconName;
  size?: number;
  className?: string;
}

const icons: Record<KidIconName, React.ReactElement> = {
  home: (
    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Chimney */}
      <rect x="15" y="3" width="3" height="5" rx="1" fill="#CC4A1A" />
      {/* Roof */}
      <path d="M2.5 11.5L12 3.5L21.5 11.5" stroke="#CC4A1A" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M4 10.5V20C4 20.55 4.45 21 5 21H9V16C9 15.45 9.45 15 10 15H14C14.55 15 15 15.45 15 16V21H19C19.55 21 20 20.55 20 20V10.5L12 4L4 10.5Z" fill="#FF6B35" />
      {/* Door */}
      <rect x="10" y="15" width="4" height="6" rx="1" fill="#CC4A1A" />
      {/* Window left */}
      <rect x="5.5" y="12" width="3.5" height="3.5" rx="1" fill="white" opacity="0.85" />
      {/* Window right */}
      <rect x="15" y="12" width="3.5" height="3.5" rx="1" fill="white" opacity="0.85" />
    </svg>
  ),

  learn: (
    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Globe shape */}
      <circle cx="12" cy="12" r="9.5" fill="#22C55E" />
      <circle cx="12" cy="12" r="9.5" stroke="#16A34A" strokeWidth="1" />
      {/* Horizontal lines */}
      <path d="M2.8 9H21.2" stroke="white" strokeWidth="1.2" strokeLinecap="round" opacity="0.6" />
      <path d="M2.8 15H21.2" stroke="white" strokeWidth="1.2" strokeLinecap="round" opacity="0.6" />
      {/* Vertical center line */}
      <path d="M12 2.5C12 2.5 8 7 8 12C8 17 12 21.5 12 21.5" stroke="white" strokeWidth="1.2" strokeLinecap="round" opacity="0.6" />
      <path d="M12 2.5C12 2.5 16 7 16 12C16 17 12 21.5 12 21.5" stroke="white" strokeWidth="1.2" strokeLinecap="round" opacity="0.6" />
      {/* Outer circle outline */}
      <circle cx="12" cy="12" r="9.5" stroke="#16A34A" strokeWidth="1.5" fill="none" />
    </svg>
  ),

  games: (
    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Controller body */}
      <rect x="2" y="7" width="20" height="12" rx="6" fill="#7C3AED" />
      {/* D-pad vertical */}
      <rect x="7" y="10" width="2" height="6" rx="1" fill="white" opacity="0.9" />
      {/* D-pad horizontal */}
      <rect x="5" y="12" width="6" height="2" rx="1" fill="white" opacity="0.9" />
      {/* Action button A */}
      <circle cx="17" cy="11" r="1.5" fill="#F43F5E" />
      {/* Action button B */}
      <circle cx="14.5" cy="13.5" r="1.5" fill="#F59E0B" />
      {/* Shoulder bumper left */}
      <path d="M4 8.5C4 8.5 5 6 7 6H10L10 8.5H4Z" fill="#6D28D9" />
      {/* Shoulder bumper right */}
      <path d="M20 8.5C20 8.5 19 6 17 6H14L14 8.5H20Z" fill="#6D28D9" />
    </svg>
  ),

  library: (
    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Book 1 (left) */}
      <rect x="3" y="5" width="4.5" height="15" rx="1.5" fill="#3B82F6" />
      <rect x="3" y="5" width="1" height="15" rx="0.5" fill="#2563EB" />
      {/* Book 2 (middle) */}
      <rect x="9" y="7" width="4.5" height="13" rx="1.5" fill="#60A5FA" />
      <rect x="9" y="7" width="1" height="13" rx="0.5" fill="#3B82F6" />
      {/* Book 3 (right) */}
      <rect x="15.5" y="4" width="4.5" height="16" rx="1.5" fill="#2563EB" />
      <rect x="15.5" y="4" width="1" height="16" rx="0.5" fill="#1D4ED8" />
      {/* Shelf */}
      <rect x="2" y="20" width="20" height="2" rx="1" fill="#1E40AF" />
    </svg>
  ),

  stories: (
    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Book shape */}
      <path d="M4 4C4 3.45 4.45 3 5 3H19C19.55 3 20 3.45 20 4V18C20 18.55 19.55 19 19 19H5C4.45 19 4 18.55 4 18V4Z" fill="#F59E0B" />
      {/* Spine */}
      <rect x="4" y="3" width="3" height="16" rx="0" fill="#D97706" />
      {/* Star decoration */}
      <path d="M13 7L13.7 9.1H16L14.2 10.4L14.9 12.5L13 11.2L11.1 12.5L11.8 10.4L10 9.1H12.3L13 7Z" fill="white" />
      {/* Lines for text */}
      <rect x="8" y="14" width="8" height="1.2" rx="0.6" fill="white" opacity="0.7" />
      <rect x="8" y="16.5" width="5" height="1.2" rx="0.6" fill="white" opacity="0.5" />
      {/* Bottom tab */}
      <rect x="4" y="19" width="16" height="2" rx="1" fill="#D97706" />
    </svg>
  ),

  garden: (
    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Stem */}
      <path d="M12 21V11" stroke="#065F46" strokeWidth="2.5" strokeLinecap="round" />
      {/* Left leaf */}
      <path d="M12 15C12 15 9 14 7.5 11.5C7.5 11.5 10 10 12 13" fill="#10B981" />
      {/* Right leaf */}
      <path d="M12 13C12 13 15 12 16.5 9.5C16.5 9.5 14 8 12 11" fill="#10B981" />
      {/* Flower center */}
      <circle cx="12" cy="8" r="3.5" fill="#F59E0B" />
      {/* Petals */}
      <ellipse cx="12" cy="4" rx="2" ry="2.5" fill="#10B981" />
      <ellipse cx="12" cy="12" rx="2" ry="2.5" fill="#10B981" />
      <ellipse cx="8" cy="8" rx="2.5" ry="2" fill="#10B981" />
      <ellipse cx="16" cy="8" rx="2.5" ry="2" fill="#10B981" />
      {/* Flower center overlay */}
      <circle cx="12" cy="8" r="2.5" fill="#F59E0B" />
      <circle cx="12" cy="8" r="1.2" fill="#D97706" />
    </svg>
  ),

  reading: (
    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Open book left page */}
      <path d="M12 5C12 5 8 4 4 5V19C4 19 8 18 12 19V5Z" fill="#6366F1" />
      {/* Open book right page */}
      <path d="M12 5C12 5 16 4 20 5V19C20 19 16 18 12 19V5Z" fill="#818CF8" />
      {/* Spine crease */}
      <line x1="12" y1="5" x2="12" y2="19" stroke="#4F46E5" strokeWidth="1.5" />
      {/* Lines on left page */}
      <path d="M6 9H10.5" stroke="white" strokeWidth="1.2" strokeLinecap="round" opacity="0.7" />
      <path d="M6 12H10.5" stroke="white" strokeWidth="1.2" strokeLinecap="round" opacity="0.7" />
      <path d="M6 15H9" stroke="white" strokeWidth="1.2" strokeLinecap="round" opacity="0.7" />
      {/* Lines on right page */}
      <path d="M13.5 9H18" stroke="white" strokeWidth="1.2" strokeLinecap="round" opacity="0.7" />
      <path d="M13.5 12H18" stroke="white" strokeWidth="1.2" strokeLinecap="round" opacity="0.7" />
      <path d="M13.5 15H16" stroke="white" strokeWidth="1.2" strokeLinecap="round" opacity="0.7" />
    </svg>
  ),

  fire: (
    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="fireGrad" x1="12" y1="21" x2="12" y2="3" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#FF6B35" />
          <stop offset="50%" stopColor="#FF9500" />
          <stop offset="100%" stopColor="#FFD700" />
        </linearGradient>
      </defs>
      {/* Main flame */}
      <path d="M12 21C7.5 21 5 17.5 5 14.5C5 11.5 7 9 8 8C8 8 7.5 11 9.5 12C9.5 12 9 8.5 12 5C12 5 11.5 9 14 10.5C14 10.5 13 7.5 15 6C15 6 18 9 18 13C18 17.5 16 21 12 21Z" fill="url(#fireGrad)" />
      {/* Inner highlight */}
      <path d="M12 19C9.5 19 8 17 8 15C8 13 9.5 11.5 10.5 11C10.5 11 10 13 11.5 14C11.5 14 11.5 12 13 11C13 11 15 13 15 15C15 17 13.5 19 12 19Z" fill="#FFD700" opacity="0.7" />
    </svg>
  ),

  star: (
    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Shadow/outline for depth */}
      <path d="M12 2.5L14.6 9.3H21.8L16.1 13.6L18.3 20.5L12 16.5L5.7 20.5L7.9 13.6L2.2 9.3H9.4L12 2.5Z" fill="#D97706" transform="translate(0.5, 0.8)" />
      {/* Main star */}
      <path d="M12 2.5L14.6 9.3H21.8L16.1 13.6L18.3 20.5L12 16.5L5.7 20.5L7.9 13.6L2.2 9.3H9.4L12 2.5Z" fill="#F59E0B" />
      {/* Shine */}
      <path d="M12 4.5L13.8 9.8L14.2 10.3H19.5L15.2 13.3L14.9 14L16.5 19L12 16.2V4.5Z" fill="#FCD34D" opacity="0.6" />
    </svg>
  ),

  trophy: (
    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Cup body */}
      <path d="M6 3H18V12C18 15.31 15.31 18 12 18C8.69 18 6 15.31 6 12V3Z" fill="#F59E0B" />
      {/* Cup shine */}
      <path d="M8 3H11V12C11 14 9.5 15.5 8 16.5C7 15.5 6 14 6 12V3H8Z" fill="#FCD34D" opacity="0.5" />
      {/* Left handle */}
      <path d="M6 5H3.5C3.5 5 2 5.5 2 7.5C2 9.5 3.5 10 3.5 10H6" stroke="#D97706" strokeWidth="2.5" strokeLinecap="round" fill="none" />
      {/* Right handle */}
      <path d="M18 5H20.5C20.5 5 22 5.5 22 7.5C22 9.5 20.5 10 20.5 10H18" stroke="#D97706" strokeWidth="2.5" strokeLinecap="round" fill="none" />
      {/* Base stem */}
      <rect x="10.5" y="18" width="3" height="2.5" rx="0.5" fill="#D97706" />
      {/* Base plate */}
      <rect x="7.5" y="20.5" width="9" height="1.5" rx="0.75" fill="#D97706" />
      {/* Star on cup */}
      <path d="M12 6L12.8 8.4H15.3L13.3 9.8L14 12.2L12 10.8L10 12.2L10.7 9.8L8.7 8.4H11.2L12 6Z" fill="white" opacity="0.85" />
    </svg>
  ),

  book: (
    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Book cover */}
      <rect x="3" y="3" width="18" height="17" rx="2.5" fill="#FF6B35" />
      {/* Spine */}
      <rect x="3" y="3" width="4" height="17" rx="2" fill="#CC4A1A" />
      {/* Pages edge */}
      <rect x="18" y="4" width="2" height="15" rx="1" fill="#FFD5C2" />
      {/* Lines */}
      <rect x="9" y="8" width="8" height="1.5" rx="0.75" fill="white" opacity="0.8" />
      <rect x="9" y="11" width="8" height="1.5" rx="0.75" fill="white" opacity="0.8" />
      <rect x="9" y="14" width="5.5" height="1.5" rx="0.75" fill="white" opacity="0.6" />
    </svg>
  ),

  music: (
    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Note stem */}
      <rect x="11" y="3" width="8" height="2" rx="1" fill="#EC4899" />
      <rect x="17.5" y="3" width="2" height="10" rx="1" fill="#EC4899" />
      <rect x="11" y="3" width="2" height="12" rx="1" fill="#EC4899" />
      {/* Left note head */}
      <ellipse cx="11.5" cy="16.5" rx="3.5" ry="2.5" fill="#EC4899" transform="rotate(-15 11.5 16.5)" />
      {/* Right note head */}
      <ellipse cx="18" cy="14" rx="3.5" ry="2.5" fill="#BE185D" transform="rotate(-15 18 14)" />
      {/* Shine on left head */}
      <ellipse cx="10.5" cy="15.5" rx="1.2" ry="0.9" fill="#F9A8D4" opacity="0.6" transform="rotate(-15 10.5 15.5)" />
    </svg>
  ),

  video: (
    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Circle background */}
      <circle cx="12" cy="12" r="10" fill="#3B82F6" />
      {/* Shine */}
      <circle cx="9" cy="7.5" r="3" fill="white" opacity="0.15" />
      {/* Play triangle */}
      <path d="M9.5 8L17 12L9.5 16V8Z" fill="white" />
    </svg>
  ),

  puzzle: (
    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Main puzzle piece */}
      <path d="M3 3H11V7C11 7 9.5 7 9.5 8.5C9.5 10 11 10 11 10V14H7C7 14 7 12.5 5.5 12.5C4 12.5 4 14 4 14H3V3Z" fill="#7C3AED" />
      {/* Adjacent piece */}
      <path d="M11 3H21V11H17C17 11 17 9.5 15.5 9.5C14 9.5 14 11 14 11H11V7C11 7 12.5 7 12.5 5.5C12.5 4 11 4 11 3Z" fill="#9333EA" />
      {/* Bottom left piece */}
      <path d="M3 14H7C7 14 7 15.5 8.5 15.5C10 15.5 10 14 10 14H11V21H3V14Z" fill="#6D28D9" />
      {/* Bottom right piece */}
      <path d="M11 14H14C14 14 14 12.5 15.5 12.5C17 12.5 17 14 17 14H21V21H11V14Z" fill="#7C3AED" />
    </svg>
  ),

  heart: (
    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Shadow for depth */}
      <path d="M12 21.5C12 21.5 3 15.5 3 9.5C3 6.5 5.5 4 8.5 4C10 4 11.3 4.7 12 5.8C12.7 4.7 14 4 15.5 4C18.5 4 21 6.5 21 9.5C21 15.5 12 21.5 12 21.5Z" fill="#BE123C" transform="translate(0, 0.8)" />
      {/* Main heart */}
      <path d="M12 21.5C12 21.5 3 15.5 3 9.5C3 6.5 5.5 4 8.5 4C10 4 11.3 4.7 12 5.8C12.7 4.7 14 4 15.5 4C18.5 4 21 6.5 21 9.5C21 15.5 12 21.5 12 21.5Z" fill="#F43F5E" />
      {/* Shine */}
      <path d="M8 6C6.5 6 5.5 7.5 5.5 8.5C5.5 9 5.8 9 6 8.8C6.3 8 7 7 8 6.8C8.5 6.7 8.5 6 8 6Z" fill="white" opacity="0.5" />
    </svg>
  ),

  check: (
    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Circle */}
      <circle cx="12" cy="12" r="10" fill="#22C55E" />
      {/* Shadow circle */}
      <circle cx="12" cy="12.5" r="10" fill="#15803D" opacity="0.3" />
      <circle cx="12" cy="12" r="10" fill="#22C55E" />
      {/* Check mark */}
      <path d="M7 12L10.5 15.5L17 9" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  ),

  lock: (
    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Lock body */}
      <rect x="4" y="11" width="16" height="11" rx="3" fill="#94A3B8" />
      {/* Body shine */}
      <rect x="4" y="11" width="7" height="11" rx="3" fill="#CBD5E1" opacity="0.4" />
      {/* Shackle */}
      <path d="M8 11V8C8 5.8 9.8 4 12 4C14.2 4 16 5.8 16 8V11" stroke="#64748B" strokeWidth="3" strokeLinecap="round" fill="none" />
      {/* Keyhole */}
      <circle cx="12" cy="16" r="2" fill="#64748B" />
      <rect x="11" y="16" width="2" height="3" rx="1" fill="#64748B" />
    </svg>
  ),

  play: (
    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Circle background */}
      <circle cx="12" cy="12" r="10" fill="#22C55E" />
      {/* Shadow */}
      <circle cx="12" cy="12.8" r="10" fill="#15803D" opacity="0.25" />
      <circle cx="12" cy="12" r="10" fill="#22C55E" />
      {/* Shine */}
      <circle cx="9" cy="7.5" r="3" fill="white" opacity="0.15" />
      {/* Play triangle */}
      <path d="M10 8.5L17 12L10 15.5V8.5Z" fill="white" />
    </svg>
  ),

  mic: (
    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Mic body */}
      <rect x="8.5" y="2" width="7" height="12" rx="3.5" fill="#EC4899" />
      {/* Mic body shine */}
      <rect x="8.5" y="2" width="3.5" height="12" rx="3" fill="#F9A8D4" opacity="0.4" />
      {/* Stand arc */}
      <path d="M5 11C5 15.97 8.58 20 12 20C15.42 20 19 15.97 19 11" stroke="#EC4899" strokeWidth="2.5" strokeLinecap="round" fill="none" />
      {/* Stand line */}
      <line x1="12" y1="20" x2="12" y2="22.5" stroke="#EC4899" strokeWidth="2.5" strokeLinecap="round" />
      {/* Base */}
      <line x1="8" y1="22.5" x2="16" y2="22.5" stroke="#EC4899" strokeWidth="2.5" strokeLinecap="round" />
    </svg>
  ),

  logout: (
    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Door frame */}
      <rect x="3" y="3" width="12" height="18" rx="2" fill="#CBD5E1" />
      {/* Door panel */}
      <rect x="5" y="5" width="8" height="14" rx="1" fill="#E2E8F0" />
      {/* Door knob */}
      <circle cx="11.5" cy="12" r="1" fill="#94A3B8" />
      {/* Arrow shaft */}
      <line x1="13" y1="12" x2="21" y2="12" stroke="#94A3B8" strokeWidth="2.5" strokeLinecap="round" />
      {/* Arrow head */}
      <path d="M17.5 8.5L21.5 12L17.5 15.5" stroke="#94A3B8" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" fill="none" />
    </svg>
  ),
};

export function KidIcon({ name, size = 24, className = '' }: KidIconProps) {
  const icon = icons[name];
  if (!icon) return null;

  return (
    <span
      className={className}
      style={{ display: 'inline-flex', width: size, height: size, flexShrink: 0 }}
    >
      {React.cloneElement(icon, { width: size, height: size } as React.SVGProps<SVGSVGElement>)}
    </span>
  );
}
