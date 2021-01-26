import { NextApiRequest } from 'next'
import { User } from 'next-auth'

export type ExtendedApiRequest = NextApiRequest & { user: User | null }
