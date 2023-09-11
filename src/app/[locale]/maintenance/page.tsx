import { Metadata } from 'next'
import { getTranslations } from 'next-intl/server'

import Head from 'next/head'
import { Fragment } from 'react'
import { Icon } from 'src/components/common/Icon'

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations()
  const title = t('Service unavailable')
  const description = t('Service unavailable')

  const url = `${process.env.NEXT_PUBLIC_ENV_DOMAIN}/maintenance`

  return {
    title,
    description,
    alternates: {
      canonical: url,
    },
    openGraph: {
      description,
      title,
      url,
    },
  }
}

export default async function MaintenancePage() {
  const t = await getTranslations()

  return (
    <Fragment>
      <Head>
        <meta name="robots" content="noindex, nofollow" />
      </Head>

      <main className="grid min-h-screen place-content-center justify-items-center p-12 text-center">
        <Icon
          name="wrenchScrewdriver"
          className="h-12 w-12 text-yellow-500 dark:text-yellow-600 sm:h-16 sm:w-16"
        />
        <h1 className="mt-2 text-2xl font-bold tracking-tight dark:text-gray-300 text-gray-900 sm:text-4xl">
          {t("We'll be back soon!")}
        </h1>
        <p className="mt-2 max-w-lg text-base text-gray-500 dark:text-gray-250">
          {t(
            'Sorry for the inconvenience, We’re performing some maintenance at the moment, We’ll be back up shortly!',
          )}
        </p>
      </main>
    </Fragment>
  )
}
