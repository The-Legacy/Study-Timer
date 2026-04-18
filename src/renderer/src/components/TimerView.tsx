import { useState, useEffect, useCallback, useMemo } from 'react'
import { Block } from '../types'
import { playBlockEnd, playSessionComplete } from '../utils/sound'
import { randomChallenge } from '../utils/challenges'
import Confetti from './Confetti'

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
  const [blockDone, setBlockDone] = useState(false)
  const [isComplete, setIsComplete] = useState(false)

  const challenge = useMemo(() => randomChallenge(), [currentIndex])

  const currentBlock = blocks[currentIndex]
  const totalSeconds = currentBlock.durationMinutes * 60
  const elapsed = totalSeconds - timeLeft
  const progress = totalSeconds > 0 ? (elapsed / totalSeconds) * 100 : 0
  const isLast = currentIndex === blocks.length - 1

  function nudge(seconds: number) {
    setTimeLeft((t) => Math.max(1, Math.min(totalSeconds, t + seconds)))
  }

  const markBlockDone = useCallback(() => {
    if (currentIndex === blocks.length - 1) {
      playSessionComplete()
      setIsComplete(true)
    } else {
      playBlockEnd()
      setIsRunning(false)
      setBlockDone(true)
    }
  }, [currentIndex, blocks.length])

  function continueToNext() {
    const next = currentIndex + 1
    setCurrentIndex(next)
    setTimeLeft(blocks[next].durationMinutes * 60)
    setIsRunning(true)
    setBlockDone(false)
  }

  useEffect(() => {
    if (!isRunning || blockDone || isComplete) return
    const id = setInterval(() => {
      setTimeLeft((t) => (t > 0 ? t - 1 : 0))
    }, 1000)
    return () => clearInterval(id)
  }, [isRunning, blockDone, isComplete, currentIndex])

  useEffect(() => {
    if (timeLeft === 0 && isRunning && !blockDone && !isComplete) {
      markBlockDone()
    }
  }, [timeLeft, isRunning, blockDone, isComplete, markBlockDone])

  if (isComplete) {
    return (
      <div className="complete-screen">
        <Confetti />
        <h1>Session Complete!</h1>
        <p>You crushed all {blocks.length} block{blocks.length !== 1 ? 's' : ''}.</p>
        <button className="btn-new-session" onClick={onFinish}>
          New Session
        </button>
      </div>
    )
  }

  return (
    <div className="timer-view">
      {blockDone && (
        <div className="block-done-overlay">
          <div className="block-done-card">
            <div className="block-done-title">
              {currentBlock.type === 'study' ? 'Nice work!' : 'Break over!'}
            </div>
            <div className="block-done-label">{currentBlock.label}</div>
            <div className="block-done-next">
              Up next:&nbsp;<strong>{blocks[currentIndex + 1].label}</strong>
              <span className={`block-badge ${blocks[currentIndex + 1].type}`} style={{ marginLeft: 8 }}>
                {blocks[currentIndex + 1].type.toUpperCase()}
              </span>
            </div>
            <button className="btn-continue" onClick={continueToNext}>
              Continue →
            </button>
          </div>
        </div>
      )}

      <div className="timer-main">
        <div className={`timer-type-label ${currentBlock.type}-label`}>
          <span className="dot" />
          {currentBlock.type.toUpperCase()}
        </div>

        <div className="timer-block-name">{currentBlock.label}</div>

        {currentBlock.type === 'break' && (
          <div className="challenge-card-inline">
            <div className="challenge-tag">{challenge.tag}</div>
            <div className="challenge-title">{challenge.title}</div>
            <div className="challenge-desc">{challenge.description}</div>
          </div>
        )}

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
          <div className="nudge-row">
            <button className="btn-nudge" onClick={() => nudge(-300)} title="Skip ahead 5 min">−5m</button>
            <button className="btn-nudge" onClick={() => nudge(-60)} title="Skip ahead 1 min">−1m</button>
            <button className="btn-pause" onClick={() => setIsRunning((r) => !r)}>
              {isRunning ? 'Pause' : 'Resume'}
            </button>
            <button className="btn-nudge" onClick={() => nudge(60)} title="Add 1 min">+1m</button>
            <button className="btn-nudge" onClick={() => nudge(300)} title="Add 5 min">+5m</button>
          </div>
          <button className="btn-skip" onClick={markBlockDone}>
            {isLast ? 'Finish' : 'Skip Block →'}
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
                {isDone && <span className="sidebar-check" />}
                {isCurrent && <span className="sidebar-arrow" />}
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
