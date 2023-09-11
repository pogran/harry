'use client'

import { lazy, memo } from 'react'
import { Chapter, UserChapterLike } from '@prisma/client'
import { ChapterItem } from 'src/components/common/Item/ChapterItem'
import { InfinityList } from './InfinityList'

const FullList = lazy(() => import('./FullList'))

export const ChapterList = memo(function ChapterList(props: {
  chapters: (Chapter & { userChapterLike?: UserChapterLike })[]
  bookSlug: string
  isInfinityLoadAvailable: boolean
  bookId: number
  activeChapterId?: number
  isFullList?: boolean
}) {
  const {
    chapters,
    bookSlug,
    bookId,
    isInfinityLoadAvailable,
    isFullList = false,
  } = props

  return (
    <div>
      {chapters.map((chapter) => (
        <ChapterItem key={chapter.id} chapter={chapter} bookSlug={bookSlug} />
      ))}

      {isInfinityLoadAvailable && (
        <InfinityList bookSlug={bookSlug} bookId={bookId} />
      )}

      {isFullList && (
        <FullList
          activeChapterId={props.activeChapterId}
          bookId={bookId}
          bookSlug={bookSlug}
        />
      )}
    </div>
  )
})

export default ChapterList
