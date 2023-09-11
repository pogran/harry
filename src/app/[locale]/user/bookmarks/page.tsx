import { getSession } from 'src/app/layout'
import { headers } from 'next/headers'
import { redirect } from 'next/navigation'
import { prisma } from 'src/instances/prisma'
import { Metadata } from 'next'
import { getTranslations } from 'next-intl/server'
import Bookmarks from 'src/components/pages/user/bookmarks'
import { isHentai } from 'src/helpers/main.helper'

async function getBookmarks(userId: number) {
  return prisma.bookmark.findMany({
    where: {
      userId,
      isHentai: isHentai(),
    },
    include: {
      chapter: true,
      book: true,
    },
  })
}

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations()
  const title = t('Bookmarks')
  const description = t('User bookmarks')

  const url = process.env.NEXT_PUBLIC_ENV_DOMAIN + '/user/bookmarks'

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

export default async function PageUserBookmarks() {
  const session = await getSession(headers().get('cookie') ?? '')

  if (!session) {
    return redirect('/')
  }

  const bookmarks = await getBookmarks(session.user.id)

  return (
    <div className="sm:max-w-7xl px-2 xl:px-0 pb-0 md:mx-auto pt-4">
      <Bookmarks bookmarksJson={JSON.stringify(bookmarks)} session={session} />
    </div>
  )
}
