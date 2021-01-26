import mongoose from 'mongoose'
import { CellSchema } from './Cell'

export const NoteSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      default: 'New Untitled Note',
      minlength: 1,
    },
    owner: {
      type: mongoose.SchemaTypes.ObjectId,
      ref: 'user',
    },
    cells: {
      type: mongoose.SchemaTypes.Map,
      of: CellSchema as any,
    },
    order: [String],
  },
  { timestamps: true }
)

export const Note = mongoose.models.note || mongoose.model('note', NoteSchema)
