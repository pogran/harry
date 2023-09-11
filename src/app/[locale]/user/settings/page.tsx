import { getSession } from 'src/app/layout'
import { headers } from 'next/headers'
import { redirect } from 'next/navigation'
import { prisma } from 'src/instances/prisma'
import { Metadata } from 'next'
import { getTranslations } from 'next-intl/server'
import Bookmarks from 'src/components/pages/user/bookmarks'
import UserSettings from 'src/components/pages/user/settings'

async function getBookmarks(userId: number) {
  return prisma.bookmark.findMany({
    where: {
      userId,
    },
    include: {
      chapter: true,
      book: true,
    },
  })
}

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations()
  const title = t('Settings')
  const description = t('User settings')

  const url = process.env.NEXT_PUBLIC_ENV_DOMAIN + '/user/settings'

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

export default async function PageUserSettings() {
  const session = await getSession(headers().get('cookie') ?? '')

  if (!session) {
    return redirect('/')
  }

  return (
    <div className="sm:max-w-7xl px-2 xl:px-0 md:mx-auto py-4">
      <UserSettings />
    </div>
  )
}
