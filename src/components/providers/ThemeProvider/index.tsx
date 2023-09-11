'use client'

import { createContext, useState, useEffect } from 'react'
import { setCookie } from 'cookies-next'
import { ReactNotifications } from 'react-notifications-component'
import Image from 'next/image'
import { EnTheme } from 'src/enums'

export const ThemeContext = createContext({
  theme: EnTheme.DARK,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  toggleTheme: (value: EnTheme) => {},
})

export default function ThemeProvider(props: {
  children: React.ReactNode
  currentTheme: EnTheme
}) {
  const [theme, setTheme] = useState(props.currentTheme)

  useEffect(() => {
    const html = document.getElementsByTagName('html')[0]
    if (theme === EnTheme.LIGHT) {
      html.classList.remove('bg-black-900')
    } else {
      html.classList.add('bg-black-900')
    }
  }, [theme])

  return (
    <ThemeContext.Provider
      value={{
        theme,
        toggleTheme: (value) => {
          setCookie('theme', value)
          setTheme(value)
        },
      }}
    >
      {process.env.NODE_ENV === 'production' && (
        <noscript>
          <div>
            <Image
              width={1}
              height={1}
              alt="yandex metrics"
              style={{ position: 'relative', left: '-9999px' }}
              src={`https://mc.yandex.ru/watch/${process.env.NEXT_PUBLIC_ENV_YANDEX_METRICS_ID}`}
            />
          </div>
        </noscript>
      )}
      <div className="min-h-screen bg-white dark:bg-black-900 text-black-1000 dark:text-gray-75">
        <ReactNotifications />
        {props.children}
      </div>
    </ThemeContext.Provider>
  )
}
