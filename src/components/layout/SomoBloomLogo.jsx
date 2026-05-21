export default function SomoBloomLogo({ size = 40, showText = true, fontSize = '18px' }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', userSelect: 'none' }}>
      <svg 
        width={size} 
        height={size} 
        viewBox="0 0 500 500" 
        fill="none" 
        xmlns="http://www.w3.org/2000/svg"
        style={{ 
          transition: 'transform 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)',
          filter: 'drop-shadow(0 4px 12px rgba(16, 185, 129, 0.15))'
        }}
        onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.1) rotate(4deg)'}
        onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1) rotate(0deg)'}
      >
        {/* Outer dotted circular border */}
        <circle cx="250" cy="250" r="230" stroke="#10b981" strokeWidth="12" strokeLinecap="round" strokeDasharray="25 25" />
        
        {/* Open Book Base in Blue */}
        <path 
          d="M 120,300 C 180,300 230,330 250,350 C 270,330 320,300 380,300 L 380,380 C 320,380 270,410 250,430 C 230,410 180,380 120,380 Z" 
          fill="none" 
          stroke="#1e3a8a" 
          strokeWidth="20" 
          strokeLinejoin="round" 
        />
        <path d="M 250,350 L 250,430" stroke="#1e3a8a" strokeWidth="20" />
        
        {/* Layered Blooming Leaves matching the user logo exactly */}
        <path d="M 250,330 C 180,280 150,200 200,140 C 220,190 240,240 250,330 Z" fill="#06b6d4" opacity="0.95" />
        <path d="M 250,330 C 320,280 350,200 300,140 C 280,190 260,240 250,330 Z" fill="#10b981" opacity="0.95" />
        <path d="M 250,330 C 150,310 120,240 170,180 C 190,220 220,260 250,330 Z" fill="#0891b2" opacity="0.85" />
        <path d="M 250,330 C 350,310 380,240 330,180 C 310,220 280,260 250,330 Z" fill="#34d399" opacity="0.85" />
        <path d="M 250,310 C 220,220 220,120 250,50 C 280,120 280,220 250,310 Z" fill="#059669" />
      </svg>
      {showText && (
        <span style={{
          fontSize: fontSize,
          fontWeight: '800',
          letterSpacing: '-0.03em',
          color: 'inherit',
          fontFamily: "'Outfit', 'Inter', sans-serif"
        }}>
          Somo<span style={{ color: '#4f46e5' }}>Bloom</span>
        </span>
      )}
    </div>
  );
}
