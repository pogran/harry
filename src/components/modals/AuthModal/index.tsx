'use client'

import { memo } from 'react'
import { Auth } from 'src/components/pages/auth/signin'
import { usePathname } from 'next/navigation'

export const AuthModal = memo(function AuthModal() {
  const pathname = usePathname()

  return <Auth callbackUrl={pathname || undefined} />
})

export default AuthModal
