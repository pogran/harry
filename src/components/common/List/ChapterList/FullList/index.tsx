import { Chapter, UserChapterLike } from '@prisma/client'
import React, { memo, useContext, useEffect, useRef, useState } from 'react'
import { Error } from 'src/components/common/Error'
import { Icon } from 'src/components/common/Icon'
import { ChapterItem } from 'src/components/common/Item/ChapterItem'
import { AuthContext } from 'src/components/providers/AuthProvider'
import { EnMethod } from 'src/enums'
import { handleExceptionRequest } from 'src/helpers/exception.helper'
import { fetcher } from 'src/libs/fetcher'

const FullList = memo(function FullList(props: {
  bookSlug: string
  bookId: number
  activeChapterId?: number
}) {
  const [chapters, setChapters] = useState<
    (Chapter & { userChapterLike?: UserChapterLike })[]
  >([])
  const [isLoading, setIsLoading] = useState(false)
  const [timerId, setTimerId] = useState<NodeJS.Timeout | null>(null)
  const [error, setError] = useState<null | string>(null)
  const { session } = useContext(AuthContext)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    setIsLoading(true)

    fetcher({
      url: `/chapters?where[bookId]=${props.bookId}${
        session ? '&userLike=true&include=userChapterLikes' : ''
      }&orderBy=-id`,
      session,
      params: {
        method: EnMethod.GET,
      },
    })
      .then((data: (Chapter & { userChapterLike?: UserChapterLike })[]) => {
        setChapters(data)

        const timerId = setTimeout(() => {
          ref.current?.scrollIntoView({ behavior: 'smooth', block: 'center' })
        }, 100)
        setTimerId(timerId)
      })
      .catch((error) => {
        setError(String(handleExceptionRequest(error, false)))
      })
      .finally(() => setIsLoading(false))
  }, [props.bookId, session])

  useEffect(() => {
    return () => {
      timerId && clearTimeout(timerId)
    }
  }, [timerId])

  const renderChapter = (
    chapter: Chapter & {
      userChapterLike?: UserChapterLike | undefined
    },
  ) => {
    return (
      <ChapterItem
        key={chapter.id}
        isActive={chapter.id === props.activeChapterId}
        chapter={chapter}
        bookSlug={props.bookSlug}
      />
    )
  }

  return (
    <React.Fragment>
      {chapters.map((chapter) =>
        props.activeChapterId === chapter.id ? (
          <div key={chapter.id} ref={ref}>
            {renderChapter(chapter)}
          </div>
        ) : (
          renderChapter(chapter)
        ),
      )}
      {isLoading && <Icon name="spinner" className="my-2" />}
      {!!error && <Error className="mt-2 text-center" message={error} />}
    </React.Fragment>
  )
})

export default FullList
