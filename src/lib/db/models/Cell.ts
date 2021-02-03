import mongoose, { Document } from 'mongoose'
import ICell from '#src/types/Cell'

export const CellSchema = new mongoose.Schema<ICell & Document>(
  {
    _id: {
      type: String,
      required: true,
    },
    type: {
      type: String,
      enum: ['javascript', 'markdown'],
      required: true,
    },
    contents: {
      type: String,
      default: '',
    },
  },
  // Disable auto-generated ids for cells
  { _id: false }
)
