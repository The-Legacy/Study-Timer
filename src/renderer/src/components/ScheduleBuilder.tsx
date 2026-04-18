import { useState, useRef } from 'react'
import { Block, BlockType } from '../types'

interface Props {
  blocks: Block[]
  onBlocksChange: (blocks: Block[]) => void
  onStart: () => void
}

function formatDuration(minutes: number): string {
  if (minutes >= 60) {
    const h = Math.floor(minutes / 60)
    const m = minutes % 60
    return m > 0 ? `${h}h ${m}m` : `${h}h`
  }
  return `${minutes}m`
}

function formatTotal(blocks: Block[]): string {
  const total = blocks.reduce((sum, b) => sum + b.durationMinutes, 0)
  return formatDuration(total)
}

export default function ScheduleBuilder({ blocks, onBlocksChange, onStart }: Props): JSX.Element {
  const [type, setType] = useState<BlockType>('study')
  const [label, setLabel] = useState('')
  const [hours, setHours] = useState(0)
  const [minutes, setMinutes] = useState(25)
  const dragIndexRef = useRef<number | null>(null)
  const [dragOverIndex, setDragOverIndex] = useState<number | null>(null)

  function handleAdd() {
    const totalMins = hours * 60 + minutes
    if (totalMins <= 0) return
    const block: Block = {
      id: crypto.randomUUID(),
      type,
      label: label.trim() || (type === 'break' ? 'Break' : 'Study'),
      durationMinutes: totalMins,
    }
    onBlocksChange([...blocks, block])
    setLabel('')
  }

  function handleDelete(id: string) {
    onBlocksChange(blocks.filter((b) => b.id !== id))
  }

  function handleDragStart(e: React.DragEvent, index: number) {
    dragIndexRef.current = index
    e.dataTransfer.effectAllowed = 'move'
  }

  function handleDragOver(e: React.DragEvent, index: number) {
    e.preventDefault()
    e.dataTransfer.dropEffect = 'move'
    if (dragOverIndex !== index) setDragOverIndex(index)
  }

  function handleDrop(e: React.DragEvent, index: number) {
    e.preventDefault()
    const from = dragIndexRef.current
    if (from === null || from === index) { setDragOverIndex(null); return }
    const next = [...blocks]
    const [item] = next.splice(from, 1)
    next.splice(index, 0, item)
    onBlocksChange(next)
    dragIndexRef.current = null
    setDragOverIndex(null)
  }

  function handleDragEnd() {
    dragIndexRef.current = null
    setDragOverIndex(null)
  }

  const durationValid = hours * 60 + minutes > 0

  return (
    <div className="builder">
      <div className="builder-body">
        <div className="add-block-card">
          <div className="card-title">Add a block</div>
          <div className="form-row">
            <div className="type-toggle">
              <button
                className={type === 'study' ? 'active-study' : ''}
                onClick={() => setType('study')}
              >
                Study
              </button>
              <button
                className={type === 'break' ? 'active-break' : ''}
                onClick={() => setType('break')}
              >
                Break
              </button>
            </div>

            <input
              type="text"
              placeholder={type === 'study' ? 'Label (e.g. BME 301)' : 'Label (optional)'}
              value={label}
              onChange={(e) => setLabel(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleAdd()}
            />

            <div className="duration-inputs">
              <Stepper
                value={hours}
                min={0}
                max={23}
                onChange={setHours}
                label="h"
              />
              <Stepper
                value={minutes}
                min={0}
                max={59}
                step={5}
                onChange={setMinutes}
                label="m"
              />
            </div>

            <button className="btn-add" onClick={handleAdd} disabled={!durationValid}>
              + Add
            </button>
          </div>
        </div>

        <div>
          <div className="section-title">
            Schedule
            {blocks.length > 0 && (
              <span className="section-meta">
                {blocks.length} block{blocks.length !== 1 ? 's' : ''} · {formatTotal(blocks)}
              </span>
            )}
          </div>

          {blocks.length === 0 ? (
            <div className="empty-state">
              No blocks yet — add a study or break block above to get started.
            </div>
          ) : (
            <div className="block-list">
              {blocks.map((block, i) => (
                <div
                  key={block.id}
                  className={`block-item${dragOverIndex === i ? ' drag-over' : ''}${dragIndexRef.current === i ? ' dragging' : ''}`}
                  draggable
                  onDragStart={(e) => handleDragStart(e, i)}
                  onDragOver={(e) => handleDragOver(e, i)}
                  onDrop={(e) => handleDrop(e, i)}
                  onDragEnd={handleDragEnd}
                >
                  <span className="drag-handle" title="Drag to reorder">⠿</span>
                  <span className={`block-badge ${block.type}`}>{block.type.toUpperCase()}</span>
                  <span className="block-label">{block.label}</span>
                  <span className="block-duration">{formatDuration(block.durationMinutes)}</span>
                  <div className="block-actions">
                    <button
                      className="btn-icon danger"
                      onClick={() => handleDelete(block.id)}
                      title="Remove"
                    >
                      ✕
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <footer className="builder-footer">
        <div className="total-time">
          {blocks.length > 0 ? (
            <>
              Total: <strong>{formatTotal(blocks)}</strong>
            </>
          ) : (
            'Build your session above'
          )}
        </div>
        <button className="btn-start" onClick={onStart} disabled={blocks.length === 0}>
          Start Session →
        </button>
      </footer>
    </div>
  )
}

interface StepperProps {
  value: number
  min: number
  max: number
  step?: number
  label: string
  onChange: (v: number) => void
}

function Stepper({ value, min, max, step = 1, label, onChange }: StepperProps): JSX.Element {
  function decrement() { onChange(Math.max(min, value - step)) }
  function increment() { onChange(Math.min(max, value + step)) }
  return (
    <div className="stepper">
      <button className="stepper-btn" onClick={decrement} disabled={value <= min}>−</button>
      <span className="stepper-value">{String(value).padStart(2, '0')}<span className="stepper-label">{label}</span></span>
      <button className="stepper-btn" onClick={increment} disabled={value >= max}>+</button>
    </div>
  )
}
