import { nc } from '#src/lib/api'
import HTTPError from '#src/lib/api/errors'
import { ensureAuth } from '#src/lib/api/middleware'
import { Note } from '#src/lib/db/models'
import { isValidObjectId } from 'mongoose'

export default nc()
  .use(ensureAuth)
  .patch(async (req, res) => {
    const { id: noteId, cellId } = req.query
    const { contents } = req.body

    if (typeof noteId !== 'string' || !isValidObjectId(noteId)) {
      throw new HTTPError(406, 'Invalid noteId')
    }

    if (typeof contents !== 'string') {
      console.log({ contents })
      throw new HTTPError(406, 'Invalid contents')
    }

    const note = await Note.findOne({ _id: noteId, owner: req.user!.id })

    if (!note) {
      throw new HTTPError(404)
    }

    if (!note.get(`cells.${cellId}`)) {
      throw new HTTPError(404)
    }

    // This seems to be the best way to set the contents of an object in a Map
    ;(note.cells as any)!.get(cellId).contents = contents

    await note.save()

    res.status(204).end()
  })
  .delete(async (req, res) => {
    const { id: noteId, cellId } = req.query

    if (typeof noteId !== 'string' || !isValidObjectId(noteId)) {
      throw new HTTPError(406, 'Invalid noteId')
    }

    const note = await Note.findOne({ _id: noteId, owner: req.user!.id })

    if (!note) {
      throw new HTTPError(404)
    }

    if (!note.get(`cells.${cellId}`)) {
      throw new HTTPError(404)
    }

    // Delete from Map
    ;(note.cells as any)!.delete(cellId)
    note.order = note.order.filter(id => id !== cellId)

    await note.save()

    res.status(204).end()
  })
