import { useMemo } from 'react'

const COLORS = ['#a371f7', '#58a6ff', '#3fb950', '#ffa657', '#f78166', '#ff7b72', '#ffd700']

interface Piece {
  id: number
  color: string
  left: number
  delay: number
  duration: number
  width: number
  height: number
  rotation: number
}

export default function Confetti(): JSX.Element {
  const pieces = useMemo<Piece[]>(
    () =>
      Array.from({ length: 110 }, (_, i) => ({
        id: i,
        color: COLORS[i % COLORS.length],
        left: Math.random() * 100,
        delay: Math.random() * 2,
        duration: 2.5 + Math.random() * 2.5,
        width: 6 + Math.random() * 8,
        height: 3 + Math.random() * 5,
        rotation: Math.random() * 360,
      })),
    []
  )

  return (
    <div className="confetti-container" aria-hidden>
      {pieces.map((p) => (
        <div
          key={p.id}
          className="confetti-piece"
          style={{
            left: `${p.left}%`,
            background: p.color,
            width: p.width,
            height: p.height,
            animationDelay: `${p.delay}s`,
            animationDuration: `${p.duration}s`,
            transform: `rotate(${p.rotation}deg)`,
            borderRadius: p.id % 3 === 0 ? '50%' : '2px',
          }}
        />
      ))}
    </div>
  )
}
