/* eslint-disable @next/next/no-head-element */
import { cookies, headers } from 'next/headers'
import ThemeProvider from 'src/components/providers/ThemeProvider'

import './globals.css'
import 'react-notifications-component/dist/theme.css'
import 'react-tooltip/dist/react-tooltip.css'
import { Session } from 'next-auth'
import AuthProvider from 'src/components/providers/AuthProvider'
import ModalProvider from 'src/components/providers/ModalProvider'
import { Exo_2 } from '@next/font/google'
import { NextIntlClientProvider } from 'next-intl'
import { EnTheme } from 'src/enums'
import { Icon } from 'src/components/common/Icon'
import Header from 'src/components/layout/Header'
import { HeaderWrapper } from 'src/components/layout/Header/HeaderWrapper'
import Footer from 'src/components/layout/Footer'
import { Metrics } from 'src/components/layout/Header/Metrics'
import RouteEvent from 'src/components/layout/Header/RouteEvent'
import Modals from 'src/components/modals'
import TooltipProviderWrapper from 'src/components/providers/TooltipProviderWrapper'
import SessionProviderWrapper from 'src/components/providers/SessionProviderWrapper'
import { Suspense } from 'react'

const exo2 = Exo_2({
  variable: '--font-inter',
  subsets: ['latin'],
  display: 'swap',
})

export async function getSession(cookie: string): Promise<Session | null> {
  const response = await fetch(`${process.env.NEXTAUTH_URL}/api/auth/session`, {
    headers: {
      cookie,
    },
  })

  const session = await response.json()

  return Object.keys(session).length > 0 ? session : null
}

export default async function RootLayout(props: { children: React.ReactNode }) {
  const nextCookies = cookies()
  const theme =
    (nextCookies.get('theme')?.value as undefined | EnTheme) || EnTheme.DARK

  const session = await getSession(headers().get('cookie') ?? '')
  const messages = (await import(`../../messages/ru.json`)).default

  const renderTemplate = () => {
    if (process.env.NEXT_PUBLIC_ENV_IS_MAINTENANCE === 'true') {
      return (
        <ThemeProvider currentTheme={theme}>{props.children}</ThemeProvider>
      )
    }

    return (
      <Suspense>
        <SessionProviderWrapper session={session}>
          <AuthProvider session={session}>
            <ThemeProvider currentTheme={theme}>
              <ModalProvider>
                <TooltipProviderWrapper>
                  <div className="content-block font-sans">
                    <HeaderWrapper>
                      <Header
                        items={[
                          {
                            name: messages['Catalog'],
                            href: '/books',
                            icon: (
                              <Icon name="listBullet" className="md:hidden" />
                            ),
                          },
                          {
                            name: messages['Search'],
                            href: '/search',
                            icon: <Icon name="search" className="md:hidden" />,
                          },
                        ]}
                      />
                    </HeaderWrapper>
                    {props.children}
                    <Modals />
                  </div>
                </TooltipProviderWrapper>
                <Footer
                  links={[
                    {
                      href: 'https://t.me/topmangachat',
                      target: '_blank',
                      rel: 'nofollow',
                      title: messages['Wishes and bugs here'],
                    },
                  ]}
                />
              </ModalProvider>
            </ThemeProvider>
          </AuthProvider>
        </SessionProviderWrapper>
      </Suspense>
    )
  }

  return (
    <html className={exo2.variable} lang="ru">
      <head>
        <meta
          name="viewport"
          content="width=device-width,initial-scale=1,minimum-scale=1"
        />

        <meta charSet="utf-8" />
        <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
        <link rel="manifest" href="/manifest.json" />
        <link href="/favicon.svg" rel="icon" type="image/svg+xml" />

        <link
          href="/icons/favicon-16x16.png"
          rel="icon"
          type="image/png"
          sizes="16x16"
        />
        <link
          href="/icons/favicon-32x32.png"
          rel="icon"
          type="image/png"
          sizes="32x32"
        />

        <meta name="keywords" content={messages['Keywords']} />
        <link rel="apple-touch-icon" href="/icons/favicon.png" />
        <meta name="rootURL" content={process.env.NEXT_PUBLIC_ENV_DOMAIN} />
        <meta
          name="apple-mobile-web-app-title"
          content={process.env.NEXT_PUBLIC_ENV_APP_NAME}
        />
        <meta
          name="application-name"
          content={process.env.NEXT_PUBLIC_ENV_APP_NAME}
        />
        <meta
          property="og:site_name"
          content={process.env.NEXT_PUBLIC_ENV_SITE_NAME}
        />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta property="og:type" content="website" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta property="og:locale" content="ru_RU" />
        <meta name="theme-color" content="#161b22" />
      </head>
      <NextIntlClientProvider locale="ru" messages={messages}>
        <body className={`min-h-screen ${theme}`}>{renderTemplate()}</body>
      </NextIntlClientProvider>
      {process.env.NODE_ENV === 'production' && <Metrics />}
      {process.env.NODE_ENV === 'production' && <RouteEvent />}
    </html>
  )
}
