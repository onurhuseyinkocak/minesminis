import { useEffect } from 'react';
import { speak } from '../services/ttsService';
import './WordIllustration.css';

// ── Illustration sub-components ───────────────────────────────────────────────

const Cat = ({ size }: { size: number }) => (
  <svg width={size} height={size} viewBox="0 0 100 100" aria-hidden="true">
    <circle cx="50" cy="55" r="30" fill="#f4a261" />
    <polygon points="25,30 35,50 15,50" fill="#f4a261" />
    <polygon points="75,30 65,50 85,50" fill="#f4a261" />
    <circle cx="40" cy="52" r="4" fill="#333" />
    <circle cx="60" cy="52" r="4" fill="#333" />
    <ellipse cx="50" cy="62" rx="5" ry="3" fill="#e76f51" />
    <line x1="30" y1="60" x2="10" y2="55" stroke="#333" strokeWidth="1.5" />
    <line x1="30" y1="62" x2="10" y2="62" stroke="#333" strokeWidth="1.5" />
    <line x1="70" y1="60" x2="90" y2="55" stroke="#333" strokeWidth="1.5" />
    <line x1="70" y1="62" x2="90" y2="62" stroke="#333" strokeWidth="1.5" />
  </svg>
);

const Dog = ({ size }: { size: number }) => (
  <svg width={size} height={size} viewBox="0 0 100 100" aria-hidden="true">
    <circle cx="50" cy="56" r="28" fill="#c8a46e" />
    <ellipse cx="28" cy="38" rx="10" ry="16" fill="#c8a46e" />
    <ellipse cx="72" cy="38" rx="10" ry="16" fill="#c8a46e" />
    <circle cx="40" cy="54" r="4" fill="#333" />
    <circle cx="60" cy="54" r="4" fill="#333" />
    <ellipse cx="50" cy="65" rx="12" ry="8" fill="#a0785a" />
    <ellipse cx="50" cy="67" rx="6" ry="4" fill="#e76f51" />
    <circle cx="41" cy="53" r="1.5" fill="#fff" />
    <circle cx="61" cy="53" r="1.5" fill="#fff" />
  </svg>
);

const Bird = ({ size }: { size: number }) => (
  <svg width={size} height={size} viewBox="0 0 100 100" aria-hidden="true">
    <ellipse cx="50" cy="58" rx="22" ry="18" fill="#4ecdc4" />
    <circle cx="62" cy="38" r="16" fill="#4ecdc4" />
    <polygon points="74,36 88,32 76,44" fill="#f4a261" />
    <circle cx="66" cy="34" r="3" fill="#333" />
    <circle cx="67" cy="33" r="1" fill="#fff" />
    <path d="M28 56 Q15 45 20 35 Q30 50 38 54" fill="#2ab5ad" />
    <path d="M72 56 Q85 45 80 35 Q70 50 62 54" fill="#2ab5ad" />
    <line x1="45" y1="76" x2="40" y2="88" stroke="#f4a261" strokeWidth="3" strokeLinecap="round" />
    <line x1="55" y1="76" x2="60" y2="88" stroke="#f4a261" strokeWidth="3" strokeLinecap="round" />
  </svg>
);

const Fish = ({ size }: { size: number }) => (
  <svg width={size} height={size} viewBox="0 0 100 100" aria-hidden="true">
    <ellipse cx="46" cy="50" rx="28" ry="18" fill="#6c8ebf" />
    <polygon points="74,50 90,35 90,65" fill="#5a7aad" />
    <circle cx="32" cy="45" r="4" fill="#fff" />
    <circle cx="32" cy="45" r="2" fill="#333" />
    <path d="M50 40 Q56 50 50 60" fill="none" stroke="#5a7aad" strokeWidth="1.5" />
    <path d="M58 38 Q64 50 58 62" fill="none" stroke="#5a7aad" strokeWidth="1.5" />
    <path d="M30 54 Q46 64 62 54" fill="none" stroke="#5a7aad" strokeWidth="2" />
  </svg>
);

