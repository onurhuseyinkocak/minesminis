export type AvatarItemCategory = 'hat' | 'color' | 'accessory' | 'background' | 'frame';

export interface AvatarItem {
  id: string;
  category: AvatarItemCategory;
  name: string;
  nameTr: string;
  unlockType: 'free' | 'xp' | 'streak' | 'badge' | 'premium';
  unlockValue?: number;
  svgPath: string;
  color?: string;
  previewBg?: string;
}

// ── Colors ────────────────────────────────────────────────────────────────────

export const AVATAR_ITEMS: AvatarItem[] = [
  // ── Colors (6) ──────────────────────────────────────────────────────────────
  {
    id: 'color-blue',
    category: 'color',
    name: 'Sky Blue',
    nameTr: 'Gökyüzü Mavisi',
    unlockType: 'free',
    svgPath: '',
    color: '#4A90D9',
    previewBg: '#E8F4FF',
  },
  {
    id: 'color-orange',
    category: 'color',
    name: 'Sunset Orange',
    nameTr: 'Günbatımı Turuncusu',
    unlockType: 'free',
    svgPath: '',
    color: '#FF6B35',
    previewBg: '#FFF4EE',
  },
  {
    id: 'color-green',
    category: 'color',
    name: 'Forest Green',
    nameTr: 'Orman Yeşili',
    unlockType: 'xp',
    unlockValue: 50,
    svgPath: '',
    color: '#2D9E6B',
    previewBg: '#E6F7F0',
  },
  {
    id: 'color-purple',
    category: 'color',
    name: 'Purple Galaxy',
    nameTr: 'Mor Galaksi',
    unlockType: 'xp',
    unlockValue: 150,
    svgPath: '',
    color: '#8B5CF6',
    previewBg: '#EDE9FE',
  },
  {
    id: 'color-ocean',
    category: 'color',
    name: 'Ocean Blue',
    nameTr: 'Okyanus Mavisi',
    unlockType: 'xp',
    unlockValue: 100,
    svgPath: '',
    color: '#0EA5E9',
    previewBg: '#F0F9FF',
  },
  {
    id: 'color-cherry',
    category: 'color',
    name: 'Cherry Red',
    nameTr: 'Kiraz Kırmızısı',
    unlockType: 'xp',
    unlockValue: 200,
    svgPath: '',
    color: '#E11D48',
    previewBg: '#FFF1F2',
  },

  // ── Hats (8) ────────────────────────────────────────────────────────────────
  {
    id: 'hat-party',
    category: 'hat',
    name: 'Party Hat',
    nameTr: 'Parti Şapkası',
    unlockType: 'free',
    svgPath: `<polygon points="40,5 20,38 60,38" fill="#FF6B35" stroke="none"/>
      <line x1="20" y1="38" x2="60" y2="38" stroke="#FFD700" stroke-width="3"/>
      <circle cx="40" cy="5" r="3" fill="#FFD700"/>
      <circle cx="28" cy="20" r="2" fill="#FFD700"/>
      <circle cx="52" cy="24" r="2" fill="#FF6B35"/>`,
  },
  {
    id: 'hat-flower',
    category: 'hat',
    name: 'Flower Crown',
    nameTr: 'Çiçek Tacı',
    unlockType: 'free',
    svgPath: `<ellipse cx="40" cy="36" rx="22" ry="5" fill="#34D399" stroke="none"/>
      <circle cx="22" cy="30" r="7" fill="#F472B6"/>
      <circle cx="22" cy="30" r="3" fill="#FDE68A"/>
      <circle cx="40" cy="24" r="7" fill="#F472B6"/>
      <circle cx="40" cy="24" r="3" fill="#FDE68A"/>
      <circle cx="58" cy="30" r="7" fill="#F472B6"/>
      <circle cx="58" cy="30" r="3" fill="#FDE68A"/>
      <circle cx="31" cy="27" r="5" fill="#A78BFA"/>
      <circle cx="31" cy="27" r="2" fill="#FDE68A"/>
      <circle cx="49" cy="27" r="5" fill="#A78BFA"/>
      <circle cx="49" cy="27" r="2" fill="#FDE68A"/>`,
  },
  {
    id: 'hat-baseball',
    category: 'hat',
    name: 'Baseball Cap',
    nameTr: 'Beyzbol Şapkası',
    unlockType: 'xp',
    unlockValue: 100,
    svgPath: `<path d="M18,36 Q18,18 40,16 Q62,18 62,36 Z" fill="#3B82F6" stroke="none"/>
      <rect x="12" y="34" width="32" height="5" rx="2.5" fill="#2563EB"/>
      <line x1="40" y1="16" x2="40" y2="36" stroke="#2563EB" stroke-width="1.5" stroke-dasharray="3,2"/>`,
  },
  {
    id: 'hat-graduation',
    category: 'hat',
    name: 'Graduation Cap',
    nameTr: 'Mezuniyet Şapkası',
    unlockType: 'badge',
    unlockValue: 5,
    svgPath: `<polygon points="40,12 16,26 40,36 64,26" fill="#1E293B"/>
      <rect x="34" y="24" width="12" height="14" rx="2" fill="#1E293B"/>
      <rect x="36" y="36" width="8" height="3" rx="1.5" fill="#94A3B8"/>
      <line x1="56" y1="26" x2="60" y2="38" stroke="#FFD700" stroke-width="2"/>
      <circle cx="60" cy="40" r="3" fill="#FFD700"/>`,
  },
  {
    id: 'hat-wizard',
    category: 'hat',
    name: 'Wizard Hat',
    nameTr: 'Büyücü Şapkası',
    unlockType: 'streak',
    unlockValue: 7,
    svgPath: `<polygon points="40,4 22,38 58,38" fill="#6D28D9"/>
      <ellipse cx="40" cy="38" rx="18" ry="4" fill="#7C3AED"/>
      <circle cx="30" cy="22" r="3" fill="#FDE68A"/>
      <circle cx="50" cy="16" r="2" fill="#FDE68A"/>
      <circle cx="44" cy="28" r="1.5" fill="#FDE68A"/>
      <path d="M22,14 Q26,10 28,16" fill="none" stroke="#FDE68A" stroke-width="1.5"/>`,
  },
  {
    id: 'hat-explorer',
    category: 'hat',
    name: 'Explorer Hat',
    nameTr: 'Kaşif Şapkası',
    unlockType: 'badge',
    svgPath: `<ellipse cx="40" cy="36" rx="26" ry="6" fill="#92400E"/>
      <path d="M20,36 Q20,20 40,18 Q60,20 60,36 Z" fill="#B45309"/>
      <rect x="28" y="24" width="24" height="4" rx="2" fill="#FDE68A"/>`,
  },
  {
    id: 'hat-santa',
    category: 'hat',
    name: 'Santa Hat',
    nameTr: 'Noel Şapkası',
    unlockType: 'xp',
    unlockValue: 300,
    svgPath: `<polygon points="40,4 22,36 58,36" fill="#DC2626"/>
      <rect x="18" y="33" width="44" height="8" rx="4" fill="white"/>
      <circle cx="40" cy="4" r="5" fill="white"/>`,
  },
  {
    id: 'hat-crown',
    category: 'hat',
    name: 'Crown',
    nameTr: 'Taç',
    unlockType: 'premium',
    svgPath: `<polygon points="16,38 16,20 28,30 40,14 52,30 64,20 64,38" fill="#FFD700" stroke="#F59E0B" stroke-width="1.5" stroke-linejoin="round"/>
      <rect x="14" y="36" width="52" height="6" rx="3" fill="#F59E0B"/>
      <circle cx="40" cy="14" r="4" fill="#EF4444"/>
      <circle cx="22" cy="28" r="3" fill="#10B981"/>
      <circle cx="58" cy="28" r="3" fill="#3B82F6"/>`,
  },

  // ── Accessories (8) ─────────────────────────────────────────────────────────
  {
    id: 'acc-star',
    category: 'accessory',
    name: 'Star Badge',
    nameTr: 'Yıldız Rozeti',
    unlockType: 'free',
    svgPath: `<polygon points="40,32 43,42 54,42 45,48 48,58 40,52 32,58 35,48 26,42 37,42" fill="#FFD700" stroke="#F59E0B" stroke-width="1"/>`,
  },
  {
    id: 'acc-hearts',
    category: 'accessory',
    name: 'Hearts',
    nameTr: 'Kalpler',
    unlockType: 'free',
    svgPath: `<path d="M30,50 Q24,44 24,39 Q24,34 28,34 Q31,34 30,38 Q33,34 36,34 Q40,34 40,39 Q40,44 34,50 Z" fill="#F43F5E"/>
      <path d="M50,50 Q44,44 44,39 Q44,34 48,34 Q51,34 50,38 Q53,34 56,34 Q60,34 60,39 Q60,44 54,50 Z" fill="#F43F5E"/>`,
  },
  {
    id: 'acc-rainbow',
    category: 'accessory',
    name: 'Rainbow',
    nameTr: 'Gökkuşağı',
    unlockType: 'streak',
    unlockValue: 3,
    svgPath: `<path d="M15,55 Q15,28 40,28 Q65,28 65,55" fill="none" stroke="#EF4444" stroke-width="4" stroke-linecap="round"/>
      <path d="M19,55 Q19,32 40,32 Q61,32 61,55" fill="none" stroke="#F97316" stroke-width="3.5" stroke-linecap="round"/>
      <path d="M23,55 Q23,36 40,36 Q57,36 57,55" fill="none" stroke="#FBBF24" stroke-width="3" stroke-linecap="round"/>
      <path d="M27,55 Q27,40 40,40 Q53,40 53,55" fill="none" stroke="#4ADE80" stroke-width="2.5" stroke-linecap="round"/>
      <path d="M31,55 Q31,44 40,44 Q49,44 49,55" fill="none" stroke="#60A5FA" stroke-width="2" stroke-linecap="round"/>
      <path d="M35,55 Q35,48 40,48 Q45,48 45,55" fill="none" stroke="#A78BFA" stroke-width="1.5" stroke-linecap="round"/>`,
  },
  {
    id: 'acc-lightning',
    category: 'accessory',
    name: 'Lightning Bolt',
    nameTr: 'Şimşek',
    unlockType: 'xp',
    unlockValue: 200,
    svgPath: `<polygon points="46,30 36,46 42,46 34,66 56,44 48,44 58,30" fill="#FBBF24" stroke="#F59E0B" stroke-width="1"/>`,
  },
  {
    id: 'acc-glasses',
    category: 'accessory',
    name: 'Cool Glasses',
    nameTr: 'Havalı Gözlük',
    unlockType: 'xp',
    unlockValue: 100,
    svgPath: `<rect x="22" y="42" width="16" height="10" rx="5" fill="none" stroke="#1E293B" stroke-width="2.5"/>
      <rect x="42" y="42" width="16" height="10" rx="5" fill="none" stroke="#1E293B" stroke-width="2.5"/>
      <line x1="38" y1="47" x2="42" y2="47" stroke="#1E293B" stroke-width="2.5"/>
      <line x1="14" y1="44" x2="22" y2="46" stroke="#1E293B" stroke-width="2" stroke-linecap="round"/>
      <line x1="66" y1="44" x2="58" y2="46" stroke="#1E293B" stroke-width="2" stroke-linecap="round"/>`,
  },
  {
    id: 'acc-bowtie',
    category: 'accessory',
    name: 'Bow Tie',
    nameTr: 'Papyon',
    unlockType: 'premium',
    svgPath: `<polygon points="28,50 40,56 40,60 28,66" fill="#DC2626"/>
      <polygon points="52,50 40,56 40,60 52,66" fill="#DC2626"/>
      <circle cx="40" cy="58" r="4" fill="#EF4444"/>`,
  },
  {
    id: 'acc-scarf',
    category: 'accessory',
    name: 'Cozy Scarf',
    nameTr: 'Sıcak Atkı',
    unlockType: 'streak',
    unlockValue: 14,
    svgPath: `<path d="M24,56 Q40,52 56,56 Q58,62 56,64 Q40,60 24,64 Q22,58 24,56 Z" fill="#60A5FA"/>
      <path d="M44,56 Q46,62 42,70 L38,70 Q36,62 38,56" fill="#3B82F6"/>`,
  },
  {
    id: 'acc-wings',
    category: 'accessory',
    name: 'Angel Wings',
    nameTr: 'Melek Kanatları',
    unlockType: 'badge',
    svgPath: `<path d="M40,45 Q22,38 14,28 Q12,22 18,22 Q28,22 36,40 Z" fill="white" stroke="#E2E8F0" stroke-width="1"/>
      <path d="M40,45 Q58,38 66,28 Q68,22 62,22 Q52,22 44,40 Z" fill="white" stroke="#E2E8F0" stroke-width="1"/>
      <path d="M40,45 Q24,40 18,30 Q20,36 26,40" fill="none" stroke="#CBD5E1" stroke-width="1"/>
      <path d="M40,45 Q56,40 62,30 Q60,36 54,40" fill="none" stroke="#CBD5E1" stroke-width="1"/>`,
  },

  // ── Backgrounds (8) ─────────────────────────────────────────────────────────
  {
    id: 'bg-light',
    category: 'background',
    name: 'Sunny Default',
    nameTr: 'Güneşli',
    unlockType: 'free',
    svgPath: '',
    color: '#FFF8F2',
    previewBg: '#FFF8F2',
  },
  {
    id: 'bg-sunset',
    category: 'background',
    name: 'Sunset',
    nameTr: 'Günbatımı',
    unlockType: 'xp',
    unlockValue: 200,
    svgPath: '',
    color: 'linear-gradient(160deg, #FFB347 0%, #FF6B35 60%, #FF4081 100%)',
    previewBg: '#FFB347',
  },
  {
    id: 'bg-ocean',
    category: 'background',
    name: 'Ocean',
    nameTr: 'Okyanus',
    unlockType: 'xp',
    unlockValue: 300,
    svgPath: '',
    color: 'linear-gradient(160deg, #0EA5E9 0%, #0369A1 100%)',
    previewBg: '#0EA5E9',
  },
  {
    id: 'bg-space',
    category: 'background',
    name: 'Space',
    nameTr: 'Uzay',
    unlockType: 'xp',
    unlockValue: 500,
    svgPath: '',
    color: 'linear-gradient(160deg, #1E1B4B 0%, #312E81 50%, #4C1D95 100%)',
    previewBg: '#1E1B4B',
  },
  {
    id: 'bg-rainbow',
    category: 'background',
    name: 'Rainbow',
    nameTr: 'Gökkuşağı',
    unlockType: 'streak',
    unlockValue: 7,
    svgPath: '',
    color: 'linear-gradient(160deg, #F87171 0%, #FB923C 20%, #FCD34D 40%, #4ADE80 60%, #60A5FA 80%, #A78BFA 100%)',
    previewBg: '#F87171',
  },
  {
    id: 'bg-forest',
    category: 'background',
    name: 'Forest',
    nameTr: 'Orman',
    unlockType: 'premium',
    svgPath: '',
    color: 'linear-gradient(160deg, #14532D 0%, #166534 50%, #15803D 100%)',
    previewBg: '#14532D',
  },
  {
    id: 'bg-city',
    category: 'background',
    name: 'City Lights',
    nameTr: 'Şehir Işıkları',
    unlockType: 'premium',
    svgPath: '',
    color: 'linear-gradient(160deg, #0F172A 0%, #1E3A5F 60%, #1E40AF 100%)',
    previewBg: '#0F172A',
  },
  {
    id: 'bg-candy',
    category: 'background',
    name: 'Candy Land',
    nameTr: 'Şeker Diyarı',
    unlockType: 'badge',
    svgPath: '',
    color: 'linear-gradient(160deg, #FDE68A 0%, #FBCFE8 50%, #DDD6FE 100%)',
    previewBg: '#FDE68A',
  },
];
