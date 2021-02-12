import type { NextApiResponse } from 'next'
import { getSession } from 'next-auth/client'
import type { Middleware as IMiddleware } from 'next-connect'
import type { ExtendedApiRequest } from '#src/types/extended-api-types'
import noop from '#src/utils/noop'
import HTTPError from './errors'
import { dbConnect } from '../db'
import { User } from '../db/models'

type Middleware = IMiddleware<ExtendedApiRequest, NextApiResponse>

export const checkAuth: Middleware = async (req, _res, next) => {
  const session = await getSession({ req })

  // req.user = session?.user ?? ({ id: '600e824a5ba80e6e94fd17c5' } as any)

  req.user = session?.user ?? null
  if (req.user) {
    const dbUser = await User.findById(req.user.id)
    req.user.role = dbUser.role
  }

  next()
}

export const ensureAuth: Middleware = async (req, res, next) => {
  if (typeof req.user === 'undefined') await checkAuth(req, res, noop)

  if (!req.user) throw new HTTPError(401)

  next()
}

export const ensureDbConnection: Middleware = async (_req, _res, next) => {
  await dbConnect()
  next()
}
