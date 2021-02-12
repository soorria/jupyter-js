import 'next-auth'
import { UserRole } from './User'

declare module 'next-auth' {
  interface User {
    id: string
    username: string
    role: UserRole
  }
}
