import { Metadata } from 'next'
import { getTranslations } from 'next-intl/server'
import Search from 'src/components/pages/search'
import { SEARCH_GRID_BOOKS } from 'src/config'

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations()
  const title = t('Search')
  const description = t('Search favorite manga')

  const url = process.env.NEXT_PUBLIC_ENV_DOMAIN + '/search'
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

export default async function PageSearch() {
  return (
    <div className="sm:max-w-7xl pb-0 md:mx-auto pt-4">
      <Search limit={SEARCH_GRID_BOOKS} />
    </div>
  )
}
