'use client'

import { IntItem } from '../types'
import cn from 'classnames'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

export const Navigation = (props: { items: IntItem[] }) => {
  const pathname = usePathname()

  return (
    <nav className="flex flex-col md:flex-row md:ml-6 md:items-center">
      {props.items.map((item) => (
        <Link
          key={item.name}
          href={item.href}
          className={cn(
            'flex font-medium md:inline-block items-center justify-between outline-none border-b-0 border-transparent text-base md:text-sm hover:text-primary-main md:border-b-[3px] px-5 py-2 md:px-3 md:py-3',
            {
              'text-primary-main border-primary-main': item.href === pathname,
            },
          )}
        >
          {item.name}
          {item.icon}
        </Link>
      ))}
    </nav>
  )
}
