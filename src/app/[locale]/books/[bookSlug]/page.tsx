import { Chapter } from '@prisma/client'
import { prisma } from 'src/instances/prisma'
import Tabs from 'src/components/pages/book/Tabs'
import { CHAPTERS_COUNT } from 'src/config'
import { notFound } from 'next/navigation'
import { isHentai } from 'src/helpers/main.helper'
import ActionButtons from 'src/components/pages/book/ActionButtons'
import DescriptionTab from 'src/components/pages/book/Tabs/DescriptionTab'
import {
  getBookDescMeta,
  getBookTitleMeta,
  getBookUrlMeta,
} from 'src/helpers/meta.helper'
import { Metadata } from 'next'
import { ChapterList } from 'src/components/pages/book/ChapterList'
import { getImageSrc } from 'src/helpers/image.helper'
import { BlurImage } from 'src/components/common/BlurImage'
import { BlurOverImage } from 'src/components/common/BlurOverImage'
import { getTranslations } from 'next-intl/server'

export const revalidate = 300

async function getBook(slug: string) {
  const book = await prisma.book.findUnique({
    where: {
      slug,
    },
  })

  if (!book || book.isHentai !== isHentai()) {
    return notFound()
  }

  return book
}

async function getChapters(bookId: number): Promise<Chapter[]> {
  return await prisma.chapter.findMany({
    where: {
      bookId,
    },
    orderBy: {
      index: 'desc',
    },
    take: CHAPTERS_COUNT,
  })
}

export async function generateMetadata(props: {
  params: {
    bookSlug: string
  }
}): Promise<Metadata> {
  const t = await getTranslations()
  const book = await getBook(props.params.bookSlug)
  let title = await getBookTitleMeta(book.title, book.titleEn)
  if (book.id <= 14) {
    title = `${title} (${t(book.id <= 7 ? 'Rosman' : 'Mahaon')})`
  }

  const description = await getBookDescMeta({
    title,
    desc: book.desc,
    robotDesc: book.robotDesc,
  })
  const url = getBookUrlMeta(book.slug)

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

export default async function BookPage(props: {
  params: { bookSlug: string }
}) {
  const { params } = props
  const book = await getBook(params.bookSlug)

  const chapters = await getChapters(book.id)

  const bookImage = getImageSrc(
    book.imageHigh || book.imageMid || book.imageLow || '',
  )
  const lastChapterId = chapters.length ? chapters[0].id : 0

  return (
    <>
      <div className="mx-auto sm:max-w-7xl pb-0 md:pt-6">
        <div
          style={{
            backgroundImage: `url(${bookImage})`,
            paddingTop: '150%',
            backgroundPosition: '50%',
          }}
          className="md:hidden relative bg-white dark:bg-gray-900 w-full bg-cover h-auto
						before:top-0 before:content-[' '] before:bottom-0 before:left-0 before:w-full before:absolute before:bg-book-pattern
					"
        >
          <div
            className="text-white w-full h-auto absolute bottom-0 px-5 py-5 z-10"
            itemScope
            itemType="https://schema.org/Book"
          >
            <meta content={bookImage} itemProp="image" />

            {book.titleEn && (
              <h2 className="opacity-[.85] text-tiny italic font-normal">
                {book.titleEn}
              </h2>
            )}
            <h1 className="text-xl font-semibold leading-5">{book.title}</h1>

            <div className="flex justify-start items-stretch my-2">
              <ActionButtons
                bookSlug={book.slug}
                bookId={book.id}
                lastChapterId={lastChapterId}
              />
            </div>
          </div>

          <BlurOverImage withBorder={false} />
        </div>

        <div className="block md:flex md:flex-row md:mx-2 xl:mx-auto">
          <div className="hidden md:block mr-6 md:flex-shrink-0">
            <div className="relative">
              <BlurImage
                src={bookImage}
                width={300}
                height={437}
                className="rounded-md bg-cover"
                alt={book.title}
              />
            </div>

            <ActionButtons
              bookSlug={book.slug}
              bookId={book.id}
              lastChapterId={lastChapterId}
            />
          </div>
          <div className="md:flex md:flex-col grow">
            <div className="hidden md:block">
              <h1 className="font-semibold text-2xl">
                {book.title || book.titleEn}
              </h1>
              {book.titleEn && (
                <h4 className="dark:text-gray-250 text-tiny italic text-gray-500">
                  {book.titleEn}
                </h4>
              )}
            </div>
            <Tabs>
              <DescriptionTab
                additionInfo={book.additionInfo}
                desc={book.desc}
              />

              <ChapterList
                bookId={book.id}
                bookSlug={book.slug}
                chapters={chapters}
              />
            </Tabs>
          </div>
        </div>
      </div>
    </>
  )
}
