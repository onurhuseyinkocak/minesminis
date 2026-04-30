type CoverProps = {
  kind?: string
  style?: React.CSSProperties
}

export default function Cover({ kind = 'rainbow', style }: CoverProps) {
  const wrap = { width: '100%', height: '100%', ...style }

  const scenes: Record<string, React.ReactNode> = {
    rainbow: (
      <svg viewBox="0 0 400 300" preserveAspectRatio="xMidYMid slice" style={wrap}>
        <defs><linearGradient id="sky-r" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#FFE3D5"/><stop offset="100%" stopColor="#FFD1BC"/></linearGradient></defs>
        <rect width="400" height="300" fill="url(#sky-r)"/>
        <circle cx="320" cy="70" r="36" fill="#FFC542"/>
        <path d="M50 240 A150 150 0 0 1 350 240" stroke="#FF6B4A" strokeWidth="22" fill="none" strokeLinecap="round"/>
        <path d="M70 240 A130 130 0 0 1 330 240" stroke="#FFC542" strokeWidth="22" fill="none" strokeLinecap="round"/>
        <path d="M90 240 A110 110 0 0 1 310 240" stroke="#1FB67A" strokeWidth="22" fill="none" strokeLinecap="round"/>
        <path d="M110 240 A90 90 0 0 1 290 240" stroke="#4D6BFF" strokeWidth="22" fill="none" strokeLinecap="round"/>
        <path d="M130 240 A70 70 0 0 1 270 240" stroke="#B59BFF" strokeWidth="22" fill="none" strokeLinecap="round"/>
        <ellipse cx="80" cy="100" rx="34" ry="14" fill="white" opacity="0.85"/>
        <ellipse cx="240" cy="60" rx="40" ry="16" fill="white" opacity="0.7"/>
      </svg>
    ),
    farm: (
      <svg viewBox="0 0 400 300" preserveAspectRatio="xMidYMid slice" style={wrap}>
        <rect width="400" height="180" fill="#C7E4FF"/>
        <rect y="180" width="400" height="120" fill="#86C780"/>
        <circle cx="60" cy="60" r="26" fill="#FFC542"/>
        <ellipse cx="120" cy="80" rx="40" ry="14" fill="white" opacity="0.8"/>
        <ellipse cx="280" cy="50" rx="46" ry="16" fill="white" opacity="0.85"/>
        <rect x="240" y="140" width="120" height="80" fill="#E8533F"/>
        <polygon points="240,140 300,100 360,140" fill="#C13E2C"/>
        <rect x="280" y="170" width="40" height="50" fill="#5A2B1F"/>
        <ellipse cx="110" cy="220" rx="50" ry="28" fill="white" stroke="#1B1B2A" strokeWidth="3"/>
        <circle cx="80" cy="200" r="18" fill="white" stroke="#1B1B2A" strokeWidth="3"/>
        <ellipse cx="125" cy="210" rx="14" ry="9" fill="#1B1B2A"/>
        <ellipse cx="95" cy="225" rx="10" ry="7" fill="#1B1B2A"/>
        <circle cx="74" cy="198" r="2.5" fill="#1B1B2A"/>
      </svg>
    ),
    family: (
      <svg viewBox="0 0 400 300" preserveAspectRatio="xMidYMid slice" style={wrap}>
        <rect width="400" height="300" fill="#FFE0EC"/>
        <circle cx="350" cy="60" r="28" fill="#FFC542"/>
        <path d="M200 70 C 160 30, 110 80, 200 130 C 290 80, 240 30, 200 70Z" fill="#FF8FB1"/>
        <circle cx="140" cy="200" r="28" fill="#FFD2B8"/>
        <rect x="116" y="225" width="48" height="60" rx="10" fill="#4D6BFF"/>
        <circle cx="220" cy="195" r="32" fill="#FFE0CC"/>
        <rect x="190" y="220" width="60" height="65" rx="10" fill="#FF6B4A"/>
        <circle cx="290" cy="220" r="20" fill="#FFD2B8"/>
        <rect x="274" y="240" width="32" height="45" rx="8" fill="#1FB67A"/>
      </svg>
    ),
    numbers: (
      <svg viewBox="0 0 400 300" preserveAspectRatio="xMidYMid slice" style={wrap}>
        <rect width="400" height="300" fill="#E8EDFF"/>
        <text x="60" y="120" fontFamily="Baloo 2" fontSize="100" fontWeight="800" fill="#FF6B4A">1</text>
        <text x="130" y="160" fontFamily="Baloo 2" fontSize="80" fontWeight="800" fill="#FFC542">2</text>
        <text x="180" y="120" fontFamily="Baloo 2" fontSize="90" fontWeight="800" fill="#1FB67A">3</text>
        <text x="240" y="180" fontFamily="Baloo 2" fontSize="90" fontWeight="800" fill="#4D6BFF">4</text>
        <text x="300" y="130" fontFamily="Baloo 2" fontSize="100" fontWeight="800" fill="#B59BFF">5</text>
        <circle cx="60" cy="200" r="14" fill="#FF8FB1"/>
        <circle cx="100" cy="240" r="10" fill="#FFC542"/>
        <circle cx="350" cy="220" r="12" fill="#1FB67A"/>
      </svg>
    ),
    school: (
      <svg viewBox="0 0 400 300" preserveAspectRatio="xMidYMid slice" style={wrap}>
        <rect width="400" height="300" fill="#FFF1CE"/>
        <g transform="translate(60,60) rotate(20)">
          <rect x="0" y="0" width="180" height="40" fill="#FFC542"/>
          <polygon points="180,0 220,20 180,40" fill="#FF6B4A"/>
          <rect x="-20" y="0" width="20" height="40" fill="#FF8FB1"/>
        </g>
        <rect x="220" y="180" width="140" height="100" rx="8" fill="#4D6BFF"/>
        <rect x="220" y="180" width="140" height="14" fill="#2540D9"/>
        <line x1="290" y1="200" x2="290" y2="280" stroke="white" strokeWidth="2"/>
        <circle cx="100" cy="220" r="36" fill="#E85530"/>
        <path d="M100 184 Q 110 170 124 178" stroke="#1FB67A" strokeWidth="6" fill="none" strokeLinecap="round"/>
      </svg>
    ),
    weather: (
      <svg viewBox="0 0 400 300" preserveAspectRatio="xMidYMid slice" style={wrap}>
        <rect width="400" height="300" fill="#C7E4FF"/>
        <circle cx="120" cy="120" r="50" fill="#FFC542"/>
        {[0,1,2,3,4,5,6,7].map(i => {
          const a = (i*45) * Math.PI/180
          return <line key={i} x1={120 + Math.cos(a)*65} y1={120 + Math.sin(a)*65} x2={120 + Math.cos(a)*85} y2={120 + Math.sin(a)*85} stroke="#FFC542" strokeWidth="6" strokeLinecap="round"/>
        })}
        <g transform="translate(220,90)">
          <ellipse cx="40" cy="40" rx="56" ry="30" fill="white"/>
          <ellipse cx="20" cy="30" rx="28" ry="22" fill="white"/>
          <ellipse cx="68" cy="28" rx="26" ry="22" fill="white"/>
        </g>
        <line x1="240" y1="170" x2="232" y2="200" stroke="#4D6BFF" strokeWidth="5" strokeLinecap="round"/>
        <line x1="270" y1="170" x2="262" y2="200" stroke="#4D6BFF" strokeWidth="5" strokeLinecap="round"/>
        <line x1="300" y1="170" x2="292" y2="200" stroke="#4D6BFF" strokeWidth="5" strokeLinecap="round"/>
      </svg>
    ),
    body: (
      <svg viewBox="0 0 400 300" preserveAspectRatio="xMidYMid slice" style={wrap}>
        <rect width="400" height="300" fill="#ECE3FF"/>
        <circle cx="200" cy="100" r="50" fill="#FFD2B8"/>
        <rect x="170" y="150" width="60" height="80" rx="14" fill="#FF6B4A"/>
        <rect x="120" y="160" width="40" height="14" rx="6" fill="#FFD2B8"/>
        <rect x="240" y="160" width="40" height="14" rx="6" fill="#FFD2B8"/>
        <rect x="170" y="232" width="22" height="50" rx="6" fill="#4D6BFF"/>
        <rect x="208" y="232" width="22" height="50" rx="6" fill="#4D6BFF"/>
        <circle cx="184" cy="92" r="4" fill="#1B1B2A"/>
        <circle cx="216" cy="92" r="4" fill="#1B1B2A"/>
        <path d="M188 112 Q 200 122 212 112" stroke="#1B1B2A" strokeWidth="3" fill="none" strokeLinecap="round"/>
      </svg>
    ),
    routine: (
      <svg viewBox="0 0 400 300" preserveAspectRatio="xMidYMid slice" style={wrap}>
        <rect width="400" height="300" fill="#FFE3D5"/>
        <circle cx="200" cy="150" r="100" fill="white" stroke="#1B1B2A" strokeWidth="6"/>
        <line x1="200" y1="150" x2="200" y2="80" stroke="#1B1B2A" strokeWidth="6" strokeLinecap="round"/>
        <line x1="200" y1="150" x2="250" y2="180" stroke="#FF6B4A" strokeWidth="6" strokeLinecap="round"/>
        <circle cx="200" cy="150" r="8" fill="#1B1B2A"/>
        {[12,3,6,9].map((n,i) => {
          const a = (i*90 - 90) * Math.PI/180
          return <text key={n} x={200 + Math.cos(a)*72 - 10} y={150 + Math.sin(a)*72 + 7} fontFamily="Baloo 2" fontSize="22" fontWeight="800" fill="#1B1B2A">{n}</text>
        })}
      </svg>
    ),
    abc: (
      <svg viewBox="0 0 400 300" preserveAspectRatio="xMidYMid slice" style={wrap}>
        <rect width="400" height="300" fill="#FFE3D5"/>
        <text x="50" y="190" fontFamily="Baloo 2" fontSize="180" fontWeight="800" fill="#FF6B4A">A</text>
        <text x="160" y="220" fontFamily="Baloo 2" fontSize="160" fontWeight="800" fill="#FFC542">B</text>
        <text x="270" y="190" fontFamily="Baloo 2" fontSize="180" fontWeight="800" fill="#4D6BFF">C</text>
      </svg>
    ),
    duck: (
      <svg viewBox="0 0 400 300" preserveAspectRatio="xMidYMid slice" style={wrap}>
        <rect width="400" height="300" fill="#C7E4FF"/>
        <ellipse cx="200" cy="280" rx="220" ry="40" fill="#4D6BFF" opacity="0.4"/>
        <ellipse cx="200" cy="180" rx="80" ry="60" fill="#FFC542"/>
        <circle cx="260" cy="140" r="44" fill="#FFC542"/>
        <polygon points="290,135 320,140 290,150" fill="#FF6B4A"/>
        <circle cx="265" cy="130" r="5" fill="#1B1B2A"/>
      </svg>
    ),
    bus: (
      <svg viewBox="0 0 400 300" preserveAspectRatio="xMidYMid slice" style={wrap}>
        <rect width="400" height="300" fill="#FFF1CE"/>
        <rect x="60" y="130" width="280" height="100" rx="14" fill="#FFC542"/>
        <rect x="80" y="150" width="50" height="40" rx="6" fill="#C7E4FF"/>
        <rect x="140" y="150" width="50" height="40" rx="6" fill="#C7E4FF"/>
        <rect x="200" y="150" width="50" height="40" rx="6" fill="#C7E4FF"/>
        <rect x="260" y="150" width="60" height="40" rx="6" fill="#C7E4FF"/>
        <circle cx="120" cy="240" r="22" fill="#1B1B2A"/>
        <circle cx="280" cy="240" r="22" fill="#1B1B2A"/>
        <circle cx="120" cy="240" r="8" fill="#FFC542"/>
        <circle cx="280" cy="240" r="8" fill="#FFC542"/>
      </svg>
    ),
    farm2: (
      <svg viewBox="0 0 400 300" preserveAspectRatio="xMidYMid slice" style={wrap}>
        <rect width="400" height="300" fill="#86C780"/>
        <rect width="400" height="180" fill="#C7E4FF"/>
        <circle cx="340" cy="60" r="28" fill="#FFC542"/>
        <ellipse cx="180" cy="220" rx="50" ry="38" fill="white"/>
        <circle cx="220" cy="190" r="22" fill="white"/>
        <polygon points="220,170 230,178 220,186" fill="#FF6B4A"/>
        <path d="M222 168 Q 218 156 226 154" stroke="#FF6B4A" strokeWidth="5" fill="none"/>
        <circle cx="222" cy="190" r="3" fill="#1B1B2A"/>
        <ellipse cx="160" cy="252" rx="6" ry="3" fill="#FFC542"/>
        <ellipse cx="180" cy="252" rx="6" ry="3" fill="#FFC542"/>
      </svg>
    ),
    hello: (
      <svg viewBox="0 0 400 300" preserveAspectRatio="xMidYMid slice" style={wrap}>
        <rect width="400" height="300" fill="#ECE3FF"/>
        <text x="40" y="180" fontFamily="Baloo 2" fontSize="80" fontWeight="800" fill="#4D6BFF">Hello!</text>
        <circle cx="290" cy="150" r="60" fill="#FFD2B8"/>
        <circle cx="278" cy="142" r="4" fill="#1B1B2A"/>
        <circle cx="306" cy="142" r="4" fill="#1B1B2A"/>
        <path d="M278 168 Q 292 182 306 168" stroke="#1B1B2A" strokeWidth="3" fill="none" strokeLinecap="round"/>
      </svg>
    ),
    dance: (
      <svg viewBox="0 0 400 300" preserveAspectRatio="xMidYMid slice" style={wrap}>
        <rect width="400" height="300" fill="#FFE0EC"/>
        <circle cx="150" cy="100" r="34" fill="#FFD2B8"/>
        <path d="M120 140 L 90 200 L 110 240 L 150 200 L 190 240 L 210 200 L 180 140 Z" fill="#FF6B4A"/>
        <circle cx="280" cy="110" r="30" fill="#FFD2B8"/>
        <path d="M260 140 L 230 230 L 250 250 L 290 230 L 310 250 L 330 230 L 300 140 Z" fill="#4D6BFF"/>
      </svg>
    ),
    days: (
      <svg viewBox="0 0 400 300" preserveAspectRatio="xMidYMid slice" style={wrap}>
        <rect width="400" height="300" fill="#E5F6EC"/>
        <rect x="60" y="60" width="280" height="200" rx="14" fill="white" stroke="#1B1B2A" strokeWidth="3"/>
        <rect x="60" y="60" width="280" height="40" fill="#1FB67A"/>
        {[0,1,2,3,4,5,6].map(i => <rect key={i} x={70 + i*39} y={110} width="35" height="35" rx="6" fill="#E5F6EC"/>)}
        {[0,1,2,3,4,5,6].map(i => <rect key={'r2'+i} x={70 + i*39} y={150} width="35" height="35" rx="6" fill={i===2?"#FF6B4A":"#E5F6EC"}/>)}
        {[0,1,2,3,4,5,6].map(i => <rect key={'r3'+i} x={70 + i*39} y={190} width="35" height="35" rx="6" fill="#E5F6EC"/>)}
      </svg>
    ),
    fruit: (
      <svg viewBox="0 0 400 300" preserveAspectRatio="xMidYMid slice" style={wrap}>
        <rect width="400" height="300" fill="#FFE3D5"/>
        <circle cx="120" cy="170" r="56" fill="#E85530"/>
        <path d="M120 124 Q 134 108 152 116" stroke="#1FB67A" strokeWidth="7" fill="none" strokeLinecap="round"/>
        <ellipse cx="240" cy="180" rx="44" ry="56" fill="#FFC542"/>
        <circle cx="320" cy="160" r="48" fill="#86C780"/>
      </svg>
    ),
    star: (
      <svg viewBox="0 0 400 300" preserveAspectRatio="xMidYMid slice" style={wrap}>
        <defs><linearGradient id="ng" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#1B1B2A"/><stop offset="100%" stopColor="#3A3A5A"/></linearGradient></defs>
        <rect width="400" height="300" fill="url(#ng)"/>
        <polygon points="200,80 215,135 270,135 225,170 240,225 200,190 160,225 175,170 130,135 185,135" fill="#FFC542"/>
        <circle cx="80" cy="80" r="3" fill="white"/>
        <circle cx="320" cy="100" r="2" fill="white"/>
        <circle cx="350" cy="220" r="3" fill="white"/>
        <circle cx="60" cy="240" r="2" fill="white"/>
      </svg>
    ),
    happy: (
      <svg viewBox="0 0 400 300" preserveAspectRatio="xMidYMid slice" style={wrap}>
        <rect width="400" height="300" fill="#FFF1CE"/>
        <circle cx="200" cy="150" r="100" fill="#FFC542"/>
        <circle cx="170" cy="130" r="10" fill="#1B1B2A"/>
        <circle cx="230" cy="130" r="10" fill="#1B1B2A"/>
        <path d="M155 175 Q 200 220 245 175" stroke="#1B1B2A" strokeWidth="8" fill="none" strokeLinecap="round"/>
      </svg>
    ),
    head: (
      <svg viewBox="0 0 400 300" preserveAspectRatio="xMidYMid slice" style={wrap}>
        <rect width="400" height="300" fill="#E8EDFF"/>
        <circle cx="200" cy="120" r="60" fill="#FFD2B8"/>
        <circle cx="180" cy="115" r="5" fill="#1B1B2A"/>
        <circle cx="220" cy="115" r="5" fill="#1B1B2A"/>
        <path d="M180 140 Q 200 160 220 140" stroke="#1B1B2A" strokeWidth="3" fill="none" strokeLinecap="round"/>
        <rect x="160" y="180" width="80" height="20" rx="6" fill="#FF6B4A"/>
        <rect x="120" y="200" width="160" height="80" rx="14" fill="#FF6B4A"/>
      </svg>
    ),
    bingo: (
      <svg viewBox="0 0 400 300" preserveAspectRatio="xMidYMid slice" style={wrap}>
        <rect width="400" height="300" fill="#FFE0EC"/>
        <ellipse cx="200" cy="200" rx="110" ry="60" fill="#FFD2B8"/>
        <circle cx="150" cy="160" r="40" fill="#FFD2B8"/>
        <circle cx="140" cy="155" r="5" fill="#1B1B2A"/>
        <circle cx="160" cy="160" r="5" fill="#1B1B2A"/>
        <ellipse cx="155" cy="180" rx="8" ry="5" fill="#1B1B2A"/>
        <path d="M120 130 L 110 100" stroke="#1B1B2A" strokeWidth="4" fill="none" strokeLinecap="round"/>
        <path d="M180 130 L 190 100" stroke="#1B1B2A" strokeWidth="4" fill="none" strokeLinecap="round"/>
      </svg>
    ),
    spider: (
      <svg viewBox="0 0 400 300" preserveAspectRatio="xMidYMid slice" style={wrap}>
        <rect width="400" height="300" fill="#ECE3FF"/>
        <line x1="200" y1="0" x2="200" y2="120" stroke="#1B1B2A" strokeWidth="2"/>
        <circle cx="200" cy="160" r="40" fill="#1B1B2A"/>
        <circle cx="190" cy="155" r="5" fill="white"/>
        <circle cx="210" cy="155" r="5" fill="white"/>
        {[1,2,3].map(i => (
          <g key={i}>
            <line x1="170" y1={150 + i*8} x2={130 - i*10} y2={130 + i*16} stroke="#1B1B2A" strokeWidth="3" strokeLinecap="round"/>
            <line x1="230" y1={150 + i*8} x2={270 + i*10} y2={130 + i*16} stroke="#1B1B2A" strokeWidth="3" strokeLinecap="round"/>
          </g>
        ))}
      </svg>
    ),
    apple: (
      <svg viewBox="0 0 400 300" preserveAspectRatio="xMidYMid slice" style={wrap}>
        <rect width="400" height="300" fill="#FFE3D5"/>
        <ellipse cx="200" cy="170" rx="90" ry="100" fill="#E85530"/>
        <ellipse cx="170" cy="120" rx="20" ry="14" fill="#FF8FB1" opacity="0.7"/>
        <path d="M200 90 Q 230 60 260 80" stroke="#1FB67A" strokeWidth="10" fill="none" strokeLinecap="round"/>
        <path d="M200 90 Q 220 70 240 86" stroke="#86C780" strokeWidth="8" fill="none" strokeLinecap="round"/>
      </svg>
    ),
  }

  return <div style={wrap}>{scenes[kind] || scenes.rainbow}</div>
}
