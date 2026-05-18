export default function SomoBloomLogo({ size = 40, showText = false }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', userSelect: 'none' }}>
      <img
        src="/somobloom-logo.png"
        alt="SomoBloom Logo"
        style={{
          height: size,
          width: 'auto',
          objectFit: 'contain',
          transition: 'transform 0.3s ease',
        }}
        onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.06)'}
        onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}
      />
      {showText && (
        <span style={{
          fontSize: '15px',
          fontWeight: '800',
          letterSpacing: '-0.03em',
          color: 'inherit'
        }}>
          Somo<span style={{ color: '#4f46e5' }}>Bloom</span>
        </span>
      )}
    </div>
  );
}
