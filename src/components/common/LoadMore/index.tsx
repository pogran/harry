'use client'

import { useTranslations } from 'next-intl'
import { memo } from 'react'
import { Icon } from '../Icon'

export const LoadMore = memo(function LoadMore(props: { onClick: () => void }) {
  const t = useTranslations()

  return (
    <button
      className="flex w-full justify-center text-primary-main hover:text-primary-hover py-1 mt-5 outline-none"
      aria-label={t('More')}
      title={t('More')}
      onClick={props.onClick}
    >
      <Icon name="chevronDown" className="animate-bounce !w-8 !h-8 link" />
    </button>
  )
})
