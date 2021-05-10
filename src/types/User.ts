import { Document } from 'mongoose'

export type UserRole = 'basic' | 'premium'

interface IUser {
  _id: string
  name: string
  role: UserRole
  username?: string
  image?: string
  email?: string
  stripeId?: string
}

export type UserDocument = IUser & Document<string>

export default IUser
