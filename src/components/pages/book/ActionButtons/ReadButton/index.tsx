import { Bookmark, Chapter } from '@prisma/client'
import { useTranslations } from 'next-intl'
import Link from 'next/link'
import { memo, useMemo } from 'react'
import { getChapterUrl } from 'src/helpers/chapter.helper'

export const ReadButton = memo(function ReadButton(props: {
  bookmark: (Bookmark & { chapter: Chapter }) | null
  firstChapter: Chapter
  bookSlug: string
  lastChapterId: number
}) {
  const t = useTranslations()
  const { bookmark, firstChapter, bookSlug, lastChapterId } = props

  const buttonText = useMemo(() => {
    if (!bookmark || bookmark.chapterId === firstChapter.id) {
      return t('Read')
    }

    if (bookmark.chapterId === lastChapterId) {
      return t('Was read')
    }
    return t('Tom {tom} Chapter {chapter}', {
      tom: bookmark.chapter.tom,
      chapter: bookmark.chapter.number,
    })
  }, [bookmark, firstChapter.id, lastChapterId, t])

  return (
    <Link
      className="md:w-full hover:bg-primary-main hover:text-white hover:dark:text-black-1000 md:mt-4 mr-1 md:mr-0 line-flex text-primary-main border-2 border-primary-main font-medium rounded-md text-sm px-5 py-2 text-center"
      href={getChapterUrl(
        bookSlug,
        bookmark ? bookmark.chapterId : firstChapter.id,
      )}
    >
      {buttonText}
    </Link>
  )
})
