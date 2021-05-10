import { nc } from '#src/lib/api'
import { ensureAuth } from '#src/lib/api/middleware'
import { getStripe, getUserStripeId } from '#src/lib/stripe'

export default nc()
  .use(ensureAuth)
  .post(async (req, res) => {
    const customerId = await getUserStripeId(req.user!.id)

    const stripe = getStripe()

    const portalSession = await stripe.billingPortal.sessions.create({
      customer: customerId,
      return_url: `${process.env.NEXTAUTH_URL}/app/dashboard`,
    })

    res.json({ url: portalSession.url })
  })
