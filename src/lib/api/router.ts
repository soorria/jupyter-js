import { NextApiResponse } from 'next'
import morgan from 'morgan'
import nextConnect, { NextConnect } from 'next-connect'
import { ExtendedApiRequest } from '#src/types/extended-api-types'

export const nc = (): NextConnect<ExtendedApiRequest, NextApiResponse> =>
  nextConnect<ExtendedApiRequest, NextApiResponse>({
    onNoMatch: (_req, res) => {
      res.status(404)
      console.log(res.statusMessage)
      res.end()
    },
    onError: (err, _req, res) => {
      console.log(err)
      res.status(err.code || 500)
      res.send(err.message || 'Server Error')
    },
  }).use(morgan('dev'))
