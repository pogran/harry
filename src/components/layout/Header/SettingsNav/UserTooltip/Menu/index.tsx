import { useTranslations } from 'next-intl'
import { usePathname, useRouter } from 'next/navigation'
import { memo, useContext, useMemo } from 'react'
import { Icon } from 'src/components/common/Icon'
import { AuthContext } from 'src/components/providers/AuthProvider'
import { signOut } from 'next-auth/react'
import { ThemeContext } from 'src/components/providers/ThemeProvider'
import { EnTheme } from 'src/enums'
import cn from 'classnames'

export const Menu = memo(function Menu(props: { close: () => void }) {
  const { session } = useContext(AuthContext)
  const pathname = usePathname()
  const { theme, toggleTheme } = useContext(ThemeContext)
  const router = useRouter()
  const t = useTranslations()

  const buttons: {
    id: string
    name: string
    icon: JSX.Element
    active?: boolean
    onClick: () => void
  }[] = useMemo(() => {
    const buttons = []

    if (session) {
      buttons.push({
        id: 'bookmarks',
        name: t('Bookmarks'),
        active: pathname === '/user/bookmarks',
        icon: <Icon name="bookmark" className="w-6 h-6 md:w-5 md:h-5" />,
        onClick: () => {
          router.push('/user/bookmarks')
        },
      })

      buttons.push({
        id: 'settings',
        name: t('Settings'),
        active: pathname === '/user/settings',
        icon: <Icon name="settings" className="w-6 h-6 md:w-5 md:h-5" />,
        onClick: () => {
          router.push('/user/settings')
        },
      })
    }

    buttons.push({
      id: 'theme',
      name: t('Change theme'),
      icon: (
        <Icon
          className="!w-5 !h-5"
          name={theme == EnTheme.DARK ? 'sun' : 'moon'}
        />
      ),
      onClick: () => {
        toggleTheme(theme === EnTheme.DARK ? EnTheme.LIGHT : EnTheme.DARK)
      },
    })

    if (session) {
      buttons.push({
        id: 'logout',
        name: t('Exit'),
        icon: <Icon name="arrowRightOnRectangle" />,
        onClick: () => {
          signOut()
        },
      })
    }

    return buttons
  }, [pathname, router, session, t, theme, toggleTheme])

  return (
    <nav className="flex flex-col">
      {buttons.map((button) => (
        <div
          onClick={() => {
            button.onClick()
            props.close()
          }}
          key={button.id}
          className={cn(
            'flex hover:bg-gray-100 cursor-pointer dark:hover:bg-black-700 font-medium items-center justify-between outline-none border-b-0 border-transparent text-base md:text-sm hover:text-primary-main px-5 py-2 md:px-3 md:py-30',
            {
              'text-primary-main': button.active,
            },
          )}
        >
          <div className="text-base md:text-sm font-medium">{button.name}</div>
          {button.icon && button.icon}
        </div>
      ))}
    </nav>
  )
})
