import { NOTE_LIMITS } from '#src/constants'
import { nc } from '#src/lib/api'
import HTTPError from '#src/lib/api/errors'
import { ensureAuth } from '#src/lib/api/middleware'
import { getNumNotesByUser } from '#src/lib/db/aggregates'
import { Note } from '#src/lib/db/models'
import sleep from '#src/utils/sleep'

const handler = nc()
  .use(ensureAuth)
  .get(async (req, res) => {
    const uid = req.user!.id

    const notes = await Note.find({ owner: uid }, { cells: 0 })

    res.json({ notes })
  })
  .post(async (req, res) => {
    await sleep(1000)
    const uid = req.user!.id

    const currNumNotes = await getNumNotesByUser(uid)
    const notesLimit = NOTE_LIMITS[req.user!.role]

    if (currNumNotes >= notesLimit) {
      throw new HTTPError(403, 'Plan quota reached')
    }

    const note = new Note({
      owner: uid,
    })

    await note.save()

    res.status(201).json({ note })
  })

export default handler
