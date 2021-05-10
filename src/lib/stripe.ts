import { UserDocument } from '#src/types/User'
import Stripe from 'stripe'
import { User } from './db/models'

let stripe: Stripe

if (!process.env.STRIPE_PRIVATE_KEY) {
  throw new Error("STRIPE_PRIVATE_KEY environment variable isn't set")
}

export const getStripe = (): Stripe => {
  if (!stripe) {
    stripe = new Stripe(process.env.STRIPE_PRIVATE_KEY, {
      apiVersion: '2020-08-27',
    })
  }
  return stripe
}

export const getUserStripeId = async (userId: string): Promise<string> => {
  const stripe = getStripe()
  const user: UserDocument = await User.findById(userId)

  if (!user.stripeId) {
    const stripeCustomer = await stripe.customers.create()
    user.stripeId = stripeCustomer.id
    await user.save()
  }

  return user.stripeId
}
