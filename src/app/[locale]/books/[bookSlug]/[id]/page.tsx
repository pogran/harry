import { prisma } from 'src/instances/prisma'
import Link from 'next/link'
import { headers } from 'next/headers'
import { notFound } from 'next/navigation'
import { EnSort } from 'src/enums'
import ChapterSettingsProvider from 'src/components/providers/ChapterSettingsProvider'
import { getChapterSettings } from 'src/components/providers/ChapterSettingsProvider/helpers'
import { Error } from 'src/components/common/Error'
import { getTranslations } from 'next-intl/server'
import React from 'react'
import { getChapterUrl } from 'src/helpers/chapter.helper'
import { Menu } from 'src/components/pages/chapter/Menu'
import ChapterProvider from 'src/components/providers/ChapterProvider'
import MenuContent from 'src/components/pages/chapter/MenuContent'
import Thanks from 'src/components/pages/chapter/Thanks'
import { Icon } from 'src/components/common/Icon'
import { Metadata } from 'next'
import { getChapterUrlMeta } from 'src/helpers/meta.helper'
import { ThemeButton } from 'src/components/layout/Header/ThemeButton'
import ContentWrapper from 'src/components/pages/chapter/ContentWrapper'
import ChapterWrapper from 'src/components/layout/Header/HeaderWrapper/ChapterWrapper'

async function getChapter(id: number, bookSlug: string) {
  const data = await prisma.chapter.findUnique({
    where: {
      id,
    },
    include: {
      book: true,
      chapterContent: true,
    },
  })

  if (!data || bookSlug !== data.book.slug) {
    return notFound()
  }

  return data
}

async function getNextChapter(bookId: number, index: number) {
  return await prisma.chapter.findFirst({
    where: {
      bookId,
      index: {
        gt: index,
      },
    },
    orderBy: {
      index: EnSort.ASC,
    },
  })
}

export async function generateMetadata(props: {
  params: {
    id: string
    bookSlug: string
  }
}): Promise<Metadata> {
  const t = await getTranslations()
  const chapterId = +props.params.id.replace('ch', '')
  const { book, ...chapter } = await getChapter(
    chapterId,
    props.params.bookSlug,
  )
  const bookTitle = book.title || book.titleEn || ''
  const description = t(
    'Read {tom} tom {chapter} chapter {book} on site {site}',
    {
      tom: chapter.tom,
      chapter: chapter.number,
      book: bookTitle,
      site: process.env.NEXT_PUBLIC_ENV_APP_NAME,
    },
  )
  const url = getChapterUrlMeta(book.slug, +props.params.id)

  const title =
    chapter.tom > 1
      ? t('{book} Tom {tom} Chapter {chapter}', {
          book: bookTitle,
          tom: chapter.tom,
          chapter: chapter.number,
        })
      : t('{book} Chapter {chapter}', {
          book: bookTitle,
          chapter: chapter.number,
        })

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

export default async function Page(props: {
  params: { id: string; bookSlug: string }
}) {
  const chapterId = +props.params.id.replace('ch', '')
  const t = await getTranslations()
  const chapterSettings = getChapterSettings(headers().get('chapterSettings'))

  const { book, chapterContent, ...chapter } = await getChapter(
    chapterId,
    props.params.bookSlug,
  )
  const nextChapter = await getNextChapter(book.id, chapter.index)

  return (
    <React.Fragment>
      <ChapterWrapper>
        <div className="max-w-7xl md:mx-2 xl:mx-auto">
          <div className="flex justify-between h-12 items-center">
            <div className="flex truncate items-center">
              <Link
                className="flex-col flex mr-2 pl-2 truncate"
                href={`books/${book.slug}`}
              >
                <h2 className="text-tiny font-medium leading-5 truncate">
                  {book.title || book.titleEn}
                </h2>
                <h1 className="text-xs font-normal truncate text-gray-400 leading-4">
                  {t('Tom {tom}, Chapter {chapter}', {
                    tom: chapter.tom,
                    chapter: chapter.number,
                  })}
                </h1>
              </Link>
            </div>
            <ThemeButton />
          </div>
        </div>
      </ChapterWrapper>
      <ChapterSettingsProvider settings={chapterSettings}>
        <div className="mx-auto md:mt-12 flex justify-center">
          <ChapterProvider>
            <ContentWrapper>
              <div className="px-2 sm:px-6 overflow-hidden">
                {!chapterContent ? (
                  <Error message={t('Content not found')} />
                ) : (
                  <React.Fragment>
                    <Menu chapterId={chapter.id} bookId={chapter.bookId} />
                    <div className="mt-3 text-lg font-medium lg:text-xl">
                      {t('Tom {tom}, Chapter {chapter}', {
                        tom: chapter.tom,
                        chapter: chapter.number,
                      })}
                      {!!chapter.title && (
                        <span>
                          {'. '}
                          {chapter.title[0].toUpperCase()}
                          {chapter.title.substring(1).toLocaleLowerCase()}
                        </span>
                      )}
                    </div>
                    <div
                      className="[&_>_p]:my-4 mt-4 text-base leading-5 sm:text-lg break-words content sm:leading-6 prose text-justify max-w-none text-black-0 dark:text-[#aaa]"
                      dangerouslySetInnerHTML={{ __html: chapterContent.text }}
                    />
                  </React.Fragment>
                )}
              </div>
              <Thanks likes={chapter.likes} chapterId={chapter.id} />
              {!!nextChapter && (
                <Link
                  className="text-center mt-6 flex flex-col justify-center text-primary-main hover:text-primary-hover items-center cursor-pointer link"
                  href={getChapterUrl(book.slug, nextChapter.id)}
                >
                  <Icon
                    name="chevronDown"
                    className="animate-bounce !w-8 !h-8"
                  />
                </Link>
              )}
            </ContentWrapper>
            <MenuContent
              activeChapterId={chapterId}
              bookId={book.id}
              bookSlug={book.slug}
            />
          </ChapterProvider>
        </div>
      </ChapterSettingsProvider>
    </React.Fragment>
  )
}
