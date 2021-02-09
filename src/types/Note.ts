import { Document } from 'mongoose'
import ICell from './Cell'

interface INote {
  _id: string
  title: string
  owner: string
  cells?: Record<string, ICell>
  order: string[]
  createdAt: string | Date
  updatedAt: string | Date
}

export type NoteDocument = INote & Document

export default INote
