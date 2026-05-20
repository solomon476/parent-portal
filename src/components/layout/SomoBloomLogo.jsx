export default function SomoBloomLogo({ size = 40, showText = true, fontSize = '18px' }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', userSelect: 'none' }}>
      <svg
        width={size}
        height={size}
        viewBox="0 0 120 120"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        style={{
          transition: 'transform 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)',
          filter: 'drop-shadow(0 4px 12px rgba(79, 70, 229, 0.15))'
        }}
        onMouseEnter={e => {
          e.currentTarget.style.transform = 'scale(1.1) rotate(4deg)';
        }}
        onMouseLeave={e => {
          e.currentTarget.style.transform = 'scale(1) rotate(0deg)';
        }}
      >
        {/* Gradients */}
        <defs>
          <linearGradient id="bookGrad" x1="20" y1="80" x2="100" y2="110" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#4f46e5" />
            <stop offset="100%" stopColor="#312e81" />
          </linearGradient>
          <linearGradient id="leafLeft" x1="15" y1="20" x2="60" y2="70" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#34d399" />
            <stop offset="100%" stopColor="#059669" />
          </linearGradient>
          <linearGradient id="leafCenter" x1="40" y1="10" x2="80" y2="70" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#6366f1" />
            <stop offset="100%" stopColor="#4f46e5" />
          </linearGradient>
          <linearGradient id="leafRight" x1="60" y1="20" x2="105" y2="70" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#fbbf24" />
            <stop offset="100%" stopColor="#d97706" />
          </linearGradient>
        </defs>

        {/* Book / Base of Knowledge */}
        <path
          d="M20 85C20 80 40 75 60 85C80 75 100 80 100 85V105C100 100 80 95 60 105C40 95 20 100 20 105V85Z"
          fill="url(#bookGrad)"
        />
        <path
          d="M60 85V105"
          stroke="#e0e7ff"
          strokeWidth="2"
          strokeLinecap="round"
        />
        
        {/* Blooming Leaves/Petals representing growth */}
        {/* Left Leaf */}
        <path
          d="M60 75C40 65 15 50 25 25C40 20 55 45 60 75Z"
          fill="url(#leafLeft)"
          opacity="0.9"
        />
        
        {/* Right Leaf */}
        <path
          d="M60 75C80 65 105 50 95 25C80 20 65 45 60 75Z"
          fill="url(#leafRight)"
          opacity="0.9"
        />

        {/* Center Bud / Flower representing excellence */}
        <path
          d="M60 75C50 50 40 15 60 5C80 15 70 50 60 75Z"
          fill="url(#leafCenter)"
        />
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