const Apple = ({ size }: { size: number }) => (
  <svg width={size} height={size} viewBox="0 0 100 100" aria-hidden="true">
    <path d="M50 28 Q30 18 20 38 Q12 55 22 72 Q32 88 50 88 Q68 88 78 72 Q88 55 80 38 Q70 18 50 28Z" fill="#e74c3c" />
    <path d="M50 28 Q58 15 68 12 Q66 22 60 28" fill="#2ecc71" />
    <line x1="50" y1="24" x2="50" y2="14" stroke="#795548" strokeWidth="3" strokeLinecap="round" />
    <path d="M30 50 Q50 42 70 50" fill="none" stroke="#c0392b" strokeWidth="1.5" />
    <ellipse cx="38" cy="42" rx="6" ry="10" fill="#ef5350" opacity="0.5" />
  </svg>
);

const Banana = ({ size }: { size: number }) => (
  <svg width={size} height={size} viewBox="0 0 100 100" aria-hidden="true">
    <path d="M25 75 Q20 55 30 35 Q45 12 70 20 Q82 25 80 35 Q75 32 60 32 Q38 32 35 60 Q33 72 30 78Z" fill="#f9ca24" />
    <path d="M25 75 Q20 55 30 35" fill="none" stroke="#f0b800" strokeWidth="3" strokeLinecap="round" />
    <path d="M30 78 Q38 82 45 78 Q50 74 48 68" fill="#f9ca24" />
    <ellipse cx="68" cy="26" rx="10" ry="6" fill="#7d6608" transform="rotate(-20 68 26)" />
    <path d="M36 48 Q50 44 62 50" fill="none" stroke="#f0b800" strokeWidth="2" />
  </svg>
);

const Bread = ({ size }: { size: number }) => (
  <svg width={size} height={size} viewBox="0 0 100 100" aria-hidden="true">
    <ellipse cx="50" cy="55" rx="38" ry="24" fill="#d4a574" />
    <ellipse cx="50" cy="45" rx="38" ry="22" fill="#e8c49a" />
    <ellipse cx="50" cy="42" rx="35" ry="18" fill="#f5deb3" />
    <path d="M15 48 Q50 38 85 48" fill="none" stroke="#d4a574" strokeWidth="2" />
    <ellipse cx="35" cy="43" rx="6" ry="4" fill="#e8c49a" opacity="0.6" />
    <ellipse cx="55" cy="40" rx="7" ry="4" fill="#e8c49a" opacity="0.6" />
    <ellipse cx="70" cy="44" rx="5" ry="3" fill="#e8c49a" opacity="0.6" />
  </svg>
);

const Milk = ({ size }: { size: number }) => (
  <svg width={size} height={size} viewBox="0 0 100 100" aria-hidden="true">
    <rect x="30" y="32" width="40" height="52" rx="8" fill="#fff" stroke="#ddd" strokeWidth="2" />
    <rect x="30" y="20" width="40" height="18" rx="6" fill="#e0e0e0" />
    <rect x="38" y="14" width="24" height="10" rx="4" fill="#bdbdbd" />
    <ellipse cx="50" cy="76" rx="16" ry="6" fill="#e3f2fd" />
    <path d="M34 55 Q50 48 66 55" fill="none" stroke="#90caf9" strokeWidth="2" />
    <rect x="36" y="34" width="28" height="6" rx="2" fill="#1976d2" opacity="0.8" />
    <circle cx="50" cy="46" r="4" fill="#1976d2" opacity="0.4" />
  </svg>
);

