export const __prod__ = process.env.NODE_ENV === 'production'
export const __dev__ = !__prod__

export const __is_server__ = typeof window === 'undefined'
export const __is_client__ = !__is_server__
