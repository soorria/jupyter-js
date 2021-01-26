import { STATUS_CODES } from 'http'

class HTTPError extends Error {
  code: number
  message: string
  constructor(code: number, message?: string) {
    super(message)
    this.code = code
    this.message = message || STATUS_CODES[code] || 'Unnamed Error'
  }
}

export default HTTPError
