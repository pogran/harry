import { getChapterUrl } from 'src/helpers/chapter.helper'
import Link from 'next/link'
import { useTranslations } from 'next-intl'
import { Chapter, UserChapterLike } from '@prisma/client'
import { memo } from 'react'
import { Date } from 'src/components/common/Date'
import { Likes } from './Likes'
import cn from 'classnames'

export const ChapterItem = memo(function ChapterItem(props: {
  chapter: Chapter & { userChapterLike?: UserChapterLike }
  bookSlug: string
  isActive?: boolean
  isDisplayLikes?: boolean
}) {
  const { chapter, bookSlug, isDisplayLikes = true, isActive = false } = props
  const t = useTranslations()

  return (
    <div
      key={chapter.id}
      className={cn(
        'my-1 py-2 pl-3 pr-2 rounded  hover:bg-opacity-40 hover:dark:bg-opacity-20  flex justify-start items-center',
        {
          'bg-primary-main text-white dark:text-black-1000': isActive,
          'bg-gray-50 dark:bg-black-600': !isActive,
        },
      )}
    >
      <div className="font-semibold text-lg pr-4 pl-1">{chapter.tom}</div>

      <Link
        href={getChapterUrl(bookSlug, chapter.id)}
        className="w-full md:flex md:justify-between md:items-center md:mr-7"
      >
        <h6 className="whitespace-nowrap overflow-hidden text-ellipsis">
          {t('Chapter {number}', { number: chapter.number })}
        </h6>
        <Date
          wrapperClass={cn('mt-7 md:mt-0', {
            '!text-white dark:!text-black-1000': isActive,
          })}
          date={chapter.createdAt}
        />
      </Link>

      {isDisplayLikes && (
        <Likes
          className={isActive ? '' : undefined}
          userChapterLike={chapter.userChapterLike}
          chapterId={chapter.id}
          likes={chapter.likes}
        />
      )}
    </div>
  )
})