const Chair = ({ size }: { size: number }) => (
  <svg width={size} height={size} viewBox="0 0 100 100" aria-hidden="true">
    <rect x="20" y="15" width="60" height="28" rx="4" fill="#8d6e63" />
    <rect x="20" y="43" width="60" height="10" rx="3" fill="#a1887f" />
    <rect x="22" y="53" width="10" height="35" rx="3" fill="#8d6e63" />
    <rect x="68" y="53" width="10" height="35" rx="3" fill="#8d6e63" />
    <rect x="28" y="68" width="44" height="8" rx="3" fill="#a1887f" />
  </svg>
);

const Table = ({ size }: { size: number }) => (
  <svg width={size} height={size} viewBox="0 0 100 100" aria-hidden="true">
    <rect x="10" y="35" width="80" height="12" rx="4" fill="#a1887f" />
    <rect x="18" y="47" width="10" height="40" rx="3" fill="#8d6e63" />
    <rect x="72" y="47" width="10" height="40" rx="3" fill="#8d6e63" />
    <rect x="10" y="30" width="80" height="8" rx="4" fill="#bcaaa4" />
  </svg>
);

const Book = ({ size }: { size: number }) => (
  <svg width={size} height={size} viewBox="0 0 100 100" aria-hidden="true">
    <rect x="15" y="15" width="70" height="75" rx="4" fill="#1565c0" />
    <rect x="20" y="15" width="60" height="75" rx="3" fill="#e3f2fd" />
    <line x1="50" y1="15" x2="50" y2="90" stroke="#90caf9" strokeWidth="3" />
    <rect x="24" y="25" width="22" height="3" rx="1.5" fill="#1565c0" opacity="0.5" />
    <rect x="24" y="32" width="18" height="3" rx="1.5" fill="#1565c0" opacity="0.5" />
    <rect x="24" y="39" width="20" height="3" rx="1.5" fill="#1565c0" opacity="0.5" />
    <rect x="54" y="25" width="22" height="3" rx="1.5" fill="#1565c0" opacity="0.5" />
    <rect x="54" y="32" width="18" height="3" rx="1.5" fill="#1565c0" opacity="0.5" />
    <rect x="54" y="39" width="20" height="3" rx="1.5" fill="#1565c0" opacity="0.5" />
  </svg>
);

const Sun = ({ size }: { size: number }) => (
  <svg width={size} height={size} viewBox="0 0 100 100" aria-hidden="true">
    <circle cx="50" cy="50" r="20" fill="#f9ca24" />
    <line x1="50" y1="10" x2="50" y2="22" stroke="#f9ca24" strokeWidth="4" strokeLinecap="round" />
    <line x1="50" y1="78" x2="50" y2="90" stroke="#f9ca24" strokeWidth="4" strokeLinecap="round" />
    <line x1="10" y1="50" x2="22" y2="50" stroke="#f9ca24" strokeWidth="4" strokeLinecap="round" />
    <line x1="78" y1="50" x2="90" y2="50" stroke="#f9ca24" strokeWidth="4" strokeLinecap="round" />
    <line x1="21" y1="21" x2="30" y2="30" stroke="#f9ca24" strokeWidth="4" strokeLinecap="round" />
    <line x1="70" y1="70" x2="79" y2="79" stroke="#f9ca24" strokeWidth="4" strokeLinecap="round" />
    <line x1="79" y1="21" x2="70" y2="30" stroke="#f9ca24" strokeWidth="4" strokeLinecap="round" />
    <line x1="21" y1="79" x2="30" y2="70" stroke="#f9ca24" strokeWidth="4" strokeLinecap="round" />
  </svg>
);

const Moon = ({ size }: { size: number }) => (
  <svg width={size} height={size} viewBox="0 0 100 100" aria-hidden="true">
    <path d="M60 15 Q35 20 30 50 Q25 78 55 85 Q30 88 18 65 Q8 42 25 22 Q38 8 60 15Z" fill="#ffd54f" />
    <circle cx="68" cy="25" r="3" fill="#fff9c4" opacity="0.8" />
    <circle cx="80" cy="45" r="2" fill="#fff9c4" opacity="0.8" />
    <circle cx="75" cy="65" r="2.5" fill="#fff9c4" opacity="0.8" />
  </svg>
);

