'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { memo } from 'react'
import cn from 'classnames'

export const LogoWrapper = memo(function LogoWrapper(props: {
  className?: string
  children: React.ReactNode
}) {
  const pathname = usePathname()

  if (pathname === '/') {
    return <div className={cn(props.className)}>{props.children}</div>
  }

  return (
    <Link className={cn(props.className)} href="/">
      {props.children}
    </Link>
  )
})
