import mongoose, { Document } from 'mongoose'
import { nc } from '#src/lib/api'
import { ensureAuth } from '#src/lib/api/middleware'
import { Note } from '#src/lib/db/models'
import HTTPError from '#src/lib/api/errors'
import ICell, { VALID_CELL_TYPES } from '#src/types/Cell'
import INote from '#src/types/Note'
import { nanoid } from 'nanoid'
import { getNumCellsByUser } from '#src/lib/db/aggregates'
import { CELL_LIMITS } from '#src/constants'

export default nc()
  .use(ensureAuth)
  .post(async (req, res) => {
    const { id: noteId } = req.query
    const { type, prevCellId } = req.body

    // noteId is invalid
    if (typeof noteId !== 'string' || !mongoose.isValidObjectId(noteId)) {
      throw new HTTPError(406, 'Invalid noteId')
    }

    const currNumCells = await getNumCellsByUser(req.user!.id)
    const cellsLimit = CELL_LIMITS[req.user!.role]

    if (currNumCells >= cellsLimit) {
      throw new HTTPError(403, 'Plan quota reached')
    }

    // Cell type is invalid
    if (!VALID_CELL_TYPES.has(type)) {
      throw new HTTPError(
        406,
        'Invalid cell type. Valid types are ' + Array.from(VALID_CELL_TYPES).join(', ')
      )
    }

    const note: Document & INote = await Note.findOne({ _id: noteId, owner: req.user!.id })

    if (!note) {
      throw new HTTPError(404)
    }

    const newCellId = 'c_' + nanoid()
    const newCell: ICell = {
      _id: newCellId,
      type,
      contents: '',
    }

    // Add new cell
    note.set(`cells.${newCellId}`, newCell)

    // Put new cell in correct position in order array
    const prevCellIndex = note.order.findIndex(id => id === prevCellId)
    if (prevCellIndex === -1) {
      note.order.unshift(newCellId)
    } else {
      note.order.splice(prevCellIndex + 1, 0, newCellId)
    }

    await note.save()

    res.status(201).send({ cell: newCell })
  })