const Star = ({ size }: { size: number }) => (
  <svg width={size} height={size} viewBox="0 0 100 100" aria-hidden="true">
    <polygon
      points="50,8 61,36 92,36 68,56 77,84 50,65 23,84 32,56 8,36 39,36"
      fill="#f9ca24"
      stroke="#f0b800"
      strokeWidth="2"
    />
    <polygon
      points="50,22 57,40 77,40 62,52 68,70 50,58 32,70 38,52 23,40 43,40"
      fill="#ffd54f"
    />
  </svg>
);

const Tree = ({ size }: { size: number }) => (
  <svg width={size} height={size} viewBox="0 0 100 100" aria-hidden="true">
    <polygon points="50,10 78,50 22,50" fill="#4caf50" />
    <polygon points="50,28 82,65 18,65" fill="#388e3c" />
    <rect x="42" y="65" width="16" height="22" rx="2" fill="#795548" />
    <circle cx="38" cy="32" r="4" fill="#81c784" opacity="0.7" />
    <circle cx="62" cy="38" r="3" fill="#81c784" opacity="0.7" />
  </svg>
);

const House = ({ size }: { size: number }) => (
  <svg width={size} height={size} viewBox="0 0 100 100" aria-hidden="true">
    <polygon points="50,10 90,48 10,48" fill="#e57373" />
    <rect x="15" y="46" width="70" height="44" rx="2" fill="#fff9c4" />
    <rect x="38" y="64" width="24" height="26" rx="2" fill="#a1887f" />
    <rect x="22" y="55" width="18" height="16" rx="2" fill="#90caf9" />
    <rect x="60" y="55" width="18" height="16" rx="2" fill="#90caf9" />
    <line x1="31" y1="55" x2="31" y2="71" stroke="#64b5f6" strokeWidth="1.5" />
    <line x1="22" y1="63" x2="40" y2="63" stroke="#64b5f6" strokeWidth="1.5" />
  </svg>
);

const Car = ({ size }: { size: number }) => (
  <svg width={size} height={size} viewBox="0 0 100 100" aria-hidden="true">
    <rect x="8" y="52" width="84" height="28" rx="6" fill="#e53935" />
    <path d="M22 52 Q30 28 45 26 L55 26 Q70 28 78 52Z" fill="#ef9a9a" />
    <circle cx="25" cy="82" r="10" fill="#333" />
    <circle cx="25" cy="82" r="5" fill="#bdbdbd" />
    <circle cx="75" cy="82" r="10" fill="#333" />
    <circle cx="75" cy="82" r="5" fill="#bdbdbd" />
    <rect x="32" y="30" width="18" height="20" rx="2" fill="#90caf9" opacity="0.8" />
    <rect x="52" y="30" width="18" height="20" rx="2" fill="#90caf9" opacity="0.8" />
    <rect x="8" y="62" width="10" height="8" rx="2" fill="#fff9c4" />
    <rect x="82" y="62" width="10" height="8" rx="2" fill="#ffcc02" />
  </svg>
);

const Ball = ({ size }: { size: number }) => (
  <svg width={size} height={size} viewBox="0 0 100 100" aria-hidden="true">
    <circle cx="50" cy="50" r="38" fill="#f44336" />
    <path d="M20 28 Q50 20 80 28" fill="none" stroke="#fff" strokeWidth="3" />
    <path d="M12 50 Q50 40 88 50" fill="none" stroke="#fff" strokeWidth="3" />
    <path d="M20 72 Q50 80 80 72" fill="none" stroke="#fff" strokeWidth="3" />
    <path d="M50 12 Q40 50 50 88" fill="none" stroke="#fff" strokeWidth="3" />
  </svg>
);

