'use client'

import cn from 'classnames'
import React from 'react'
import { useEffect, useState } from 'react'
import { useTranslations } from 'next-intl'
import { Icon } from 'src/components/common/Icon'

interface IntProps {
  children: React.ReactNode
}

export default function DescriptionWrapper({ children }: IntProps) {
  const ref = React.createRef<HTMLDivElement>()
  const [short, setShort] = useState<boolean | null>(null)
  const t = useTranslations()

  useEffect(() => {
    if (!ref.current) {
      return
    }

    if (short === null) {
      setShort(ref.current.offsetHeight < ref.current.scrollHeight)
    }
  }, [ref, short])

  return (
    <React.Fragment>
      <div
        ref={ref}
        className={cn('', {
          'line-clamp-5': short === null || short,
        })}
      >
        {children}
      </div>
      <p
        className={cn(
          'text-primary-main h-6 cursor-pointer font-medium hover:text-primary-hover flex text-tiny items-center',
          {
            invisible: !short,
          },
        )}
        onClick={() => short && setShort(false)}
      >
        {t('Unwrap')}
        <Icon name="chevronDown" className="ml-1 !h-3 !w-3" />
      </p>
    </React.Fragment>
  )
}
