'use client'

import { usePathname } from 'next/navigation'
import React, { useState, useEffect } from 'react'

export default function RouteEvent() {
  const pathname = usePathname()
  const [route, setRoute] = useState(pathname)

  useEffect(() => {
    if (pathname !== route) {
      window.ym(
        +process.env.NEXT_PUBLIC_ENV_YANDEX_METRICS_ID,
        'hit',
        process.env.NEXT_PUBLIC_ENV_DOMAIN + pathname,
      )
    }
    setRoute(pathname)
  }, [pathname, route])

  return <React.Fragment />
}