const Hat = ({ size }: { size: number }) => (
  <svg width={size} height={size} viewBox="0 0 100 100" aria-hidden="true">
    <ellipse cx="50" cy="68" rx="42" ry="10" fill="#1a237e" />
    <rect x="28" y="28" width="44" height="42" rx="8" fill="#283593" />
    <ellipse cx="50" cy="28" rx="22" ry="7" fill="#3949ab" />
    <rect x="28" y="52" width="44" height="6" rx="2" fill="#f9ca24" />
    <ellipse cx="50" cy="68" rx="38" ry="7" fill="#3949ab" />
  </svg>
);

const Shoe = ({ size }: { size: number }) => (
  <svg width={size} height={size} viewBox="0 0 100 100" aria-hidden="true">
    <path d="M10 70 Q10 55 25 50 L45 45 L55 32 Q60 25 68 28 Q74 30 72 38 L65 45 L80 45 Q95 48 92 65 Q90 75 78 76 Z" fill="#5d4037" />
    <path d="M55 32 Q60 25 68 28 Q74 30 72 38 L65 45 L55 45 Z" fill="#795548" />
    <path d="M20 60 Q35 54 55 54" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round" />
    <path d="M18 67 Q40 62 70 64" fill="none" stroke="#795548" strokeWidth="1.5" />
  </svg>
);

const Hand = ({ size }: { size: number }) => (
  <svg width={size} height={size} viewBox="0 0 100 100" aria-hidden="true">
    <rect x="36" y="50" width="12" height="35" rx="6" fill="#f4a261" />
    <rect x="24" y="42" width="11" height="38" rx="5.5" fill="#f4a261" />
    <rect x="48" y="42" width="11" height="36" rx="5.5" fill="#f4a261" />
    <rect x="60" y="46" width="10" height="30" rx="5" fill="#f4a261" />
    <path d="M70 56 Q78 48 75 40 Q72 34 66 38 L66 46" fill="#f4a261" />
    <rect x="22" y="68" width="50" height="18" rx="8" fill="#f4a261" />
  </svg>
);

const Eye = ({ size }: { size: number }) => (
  <svg width={size} height={size} viewBox="0 0 100 100" aria-hidden="true">
    <path d="M10 50 Q35 20 50 20 Q65 20 90 50 Q65 80 50 80 Q35 80 10 50Z" fill="#fff" stroke="#ccc" strokeWidth="2" />
    <circle cx="50" cy="50" r="16" fill="#1976d2" />
    <circle cx="50" cy="50" r="9" fill="#333" />
    <circle cx="44" cy="44" r="4" fill="#fff" />
    <circle cx="56" cy="54" r="2" fill="#fff" opacity="0.6" />
    <path d="M10 50 Q35 20 50 20 Q65 20 90 50" fill="none" stroke="#555" strokeWidth="2" />
  </svg>
);

const Ear = ({ size }: { size: number }) => (
  <svg width={size} height={size} viewBox="0 0 100 100" aria-hidden="true">
    <path d="M38 20 Q20 20 20 50 Q20 80 38 80 Q50 80 55 68 Q48 65 45 55 Q52 52 52 42 Q52 28 38 20Z" fill="#f4a261" />
    <path d="M38 25 Q25 25 25 50 Q25 74 38 74" fill="none" stroke="#e76f51" strokeWidth="2" />
    <path d="M42 38 Q46 44 44 52 Q42 60 48 65" fill="none" stroke="#e76f51" strokeWidth="3" strokeLinecap="round" />
  </svg>
);

