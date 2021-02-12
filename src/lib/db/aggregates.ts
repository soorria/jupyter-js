import { ObjectId } from 'mongodb'
import { Note } from './models'

export const getNumNotesByUser = async (id: string): Promise<number> =>
  Note.find({ owner: id }).count()

export const getNumCellsByUser = async (id: string): Promise<number> => {
  const result = await Note.aggregate([
    { $match: { owner: new ObjectId(id) } },
    { $group: { _id: id, count: { $sum: { $size: '$order' } } } },
  ])

  return result?.[0].count ?? 0
}

export const getTotalNumNotes = async (): Promise<number> => Note.find().count()
export const getTotalNumCells = async (): Promise<number> => {
  const result = await Note.aggregate([
    { $group: { _id: null, count: { $sum: { $size: '$order' } } } },
  ])

  return result?.[0].count ?? 0
}
