import { ObjectId } from 'mongodb'
import { Note } from './models'

export const getNumNotesByUser = async (id: string): Promise<number> => {
  const [{ count } = { count: 0 }] = await Note.aggregate([
    { $match: { owner: new ObjectId(id) } },
    { $count: 'count' },
  ])

  return count
}

export const getNumCellsByUser = async (id: string): Promise<number> => {
  const result = await Note.aggregate([
    { $match: { owner: new ObjectId(id) } },
    { $group: { _id: id, count: { $sum: { $size: '$order' } } } },
  ])

  return result?.[0].count ?? 0
}

export const getUserUsage = async (id: string): Promise<{ notes: number; cells: number }> => {
  const [result = { notes: 0, cells: 0 }] = await Note.aggregate([
    { $match: { owner: new ObjectId(id) } },
    {
      $group: {
        _id: id,
        notes: { $sum: 1 },
        cells: { $sum: { $size: '$order' } },
      },
    },
    { $project: { _id: 0 } },
  ])

  return result
}

export const getTotalNumNotes = async (): Promise<number> => Note.find().count()
export const getTotalNumCells = async (): Promise<number> => {
  const result = await Note.aggregate([
    { $group: { _id: null, count: { $sum: { $size: '$order' } } } },
  ])

  return result?.[0].count ?? 0
}
