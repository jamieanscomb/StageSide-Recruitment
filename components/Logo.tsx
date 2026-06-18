interface LogoProps {
  size?: 'sm' | 'md' | 'lg'
  markOnly?: boolean
}

const scales = {
  sm: 1,
  md: 1.5,
  lg: 2,
}

export default function Logo({ size = 'md', markOnly = false }: LogoProps) {
  const scale = scales[size]

  const leftBarWidth = Math.round(12 * scale)
  const leftBarHeight = Math.round(52 * scale)
  const rightBarWidth = Math.round(7 * scale)
  const rightBarHeight = Math.round(52 * scale)
  const gap = Math.round(5 * scale)
  const textSize = Math.round(28 * scale)
  const subTextSize = Math.round(10 * scale)
  const letterSpacing = -0.5 * scale

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: `${Math.round(12 * scale)}px` }}>
      {/* Logo mark */}
      <div style={{ display: 'flex', alignItems: 'flex-end', gap: `${gap}px`, flexShrink: 0 }}>
        <div
          style={{
            width: `${leftBarWidth}px`,
            height: `${leftBarHeight}px`,
            backgroundColor: '#E8FF00',
            clipPath: 'polygon(0 0, 100% 0, 68% 100%, 0% 100%)',
            flexShrink: 0,
          }}
        />
        <div
          style={{
            width: `${rightBarWidth}px`,
            height: `${rightBarHeight}px`,
            backgroundColor: 'rgba(232, 255, 0, 0.28)',
            clipPath: 'polygon(0 0, 100% 0, 100% 100%, 32% 100%)',
            flexShrink: 0,
          }}
        />
      </div>

      {/* Text */}
      {!markOnly && (
        <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
          <span
            style={{
              fontFamily: "'Space Grotesk', sans-serif",
              fontWeight: 700,
              fontSize: `${textSize}px`,
              color: '#F5F5F5',
              letterSpacing: `${letterSpacing}px`,
              lineHeight: 1,
            }}
          >
            STAGESIDE
          </span>
          <span
            style={{
              fontFamily: "'Space Grotesk', sans-serif",
              fontWeight: 300,
              fontSize: `${subTextSize}px`,
              color: '#E8FF00',
              letterSpacing: `${6 * scale}px`,
              textTransform: 'uppercase',
              lineHeight: 1,
              marginTop: `${4 * scale}px`,
            }}
          >
            RECRUITMENT
          </span>
        </div>
      )}
    </div>
  )
}
