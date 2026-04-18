export type BlockType = 'study' | 'break'

export interface Block {
  id: string
  type: BlockType
  label: string
  durationMinutes: number
}
