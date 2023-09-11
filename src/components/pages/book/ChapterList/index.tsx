'use client'

import { Chapter, UserChapterLike } from '@prisma/client'
import { useTranslations } from 'next-intl'
import { memo, useContext, useMemo } from 'react'
import { AuthContext } from 'src/components/providers/AuthProvider'
import { ChapterList as CommonChapterList } from 'src/components/common/List/ChapterList'
import { fetcher } from 'src/libs/fetcher'
import useSWR from 'swr'
import { CHAPTERS_COUNT } from 'src/config'

export const ChapterList = memo(function ChapterList(props: {
  chapters: (Chapter & { userChapterLike?: UserChapterLike })[]
  bookSlug: string
  bookId: number
}) {
  const { bookSlug, bookId } = props
  const t = useTranslations()
  const { session } = useContext(AuthContext)

  const { data: userChapterLikes } = useSWR<UserChapterLike[]>(
    session
      ? {
          url: `/users-chapter-likes/?where[chapterId][in]=[${props.chapters
            .map((chapter) => `${chapter.id}`)
            .join(',')}]`,
          session,
        }
      : null,
    fetcher,
    { shouldRetryOnError: false },
  )

  const chapters = useMemo(() => {
    if (!userChapterLikes) {
      return props.chapters
    }

    const userLikes: Record<number, UserChapterLike> = userChapterLikes.reduce(
      (result, userChaperLike) =>
        Object.assign(result, { [userChaperLike.chapterId]: userChaperLike }),
      {},
    )

    return props.chapters.map((chapter) => {
      if (chapter.id in userLikes) {
        return { ...chapter, userChapterLike: userLikes[chapter.id] }
      }
      return chapter
    })
  }, [userChapterLikes, props.chapters])

  return (
    <div className="mx-2 md:mx-0 mb-5">
      <h3 className="font-semibold text-xl mt-6 mb-3">
        {t('List of chapters')}
      </h3>
      <CommonChapterList
        isInfinityLoadAvailable={chapters.length >= CHAPTERS_COUNT}
        bookId={bookId}
        bookSlug={bookSlug}
        chapters={chapters}
      />
    </div>
  )
})
