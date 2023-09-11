'use client'

import { Session } from 'next-auth'
import { SessionProvider } from 'next-auth/react'

interface IntProps {
  children: React.ReactNode
  session: Session | null
}

export default function SessionProviderWrapper({
  children,
  session,
}: IntProps) {
  return <SessionProvider session={session}>{children}</SessionProvider>
}
