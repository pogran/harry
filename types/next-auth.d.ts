import { EnRole } from '@prisma/client'

export interface JwtUser {
  id: number
  email: string
  username: string
  image: string
  accessToken: string
  role: EnRole
  isAdult: boolean | null
}

declare module 'next-auth' {
  /**
   * Returned by `useSession`, `getSession` and received as a prop on the `SessionProvider` React Context
   */
  interface Session {
    user: JwtUser
    expires: string
  }

  interface User {
    username: string
    isAdult: boolean | null
    accessToken?: string
    role: EnRole
  }

  interface Profile {
    email_verified: boolean
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    user: JwtUser
  }
}
