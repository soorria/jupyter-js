import { buffer } from 'micro'
import { nc } from '#src/lib/api'
import { getStripe } from '#src/lib/stripe'
import { PageConfig } from 'next'
import type Stripe from 'stripe'
import { UserDocument } from '#src/types/User'
import { User } from '#src/lib/db/models'

// Make development a bit easier
// Don't need to restart server to update testing webhook secret
const WEBHOOK_SECRET =
  process.env.NODE_ENV === 'production'
    ? process.env.STRIPE_WEBHOOK_SECRET
    : 'whsec_Cpki6UYAGmOSfHlDt9mMXeotyZtN3581'

export default nc().post(async (req, res) => {
  const stripe = getStripe()
  const body = await buffer(req)

  let event: Stripe.Event

  try {
    event = stripe.webhooks.constructEvent(
      body,
      req.headers['stripe-signature'] || '',
      WEBHOOK_SECRET
    )
  } catch (err) {
    console.log(err)
    return res.status(400).end()
  }

  switch (event.type) {
    case 'customer.subscription.updated':
    case 'customer.subscription.created': {
      const data = event.data.object as Stripe.Subscription
      const user: UserDocument = await User.findOne({ stripeId: data.customer })
      if (data.status === 'active') {
        user.role = 'premium'
      }
      await user.save()
      break
    }
    case 'customer.subscription.deleted': {
      const data = event.data.object as Stripe.Subscription
      const user: UserDocument = await User.findOne({ stripeId: data.customer })
      user.role = 'basic'
      await user.save()
      break
    }
    default: {
      break
    }
  }

  res.end()
})

export const config: PageConfig = {
  api: {
    bodyParser: false,
  },
}
