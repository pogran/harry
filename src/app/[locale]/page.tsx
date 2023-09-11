import { EnBookStatus } from '@prisma/client'
import { isHentai } from 'src/helpers/main.helper'
import { prisma } from 'src/instances/prisma'
import { getTranslations } from 'next-intl/server'
import { Metadata } from 'next'
import ScrollWrapper from 'src/components/common/ScrollWrapper'
import { BookItem } from 'src/components/common/Item/BookItem'

export const revalidate = 300

async function getUpdates() {
  return await prisma.book.findMany({
    where: {
      status: {
        not: EnBookStatus.DRAFT,
      },
      isHentai: isHentai(),
    },
    take: 100,
    orderBy: {
      newUploadAt: 'asc',
    },
    include: {
      lastChapter: true,
    },
  })
}

async function getTopBooks() {
  return prisma.book.findMany({
    where: {
      id: {
        in: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14],
      },
    },
    take: 20,
  })
}

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations()
  const title = t('Main title')
  const description = t('Main description')

  const url = process.env.NEXT_PUBLIC_ENV_DOMAIN + '/'

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

export default async function Page() {
  const updates = await getUpdates()
  const topBooks = await getTopBooks()

  const t = await getTranslations()

  return (
    <>
      <ScrollWrapper>
        {topBooks.map((book) => (
          <BookItem key={book.id} book={book} />
        ))}
      </ScrollWrapper>

      <div className="mx-auto sm:max-w-7xl pb-4">
        <p className="mt-4">Блок в разработке 1</p>
      </div>
    </>
  )
}
