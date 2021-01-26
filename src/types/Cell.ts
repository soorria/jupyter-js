export type CellType = 'javascript' | 'markdown'

interface ICell {
  _id: string
  type: CellType
  contents: string
}

export default ICell
