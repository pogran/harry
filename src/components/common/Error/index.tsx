import { memo } from 'react'
import cn from 'classnames'
import { useTranslations } from 'next-intl'

export const Error = memo(function Error(props: {
  message?: string
  className?: string
}) {
  const { message, className } = props
  const t = useTranslations()

  return (
    <p className={cn('text-red-600 dark:text-red-500', className)}>
      {message ?? t('Error happend')}
    </p>
  )
})
