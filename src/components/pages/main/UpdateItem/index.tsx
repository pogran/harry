'use client'

import { Book, Chapter } from '@prisma/client'
import { useTranslations } from 'next-intl'
import Link from 'next/link'
import { memo } from 'react'
import { Date } from 'src/components/common/Date'
import { getChapterUrl } from 'src/helpers/chapter.helper'
import { getImageSrc } from 'src/helpers/image.helper'
import { BlurImage } from 'src/components/common/BlurImage'

export const UpdateItem = memo(function UpdateItem(props: { book: string }) {
  const book = JSON.parse(props.book) as Book & {
    lastChapter: Chapter | null
  }
  const t = useTranslations()
  const bookImage = getImageSrc(
    book.imageLow || book.imageMid || book.imageHigh || '',
  )

  const renderLastChapter = (
    book: Book & {
      lastChapter: Chapter | null
    },
  ) => {
    const chapter = book.lastChapter
    if (!chapter) {
      return <>...</>
    }

    return (
      <div className="flex flex-col mt-2">
        <Link
          href={getChapterUrl(book.slug, chapter.id)}
          className="text-sm lg:text-base truncate hover:text-primary-main"
        >
          {t('Tom {tom}, Chapter {chapter}', {
            tom: chapter.tom,
            chapter: chapter.number,
          })}
        </Link>
        <Date wrapperClass="mt-6" date={chapter.createdAt} />
      </div>
    )
  }

  return (
    <div className="px-2 py-2 pb-0" key={book.id}>
      <div className="flex relative">
        <Link className="h-full relative" href={`/manga/${book.slug}`}>
          <BlurImage
            src={bookImage}
            alt={book.title || book.titleEn || ''}
            className="flex-shrink-0 rounded object-cover overflow-hidden"
            width={80}
            style={{
              minHeight: '120px',
              objectFit: 'cover',
              maxHeight: '120px',
            }}
            height={120}
          />
        </Link>
        <div className="px-2 truncate flex-col pl-5 flex-1 pt-2 h-full">
          <Link
            className="lg:hover:text-primary-main"
            href={`/books/${book.slug}`}
          >
            <h4 className="font-medium text-base lg:text-lg truncate">
              {book.title || book.titleEn}
            </h4>
          </Link>
          {renderLastChapter(book)}
          <p
            style={{ marginTop: 'revert' }}
            className="mt-auto pt-2 md:pt-0 border-b border-gray-200 dark:border-black-500"
          />
        </div>
      </div>
    </div>
  )
})
