import { useState, useEffect, useCallback } from 'react'
import { Block } from '../types'
import { playBlockEnd, playSessionComplete } from '../utils/sound'

interface Props {
  blocks: Block[]
  onFinish: () => void
}

function formatTime(seconds: number): string {
  const h = Math.floor(seconds / 3600)
  const m = Math.floor((seconds % 3600) / 60)
  const s = seconds % 60
  if (h > 0) {
    return `${h}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`
  }
  return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`
}

function formatDuration(minutes: number): string {
  if (minutes >= 60) {
    const h = Math.floor(minutes / 60)
    const m = minutes % 60
    return m > 0 ? `${h}h ${m}m` : `${h}h`
  }
  return `${minutes}m`
}

export default function TimerView({ blocks, onFinish }: Props): JSX.Element {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [timeLeft, setTimeLeft] = useState(blocks[0].durationMinutes * 60)
  const [isRunning, setIsRunning] = useState(true)
  const [isComplete, setIsComplete] = useState(false)

  const currentBlock = blocks[currentIndex]
  const totalSeconds = currentBlock.durationMinutes * 60
  const elapsed = totalSeconds - timeLeft
  const progress = totalSeconds > 0 ? (elapsed / totalSeconds) * 100 : 0

  const advance = useCallback(() => {
    const next = currentIndex + 1
    if (next >= blocks.length) {
      playSessionComplete()
      setIsComplete(true)
    } else {
      playBlockEnd()
      setCurrentIndex(next)
      setTimeLeft(blocks[next].durationMinutes * 60)
      setIsRunning(true)
    }
  }, [currentIndex, blocks])

  // Interval tick — reset when block changes
  useEffect(() => {
    if (!isRunning || isComplete) return
    const id = setInterval(() => {
      setTimeLeft((t) => (t > 0 ? t - 1 : 0))
    }, 1000)
    return () => clearInterval(id)
  }, [isRunning, isComplete, currentIndex])

  // Advance when block time runs out
  useEffect(() => {
    if (timeLeft === 0 && isRunning && !isComplete) {
      advance()
    }
  }, [timeLeft, advance, isRunning, isComplete])

  if (isComplete) {
    return (
      <div className="complete-screen">
        <div className="trophy">🎉</div>
        <h1>Session Complete!</h1>
        <p>
          You finished all {blocks.length} block{blocks.length !== 1 ? 's' : ''}.
        </p>
        <button className="btn-new-session" onClick={onFinish}>
          New Session
        </button>
      </div>
    )
  }

  return (
    <div className="timer-view">
      <div className="timer-main">
        <div className={`timer-type-label ${currentBlock.type}-label`}>
          <span className="dot" />
          {currentBlock.type.toUpperCase()}
        </div>

        <div className="timer-block-name">{currentBlock.label}</div>

        <div className="timer-digits">{formatTime(timeLeft)}</div>

        <div className="progress-container">
          <div className="progress-bar">
            <div
              className={`progress-fill ${currentBlock.type}`}
              style={{ width: `${progress}%` }}
            />
          </div>
          <div className="progress-text">
            <span>{formatTime(elapsed)} elapsed</span>
            <span>{formatDuration(currentBlock.durationMinutes)} total</span>
          </div>
        </div>

        <div className="timer-controls">
          <button className="btn-pause" onClick={() => setIsRunning((r) => !r)}>
            {isRunning ? '⏸ Pause' : '▶ Resume'}
          </button>
          <button className="btn-skip" onClick={advance}>
            {currentIndex < blocks.length - 1 ? 'Skip →' : 'Finish'}
          </button>
        </div>
      </div>

      <aside className="timer-sidebar">
        <div className="sidebar-header">
          Session · {blocks.length} block{blocks.length !== 1 ? 's' : ''}
        </div>

        <div className="sidebar-list">
          {blocks.map((block, i) => {
            const isDone = i < currentIndex
            const isCurrent = i === currentIndex
            return (
              <div
                key={block.id}
                className={`sidebar-item${isDone ? ' done' : ''}${isCurrent ? ' current' : ''}`}
              >
                <span className={`sidebar-dot ${isDone ? 'done-dot' : block.type}`} />
                <div className="sidebar-item-info">
                  <div className="sidebar-item-label">{block.label}</div>
                  <div className="sidebar-item-duration">{formatDuration(block.durationMinutes)}</div>
                </div>
                {isDone && <span className="sidebar-check">✓</span>}
                {isCurrent && <span className="sidebar-arrow">▶</span>}
              </div>
            )
          })}
        </div>

        <div className="sidebar-footer">
          <button className="btn-end" onClick={onFinish}>
            End Session
          </button>
        </div>
      </aside>
    </div>
  )
}
