'use client'

import { createContext, useState } from 'react'
import { Session } from 'next-auth'
import { JwtUser } from 'types/next-auth'
import { useSession } from 'next-auth/react'

export const AuthContext = createContext<{
  session: Session | null
  updateSessionUser: (value: Partial<JwtUser>) => void
}>({
  session: null,
  updateSessionUser: (value: Partial<JwtUser>) => {},
})

interface IntProps {
  children: React.ReactNode
  session: Session | null
}

export default function AuthProvider({ children, session }: IntProps) {
  const [userSession, setUserSession] = useState<Session | null>(session)
  const { update } = useSession()

  return (
    <AuthContext.Provider
      value={{
        session: userSession,
        updateSessionUser: (value: Partial<JwtUser>) => {
          if (!userSession) {
            return
          }

          update({
            ...userSession,
            user: {
              ...userSession.user,
              ...value,
            },
          })

          setUserSession({
            ...userSession,
            user: { ...userSession.user, ...value },
          })
        },
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}
