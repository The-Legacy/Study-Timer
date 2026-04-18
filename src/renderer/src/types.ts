export type BlockType = 'study' | 'break'

export interface Block {
  id: string
  type: BlockType
  label: string
  durationMinutes: number
}

export interface SavedPlan {
  id: string
  name: string
  blocks: Block[]
  createdAt: number
}
