import { NextApiHandler } from 'next'
import NextAuth, { InitOptions } from 'next-auth'

import Providers from 'next-auth/providers'

console.log('@@@@@' + Date.now())

const options: InitOptions = {
  providers: [
    Providers.GitHub({
      clientId: process.env.GITHUB_CLIENT_ID,
      clientSecret: process.env.GITHUB_CLIENT_SECRET,
    }),
  ],
  database: process.env.MONGO_URI,
}

const handler: NextApiHandler = (req, res) => {
  console.log(req, res)
  NextAuth(req, res, options)
}

export default handler
