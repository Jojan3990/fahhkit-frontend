/* eslint-disable react/prop-types -- no prop-types dependency in this project */
import './DonutChart.css'

// Dependency-free SVG donut — no charting library in this project, and this
// is the only chart the app needs, so a small hand-rolled one beats a new
// dependency just for two arcs.
export default function DonutChart({ data, size = 160, thickness = 22 }) {
  const total = data.reduce((sum, d) => sum + d.value, 0)
  const radius = (size - thickness) / 2
  const circumference = 2 * Math.PI * radius

  let offset = 0
  const arcs = data.map((d) => {
    const fraction = total > 0 ? d.value / total : 0
    const dash = fraction * circumference
    const arc = { ...d, dash, offset }
    offset += dash
    return arc
  })

  return (
    <div className="donut-chart" style={{ width: size, height: size }}>
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="var(--border)"
          strokeWidth={thickness}
        />
        {total > 0 &&
          arcs.map((arc) => (
            <circle
              key={arc.label}
              cx={size / 2}
              cy={size / 2}
              r={radius}
              fill="none"
              stroke={arc.color}
              strokeWidth={thickness}
              strokeDasharray={`${arc.dash} ${circumference - arc.dash}`}
              strokeDashoffset={-arc.offset}
              transform={`rotate(-90 ${size / 2} ${size / 2})`}
            />
          ))}
      </svg>
      <div className="donut-chart-center">
        <span className="donut-chart-total">{total}</span>
        <span className="donut-chart-total-label">Total</span>
      </div>
    </div>
  )
}
