'use client'
import React, {
  useState,
  useEffect,
  memo,
  useRef,
  useCallback,
  useContext,
} from 'react'
import { Chapter, UserChapterLike } from '@prisma/client'
import { Error } from 'src/components/common/Error'
import { AuthContext } from 'src/components/providers/AuthProvider'
import { fetcher } from 'src/libs/fetcher'
import { EnMethod } from 'src/enums'
import { handleExceptionRequest } from 'src/helpers/exception.helper'
import { CHAPTERS_COUNT } from 'src/config'
import { ChapterItem } from 'src/components/common/Item/ChapterItem'
import { Icon } from 'src/components/common/Icon'

export const InfinityList = memo(function InfinityList(props: {
  bookId: number
  bookSlug: string
}) {
  const { bookSlug, bookId } = props

  const [chapters, setChapters] = useState<
    (Chapter & { userChapterLike?: UserChapterLike })[]
  >([])
  const { session } = useContext(AuthContext)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<null | string>(null)
  const [isInfinityDisable, setIsInfinityDisable] = useState(false)

  const observerTarget = useRef(null)

  const fetchData = useCallback(
    async (page: number) => {
      setIsLoading(true)

      fetcher({
        url: `/chapters?skip=${
          CHAPTERS_COUNT * page
        }&take=${CHAPTERS_COUNT}&where[bookId]=${bookId}${
          session ? '&userLike=true&include=userChapterLikes' : ''
        }&orderBy=-id`,
        session,
        params: {
          method: EnMethod.GET,
        },
      })
        .then((data: (Chapter & { userChapterLike?: UserChapterLike })[]) => {
          if (data.length < CHAPTERS_COUNT) {
            setIsInfinityDisable(true)
          }
          setChapters((chapters) => [...chapters, ...data])
        })
        .catch((error) => {
          setError(String(handleExceptionRequest(error, false)))
        })
        .finally(() => setIsLoading(false))
    },
    [bookId, session],
  )

  useEffect(() => {
    let page = 0
    const target = observerTarget.current
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          page++
          fetchData(page)
        }
      },
      { threshold: 1, rootMargin: '0px 0px 400px 0px' },
    )

    if (target) {
      observer.observe(target)
    }

    return () => {
      if (target) {
        observer.unobserve(target)
      }
    }
  }, [fetchData, observerTarget])

  return (
    <React.Fragment>
      {(chapters.length &&
        chapters.map((chapter) => (
          <ChapterItem key={chapter.id} chapter={chapter} bookSlug={bookSlug} />
        ))) ||
        ''}
      {isLoading && <Icon name="spinner" className="my-2" />}
      {!!error && <Error className="mt-2 text-center" message={error} />}
      {!isInfinityDisable && !error && <div ref={observerTarget} />}
    </React.Fragment>
  )
})
