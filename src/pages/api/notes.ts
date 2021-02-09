import { nc } from '#src/lib/api'
import { ensureAuth, ensureDbConnection } from '#src/lib/api/middleware'
import { Note } from '#src/lib/db/models'
import sleep from '#src/utils/sleep'

const handler = nc()
  .use(ensureAuth, ensureDbConnection)
  .get(async (req, res) => {
    const uid = req.user!.id

    const notes = await Note.find({ owner: uid }, { cells: 0 })

    res.json({ notes })
  })
  .post(async (req, res) => {
    await sleep(1000)

    const note = new Note({
      owner: req.user!.id,
    })

    await note.save()

    res.status(201).json({ note })
  })

export default handler
