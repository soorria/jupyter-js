export const __prod__ = process.env.NODE_ENV === 'production'
export const __dev__ = !__prod__

export const __is_server__ = typeof window === 'undefined'
export const __is_client__ = !__is_server__

export const NOTE_LIMITS = {
  basic: 1,
  premium: Number.MAX_SAFE_INTEGER,
} as const

export const CELL_LIMITS = {
  basic: 10,
  premium: Number.MAX_SAFE_INTEGER,
} as const