const Nose = ({ size }: { size: number }) => (
  <svg width={size} height={size} viewBox="0 0 100 100" aria-hidden="true">
    <path d="M50 18 Q44 35 36 55 Q28 72 32 78 Q38 84 50 80 Q62 84 68 78 Q72 72 64 55 Q56 35 50 18Z" fill="#f4a261" />
    <ellipse cx="38" cy="76" rx="10" ry="6" fill="#e76f51" />
    <ellipse cx="62" cy="76" rx="10" ry="6" fill="#e76f51" />
    <ellipse cx="38" cy="75" rx="5" ry="3" fill="#c0392b" opacity="0.4" />
    <ellipse cx="62" cy="75" rx="5" ry="3" fill="#c0392b" opacity="0.4" />
  </svg>
);

const Rabbit = ({ size }: { size: number }) => (
  <svg width={size} height={size} viewBox="0 0 100 100" aria-hidden="true">
    {/* ears */}
    <ellipse cx="36" cy="28" rx="8" ry="20" fill="#f0e0d0" />
    <ellipse cx="64" cy="28" rx="8" ry="20" fill="#f0e0d0" />
    <ellipse cx="36" cy="28" rx="4" ry="15" fill="#e8a0a0" />
    <ellipse cx="64" cy="28" rx="4" ry="15" fill="#e8a0a0" />
    {/* body */}
    <ellipse cx="50" cy="68" rx="26" ry="22" fill="#f0e0d0" />
    {/* head */}
    <circle cx="50" cy="50" r="18" fill="#f0e0d0" />
    {/* eyes */}
    <circle cx="43" cy="47" r="3" fill="#e8a0a0" />
    <circle cx="57" cy="47" r="3" fill="#e8a0a0" />
    <circle cx="43" cy="46" r="1.5" fill="#333" />
    <circle cx="57" cy="46" r="1.5" fill="#333" />
    {/* nose */}
    <ellipse cx="50" cy="54" rx="3" ry="2" fill="#e8a0a0" />
    {/* mouth */}
    <path d="M47 56 Q50 59 53 56" fill="none" stroke="#c0808080" strokeWidth="1.5" />
    {/* tail */}
    <circle cx="76" cy="80" r="6" fill="#fff" />
  </svg>
);

const Elephant = ({ size }: { size: number }) => (
  <svg width={size} height={size} viewBox="0 0 100 100" aria-hidden="true">
    {/* body */}
    <ellipse cx="52" cy="65" rx="30" ry="22" fill="#9e9e9e" />
    {/* head */}
    <circle cx="30" cy="45" r="20" fill="#9e9e9e" />
    {/* ear */}
    <ellipse cx="18" cy="42" rx="10" ry="14" fill="#bdbdbd" />
    <ellipse cx="18" cy="42" rx="6" ry="10" fill="#e0c8c8" />
    {/* trunk */}
    <path d="M20 58 Q10 65 12 78 Q14 86 22 84" fill="none" stroke="#9e9e9e" strokeWidth="8" strokeLinecap="round" />
    {/* eye */}
    <circle cx="28" cy="40" r="4" fill="#fff" />
    <circle cx="28" cy="40" r="2" fill="#333" />
    <circle cx="27" cy="39" r="1" fill="#fff" />
    {/* tusk */}
    <path d="M22 58 Q16 62 18 70" fill="none" stroke="#f5f5dc" strokeWidth="3" strokeLinecap="round" />
    {/* legs */}
    <rect x="28" y="82" width="10" height="14" rx="5" fill="#757575" />
    <rect x="42" y="82" width="10" height="14" rx="5" fill="#757575" />
    <rect x="56" y="82" width="10" height="14" rx="5" fill="#757575" />
    <rect x="68" y="80" width="10" height="14" rx="5" fill="#757575" />
    {/* tail */}
    <path d="M82 62 Q90 55 88 68" fill="none" stroke="#757575" strokeWidth="3" strokeLinecap="round" />
  </svg>
);

