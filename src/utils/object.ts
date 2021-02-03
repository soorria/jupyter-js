export const get = <T = any>(
  obj: Record<string, any>,
  path: string | number,
  fallback?: T
): T | undefined => {
  const pathParts = typeof path === 'string' ? path.split('.') : [path]

  for (const key of pathParts) {
    if (!obj) return
    obj = obj[key]
  }

  return obj === undefined ? fallback : (obj as T)
}
