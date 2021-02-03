export const VALID_CELL_TYPES: Set<CellType> = new Set(['javascript', 'markdown'])
export type CellType = 'javascript' | 'markdown'

interface ICell {
  _id: string
  type: CellType
  contents: string
}

export default ICell