const Clock = ({ size }: { size: number }) => (
  <svg width={size} height={size} viewBox="0 0 100 100" aria-hidden="true">
    {/* clock body */}
    <circle cx="50" cy="52" r="36" fill="#fff" stroke="#424242" strokeWidth="4" />
    <circle cx="50" cy="52" r="32" fill="#fafafa" />
    {/* hour markers */}
    <line x1="50" y1="22" x2="50" y2="28" stroke="#424242" strokeWidth="2.5" strokeLinecap="round" />
    <line x1="50" y1="76" x2="50" y2="82" stroke="#424242" strokeWidth="2.5" strokeLinecap="round" />
    <line x1="18" y1="52" x2="24" y2="52" stroke="#424242" strokeWidth="2.5" strokeLinecap="round" />
    <line x1="76" y1="52" x2="82" y2="52" stroke="#424242" strokeWidth="2.5" strokeLinecap="round" />
    {/* hour hand */}
    <line x1="50" y1="52" x2="50" y2="34" stroke="#212121" strokeWidth="3.5" strokeLinecap="round" />
    {/* minute hand */}
    <line x1="50" y1="52" x2="66" y2="52" stroke="#212121" strokeWidth="2.5" strokeLinecap="round" />
    {/* center dot */}
    <circle cx="50" cy="52" r="3" fill="#e53935" />
    {/* bell top */}
    <rect x="44" y="14" width="12" height="6" rx="2" fill="#424242" />
  </svg>
);

const Pizza = ({ size }: { size: number }) => (
  <svg width={size} height={size} viewBox="0 0 100 100" aria-hidden="true">
    {/* pizza slice */}
    <polygon points="50,10 10,90 90,90" fill="#f9ca24" />
    <polygon points="50,10 10,90 90,90" fill="#e8a800" opacity="0.3" />
    {/* crust */}
    <path d="M10 90 Q50 100 90 90" fill="#d4a574" stroke="#b8860b" strokeWidth="2" />
    {/* tomato sauce */}
    <polygon points="50,22 18,82 82,82" fill="#e53935" opacity="0.85" />
    {/* cheese */}
    <polygon points="50,30 24,78 76,78" fill="#f9ca24" opacity="0.9" />
    {/* toppings - pepperoni circles */}
    <circle cx="50" cy="52" r="6" fill="#c62828" />
    <circle cx="38" cy="66" r="5" fill="#c62828" />
    <circle cx="62" cy="66" r="5" fill="#c62828" />
    {/* cheese holes */}
    <circle cx="44" cy="45" r="2" fill="#f0b800" opacity="0.7" />
    <circle cx="58" cy="58" r="2" fill="#f0b800" opacity="0.7" />
  </svg>
);

const Red = ({ size }: { size: number }) => (
  <svg width={size} height={size} viewBox="0 0 100 100" aria-hidden="true">
    <circle cx="50" cy="50" r="38" fill="#e53935" />
    <text x="50" y="60" textAnchor="middle" fontSize="28" fontWeight="bold" fill="#fff" fontFamily="sans-serif">RED</text>
  </svg>
);

const Blue = ({ size }: { size: number }) => (
  <svg width={size} height={size} viewBox="0 0 100 100" aria-hidden="true">
    <circle cx="50" cy="50" r="38" fill="#1e88e5" />
    <text x="50" y="60" textAnchor="middle" fontSize="24" fontWeight="bold" fill="#fff" fontFamily="sans-serif">BLUE</text>
  </svg>
);

const Green = ({ size }: { size: number }) => (
  <svg width={size} height={size} viewBox="0 0 100 100" aria-hidden="true">
    <circle cx="50" cy="50" r="38" fill="#43a047" />
    <text x="50" y="60" textAnchor="middle" fontSize="20" fontWeight="bold" fill="#fff" fontFamily="sans-serif">GREEN</text>
  </svg>
);

const One = ({ size }: { size: number }) => (
  <svg width={size} height={size} viewBox="0 0 100 100" aria-hidden="true">
    <circle cx="50" cy="50" r="38" fill="#7e57c2" />
    <text x="50" y="66" textAnchor="middle" fontSize="52" fontWeight="900" fill="#fff" fontFamily="sans-serif">1</text>
  </svg>
);

