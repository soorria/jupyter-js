import { nc } from '#src/lib/api'
import HTTPError from '#src/lib/api/errors'
import { ensureAuth, ensureDbConnection } from '#src/lib/api/middleware'
import { Note } from '#src/lib/db/models'
import INote, { NoteDocument } from '#src/types/Note'
import { isValidObjectId } from 'mongoose'

export default nc()
  .use(ensureAuth, ensureDbConnection)
  .use((req, res, next) => {
    if (req.method === 'PATCH') {
      console.log({ req, res })
    }
    next()
  })
  .get(async (req, res) => {
    const id = req.query.id as string

    if (!isValidObjectId(id)) {
      throw new HTTPError(404)
    }

    const note = await Note.findOne({ _id: id, owner: req.user!.id })
    if (!note) throw new HTTPError(404)

    res.json({ note })
  })
  .patch(async (req, res) => {
    const updates: Partial<INote> = req.body

    const note: NoteDocument = await Note.findOne({ _id: req.query.id, owner: req.user!.id })

    if (!note) {
      throw new HTTPError(404)
    }

    let updated = false

    if (updates.title) {
      note.title = updates.title
      updated = true
    }

    if (updates.order) {
      // 1. updated order should still be an array
      if (!Array.isArray(updates.order)) {
        throw new HTTPError(406, 'Order must be an array')
      }

      // 2. updated order length should be the same
      if (updates.order.length !== note.order.length) {
        throw new HTTPError(406, 'Order length cannot be changed')
      }

      const updateSet = new Set(updates.order)

      // 3. should not have duplicated
      if (updateSet.size !== updates.order.length) {
        throw new HTTPError(406, 'Order cannot have duplicates')
      }

      // 4. Every item in current order should be in updated order.
      // with [2] ensures that there are no new items either
      if (!note.order.every(cellId => updateSet.has(cellId))) {
        throw new HTTPError(406, 'Order cannot be added to / removed from')
      }

      note.order = updates.order
      updated = true
    }

    // Only mutate db if there are changes
    if (updated) {
      await note.save()
    }

    console.log({ updated })

    res.status(204).end()
  })
  .delete(async (req, res) => {
    const { id } = req.query

    if (!isValidObjectId(id)) {
      throw new HTTPError(406, 'Invalid note id')
    }

    const result = await Note.findOneAndDelete({ _id: id, owner: req.user!.id })

    if (!result) {
      throw new HTTPError(404)
    }

    res.status(204).end()
  })
