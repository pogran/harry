'use client'

import { Bookmark, Chapter, EnChapterStatus } from '@prisma/client'
import { AuthContext } from 'src/components/providers/AuthProvider'
import React, { useContext } from 'react'
import useSWR from 'swr'
import { fetcher } from 'src/libs/fetcher'
import { ReadButton } from './ReadButton'
import { AddBookmarkButton } from './AddBookmarkButton'
import { Error } from 'src/components/common/Error'

export default function ActionButtons(props: {
  lastChapterId: number
  bookId: number
  bookSlug: string
}) {
  const { lastChapterId, bookId, bookSlug } = props
  const { session } = useContext(AuthContext)

  const { data: bookmark, error: errorBookmark } = useSWR<
    (Bookmark & { chapter: Chapter }) | null,
    Error
  >(
    session
      ? {
          url: `/bookmarks/find-first?where[bookId]=${bookId}&include=chapter`,
          session,
        }
      : null,
    fetcher,
    { shouldRetryOnError: false },
  )

  const { data: firstChapter, error: errorChapter } = useSWR<
    Chapter | null,
    Error
  >(
    {
      url: `/chapters/find-first?where[bookId]=${bookId}&where[status]=${EnChapterStatus.ACTIVE}`,
    },
    fetcher,
    { shouldRetryOnError: false },
  )

  if (errorBookmark || errorChapter) {
    return (
      <Error
        className="md:mt-2"
        message={errorBookmark?.message || errorChapter?.message}
      />
    )
  }

  if (!firstChapter) {
    return <React.Fragment />
  }

  return (
    <div className="flex flex-row md:flex-col md:mb-4">
      <ReadButton
        firstChapter={firstChapter}
        lastChapterId={lastChapterId}
        bookSlug={bookSlug}
        bookmark={bookmark ?? null}
      />

      <AddBookmarkButton
        firstChapter={firstChapter}
        bookId={bookId}
        bookmark={bookmark ?? null}
      />
    </div>
  )
}
