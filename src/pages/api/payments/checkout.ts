import { nc } from '#src/lib/api'
import { ensureAuth } from '#src/lib/api/middleware'
import { getStripe, getUserStripeId } from '#src/lib/stripe'

const BASE_URL = process.env.NEXTAUTH_URL
const PRICE_ID = process.env.PREMIUM_PRICE_ID

export default nc()
  .use(ensureAuth)
  .post(async (req, res) => {
    const stripe = getStripe()

    const customerId = await getUserStripeId(req.user!.id)

    try {
      const checkoutSession = await stripe.checkout.sessions.create({
        mode: 'subscription',
        line_items: [{ price: PRICE_ID, quantity: 1 }],
        payment_method_types: ['card'],
        cancel_url: `${BASE_URL}/app/dashboard`,
        success_url: `${BASE_URL}/app/dashboard/billing`,
        customer: customerId,
      })

      res.json({ sessionId: checkoutSession.id })
    } catch (err) {
      console.log(err)
      res.status(400).end()
    }
  })
