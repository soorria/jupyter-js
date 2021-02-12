export type PickPartial<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>
export type ID<T> = (arg: T) => T
