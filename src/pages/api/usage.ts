import { nc } from '#src/lib/api'
import { ensureAuth, ensureDbConnection } from '#src/lib/api/middleware'
import { getUserUsage } from '#src/lib/db/aggregates'

export default nc()
  .use(ensureAuth, ensureDbConnection)
  .get(async (req, res) => {
    const uid = req.user!.id

    const usage = await getUserUsage(uid)

    res.json({ usage, role: req.user!.role })
  })
