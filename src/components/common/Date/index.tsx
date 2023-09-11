'use client'

import dayjs from 'dayjs'
import utc from 'dayjs/plugin/utc'
import relativeTime from 'dayjs/plugin/relativeTime'
import { memo, useMemo } from 'react'
import cn from 'classnames'

import 'dayjs/locale/ru'
import { useTranslations } from 'next-intl'

dayjs.locale('ru')
dayjs.extend(utc)
dayjs.extend(relativeTime)

export const Date = memo(function Date(props: {
  date: Date | string
  wrapperClass?: string
}) {
  const { date, wrapperClass = '' } = props

  const t = useTranslations()
  const hours = useMemo(() => dayjs().diff(dayjs(date), 'hours'), [date])
  const colorClass = useMemo(() => {
    switch (true) {
      case hours < 1: {
        return 'text-green-500'
      }

      case hours < 24: {
        return 'text-primary-main'
      }

      default: {
        return 'text-gray-400 dark:text-gray-250'
      }
    }
  }, [hours])
  const inlineDate = useMemo(() => {
    switch (true) {
      case hours < 24: {
        const inlineDate = dayjs(date).utc().local().fromNow()
        if (inlineDate === t('some seconds ago')) {
          return t('less then a minute')
        }
        return inlineDate
      }
      default: {
        return dayjs(date).utc().local().format('DD.MM.YYYY')
      }
    }
  }, [hours, date, t])

  return (
    <time className={cn('text-xs lg:text-sm ', colorClass, wrapperClass)}>
      {inlineDate}
    </time>
  )
})
