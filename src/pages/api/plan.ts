import { nc } from '#src/lib/api'
import { ensureAuth } from '#src/lib/api/middleware'

export default nc()
  .use(ensureAuth)
  .get((req, res) => res.json({ plan: req.user?.role }))
