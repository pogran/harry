'use client'

import { Book, Bookmark, EnBookmarkType } from '@prisma/client'
import Link from 'next/link'
import cn from 'classnames'
import { Icon } from '../../Icon'
import { memo, useCallback } from 'react'
import { useTranslations } from 'next-intl'
import { BookTypeEnum } from 'src/enums'
import { getImageSrc } from 'src/helpers/image.helper'
import { BlurOverImage } from '../../BlurOverImage'

export const BookItem = memo(function BookItem(props: {
  book: Book & { bookmark?: Bookmark | null }
  imageClassName?: string
  titleClassName?: string
}) {
  const {
    book,
    titleClassName = 'text-base',
    imageClassName = 'm-1.5 md:m-2 first:ml-2 md:first:ml-4 last:mr-2 md:last:mr-4 min-w-[144px] md:min-w-[160px]',
  } = props

  const t = useTranslations()
  const bookImage = getImageSrc(
    book.imageHigh || book.imageMid || book.imageLow || '',
  )

  const getBookmarkClass = useCallback((type: EnBookmarkType | null) => {
    switch (type) {
      case EnBookmarkType.ABANDONED:
        return 'text-red-600 dark:text-red-700'

      case EnBookmarkType.COMPLETED:
        return 'text-blue-600 dark:text-blue-700'

      case EnBookmarkType.FAVORITE:
        return 'text-fuchsia-600 dark:text-fuchsia-700'

      case EnBookmarkType.PLAN:
        return 'text-violet-600 dark:text-violet-700'

      case EnBookmarkType.READ:
        return 'text-emerald-600 dark:text-emerald-700'

      default:
        return 'text-gray-200 dark:text-black-600'
    }
  }, [])

  return (
    <div key={book.id} className={imageClassName}>
      <Link
        className="flex flex-col relative group"
        href={`/books/${book.slug}`}
      >
        {book?.bookmark && (
          <div
            className={cn(
              'absolute -top-1 left-3',
              getBookmarkClass(book.bookmark.type),
            )}
          >
            <Icon name="bookmarkFull" className="!w-5 !h-5 md:w-6 md:h-6" />
          </div>
        )}
        <div
          className="rounded-md bg-cover relative"
          style={{
            backgroundColor: 'hsla(0,0%,47%,.1)',
            backgroundImage: 'url(/icons/manga.svg)',
            backgroundPosition: '50%',
          }}
        >
          <div
            className="bg-cover rounded-md"
            style={{
              backgroundImage: `url(${bookImage})`,
              paddingTop: '150%',
              backgroundPosition: '50%',
            }}
          />

          <BlurOverImage />
        </div>
        <h4
          className={cn(
            'mt-2 font-medium group-hover:text-primary-main line-clamp-2 leading-5 ',
            titleClassName,
          )}
        >
          {book.title || book.titleEn || ''}
        </h4>
        {!!book.additionInfo && (
          <p className="pt-1.5 md:pt-2 text-tiny leading-3 font-light dark:text-gray-250 text-gray-500">
            {book.additionInfo}
          </p>
        )}
      </Link>
    </div>
  )
})