const Two = ({ size }: { size: number }) => (
  <svg width={size} height={size} viewBox="0 0 100 100" aria-hidden="true">
    <circle cx="50" cy="50" r="38" fill="#ef6c00" />
    <text x="50" y="66" textAnchor="middle" fontSize="52" fontWeight="900" fill="#fff" fontFamily="sans-serif">2</text>
  </svg>
);

const Three = ({ size }: { size: number }) => (
  <svg width={size} height={size} viewBox="0 0 100 100" aria-hidden="true">
    <circle cx="50" cy="50" r="38" fill="#00897b" />
    <text x="50" y="66" textAnchor="middle" fontSize="52" fontWeight="900" fill="#fff" fontFamily="sans-serif">3</text>
  </svg>
);

// ── Illustration map ──────────────────────────────────────────────────────────

type IllustrationComponent = React.FC<{ size: number }>;

const WORD_ILLUSTRATIONS: Record<string, IllustrationComponent> = {
  cat: Cat,
  dog: Dog,
  bird: Bird,
  fish: Fish,
  apple: Apple,
  banana: Banana,
  bread: Bread,
  milk: Milk,
  chair: Chair,
  table: Table,
  book: Book,
  sun: Sun,
  moon: Moon,
  star: Star,
  tree: Tree,
  house: House,
  car: Car,
  ball: Ball,
  hat: Hat,
  shoe: Shoe,
  hand: Hand,
  eye: Eye,
  ear: Ear,
  nose: Nose,
  rabbit: Rabbit,
  elephant: Elephant,
  clock: Clock,
  pizza: Pizza,
  red: Red,
  blue: Blue,
  green: Green,
  one: One,
  two: Two,
  three: Three,
};

// ── Fallback colors ───────────────────────────────────────────────────────────

const FALLBACK_COLORS = [
  '#e53935',
  '#8e24aa',
  '#1e88e5',
  '#00897b',
  '#f4511e',
  '#6d4c41',
  '#039be5',
  '#43a047',
];

function getFallbackColor(word: string): string {
  let hash = 0;
  for (let i = 0; i < word.length; i++) {
    hash = (hash * 31 + word.charCodeAt(i)) & 0xffffffff;
  }
  return FALLBACK_COLORS[Math.abs(hash) % FALLBACK_COLORS.length];
}

// ── Props ─────────────────────────────────────────────────────────────────────

export interface WordIllustrationProps {
  word: string;
  size?: number;
  className?: string;
  /** If true, speak the word aloud when the component mounts. */
  speakOnMount?: boolean;
}

// ── Component ─────────────────────────────────────────────────────────────────

export function WordIllustration({ word, size = 80, className, speakOnMount = false }: WordIllustrationProps) {
  const key = word.toLowerCase().trim();

  useEffect(() => {
    if (!speakOnMount || !word.trim()) return;
    const id = setTimeout(() => {
      speak(word, { lang: 'en-US', rate: 0.8, pitch: 1.1 });
    }, 350);
    return () => clearTimeout(id);
    // Only run on mount
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  const Illustration = WORD_ILLUSTRATIONS[key];

  const containerClass = ['word-illustration', className].filter(Boolean).join(' ');

  if (Illustration) {
    return (
      <span className={containerClass} style={{ width: size, height: size }}>
        <Illustration size={size} />
      </span>
    );
  }

  const letter = (key[0] ?? '?').toUpperCase();
  const bg = getFallbackColor(key);
  const fontSize = Math.round(size * 0.45);

  return (
    <span
      className={`${containerClass} word-illustration__fallback`}
      style={{
        width: size,
        height: size,
        fontSize,
        backgroundColor: bg,
      }}
      aria-label={word}
      role="img"
    >
      {letter}
    </span>
  );
}

WordIllustration.displayName = 'WordIllustration';
