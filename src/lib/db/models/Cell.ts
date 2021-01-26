import mongoose, { Document } from 'mongoose'
import ICell from '#src/types/Cell'

export const CellSchema = new mongoose.Schema<ICell & Document>({
  type: {
    type: String,
    enum: ['javascript', 'markdown'],
    required: true,
  },
  contents: {
    type: String,
    default: '',
  },
})
