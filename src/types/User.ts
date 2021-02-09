import { Document } from 'mongoose'

interface IUser {
  _id: string
  name: string
  image?: string
  email?: string
}

export type UserDocument = IUser & Document

export default IUser
