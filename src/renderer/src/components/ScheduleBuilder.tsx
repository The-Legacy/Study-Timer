import { useState, useRef } from 'react'
import type { JSX } from 'react'
import { Block, BlockType, SavedPlan } from '../types'
import { loadPlans, savePlan, deletePlan } from '../utils/storage'

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
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editType, setEditType] = useState<BlockType>('study')
  const [editLabel, setEditLabel] = useState('')
  const [editHours, setEditHours] = useState(0)
  const [editMinutes, setEditMinutes] = useState(0)
  const [savedPlans, setSavedPlans] = useState<SavedPlan[]>(() => loadPlans())
  const [savingPlan, setSavingPlan] = useState(false)
  const [planName, setPlanName] = useState('')

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

  function startEdit(block: Block) {
    setEditingId(block.id)
    setEditType(block.type)
    setEditLabel(block.label)
    setEditHours(Math.floor(block.durationMinutes / 60))
    setEditMinutes(block.durationMinutes % 60)
  }

  function handleSavePlan() {
    const name = planName.trim()
    if (!name || blocks.length === 0) return
    const plan: SavedPlan = {
      id: crypto.randomUUID(),
      name,
      blocks: blocks.map((b) => ({ ...b, id: crypto.randomUUID() })),
      createdAt: Date.now(),
    }
    savePlan(plan)
    setSavedPlans(loadPlans())
    setPlanName('')
    setSavingPlan(false)
  }

  function handleLoadPlan(plan: SavedPlan) {
    onBlocksChange(plan.blocks.map((b) => ({ ...b, id: crypto.randomUUID() })))
  }

  function handleDeletePlan(id: string) {
    deletePlan(id)
    setSavedPlans(loadPlans())
  }

  function saveEdit(id: string) {
    const totalMins = editHours * 60 + editMinutes
    if (totalMins <= 0) { setEditingId(null); return }
    onBlocksChange(
      blocks.map((b) =>
        b.id === id
          ? { ...b, type: editType, label: editLabel.trim() || b.label, durationMinutes: totalMins }
          : b
      )
    )
    setEditingId(null)
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
              {blocks.map((block, i) =>
                editingId === block.id ? (
                  <div key={block.id} className="block-item block-item-editing">
                    <div className="type-toggle" style={{ flexShrink: 0 }}>
                      <button
                        className={editType === 'study' ? 'active-study' : ''}
                        onClick={() => setEditType('study')}
                      >
                        Study
                      </button>
                      <button
                        className={editType === 'break' ? 'active-break' : ''}
                        onClick={() => setEditType('break')}
                      >
                        Break
                      </button>
                    </div>
                    <input
                      type="text"
                      className="edit-label-input"
                      value={editLabel}
                      onChange={(e) => setEditLabel(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && saveEdit(block.id)}
                      autoFocus
                    />
                    <div className="duration-inputs">
                      <Stepper value={editHours} min={0} max={23} onChange={setEditHours} label="h" />
                      <Stepper value={editMinutes} min={0} max={59} step={5} onChange={setEditMinutes} label="m" />
                    </div>
                    <button className="btn-icon save" onClick={() => saveEdit(block.id)} title="Save">Save</button>
                    <button className="btn-icon danger" onClick={() => setEditingId(null)} title="Cancel">Cancel</button>
                  </div>
                ) : (
                  <div
                    key={block.id}
                    className={`block-item${dragOverIndex === i ? ' drag-over' : ''}${dragIndexRef.current === i ? ' dragging' : ''}`}
                    draggable
                    onDragStart={(e) => handleDragStart(e, i)}
                    onDragOver={(e) => handleDragOver(e, i)}
                    onDrop={(e) => handleDrop(e, i)}
                    onDragEnd={handleDragEnd}
                  >
                    <span className="drag-handle" title="Drag to reorder">::</span>
                    <span className={`block-badge ${block.type}`}>{block.type.toUpperCase()}</span>
                    <span className="block-label">{block.label}</span>
                    <span className="block-duration">{formatDuration(block.durationMinutes)}</span>
                    <div className="block-actions">
                      <button className="btn-icon" onClick={() => startEdit(block)} title="Edit">Edit</button>
                      <button className="btn-icon danger" onClick={() => handleDelete(block.id)} title="Remove">Remove</button>
                    </div>
                  </div>
                )
              )}
            </div>
          )}
        </div>

        {savedPlans.length > 0 && (
          <div>
            <div className="section-title">Saved Plans</div>
            <div className="saved-plans-list">
              {savedPlans.map((plan) => (
                <div key={plan.id} className="saved-plan-item">
                  <div className="saved-plan-info">
                    <span className="saved-plan-name">{plan.name}</span>
                    <span className="saved-plan-meta">
                      {plan.blocks.length} block{plan.blocks.length !== 1 ? 's' : ''} · {formatTotal(plan.blocks)}
                    </span>
                  </div>
                  <div className="saved-plan-actions">
                    <button className="btn-icon" onClick={() => handleLoadPlan(plan)}>Load</button>
                    <button className="btn-icon danger" onClick={() => handleDeletePlan(plan.id)}>Delete</button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
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
        <div className="footer-actions">
          {savingPlan ? (
            <div className="save-plan-row">
              <input
                type="text"
                className="save-plan-input"
                placeholder="Plan name…"
                value={planName}
                onChange={(e) => setPlanName(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') handleSavePlan()
                  if (e.key === 'Escape') { setSavingPlan(false); setPlanName('') }
                }}
                autoFocus
              />
              <button className="btn-icon save" onClick={handleSavePlan} disabled={!planName.trim()}>Save</button>
              <button className="btn-icon" onClick={() => { setSavingPlan(false); setPlanName('') }}>Cancel</button>
            </div>
          ) : (
            <button
              className="btn-save-plan"
              onClick={() => setSavingPlan(true)}
              disabled={blocks.length === 0}
            >
              Save Plan
            </button>
          )}
          <button className="btn-start" onClick={onStart} disabled={blocks.length === 0}>
            Start Session →
          </button>
        </div>
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
