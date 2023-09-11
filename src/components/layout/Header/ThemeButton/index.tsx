'use client'

import { ThemeContext } from 'src/components/providers/ThemeProvider'
import { memo, useContext } from 'react'
import cn from 'classnames'
import { useTranslations } from 'next-intl'
import { Icon } from 'src/components/common/Icon'
import { EnTheme } from 'src/enums'

export const ThemeButton = memo(function ThemeButton(props: {
  className?: string
}) {
  const { theme, toggleTheme } = useContext(ThemeContext)
  const t = useTranslations()

  return (
    <button
      onClick={() => {
        toggleTheme(theme === EnTheme.DARK ? EnTheme.LIGHT : EnTheme.DARK)
      }}
      className={cn(
        'rounded-md p-2 lg:p-1 lg:hover:text-gray-500 lg:dark:hover:text-white flex-shrink-0 text-gray-400 dark:text-gray-200 focus:outline-none',
        props.className,
      )}
    >
      <span className="sr-only">{t('Theme')}</span>
      {theme === EnTheme.DARK ? (
        <Icon name="sun" className="block" />
      ) : (
        <Icon name="moon" className="block" />
      )}
    </button>
  )
})
