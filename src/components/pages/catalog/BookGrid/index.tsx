'use client'

import { Book, Bookmark } from '@prisma/client'
import React, { useState, Suspense, useContext, useMemo } from 'react'
import { LoadMore } from 'src/components/common/LoadMore'
import { AuthContext } from 'src/components/providers/AuthProvider'
import { Icon } from 'src/components/common/Icon'
import { fetcher } from 'src/libs/fetcher'
import { handleExceptionRequest } from 'src/helpers/exception.helper'
import { BookItem } from 'src/components/common/Item/BookItem'

export default function BookGrid(props: {
  gridClassName?: string
  orderBy: string
  limit: number
  queryFilterParams: string
}) {
  const { queryFilterParams, gridClassName = 'grid-cols-3 md:grid-cols-6' } =
    props
  const { session } = useContext(AuthContext)

  const [page, setPage] = useState(1)
  const [isLastPage, setIsLastPage] = useState(false)
  const [books, setBooks] = useState<(Book & { bookmark: Bookmark })[]>([])

  const params = useMemo(() => {
    let params = `orderBy=${props.orderBy}&limit=${props.limit}&page=${page}`
    if (queryFilterParams.length) {
      params += `&${queryFilterParams}`
    }
    return params
  }, [props.orderBy, props.limit, page, queryFilterParams])

  const loadData = async () => {
    fetcher({
      url: `/catalog/?${params}`,
      session,
    })
      .then((data) => {
        setPage((page) => page + 1)
        if (data.length < props.limit) {
          setIsLastPage(true)
        }
        setBooks((books) => [...books, ...data])
      })
      .catch((error) => {
        handleExceptionRequest(error)
        setIsLastPage(true)
      })
  }

  return (
    <React.Fragment>
      {!!books.length && (
        <Suspense
          fallback={
            <div className="flex justify-center w-full mt-2">
              <Icon name="spinner" />
            </div>
          }
        >
          <div
            className={`grid ${gridClassName} gap-y-2 md:gap-y-3 mx-1 mt-2 md:mt-3`}
          >
            {books.map((book) => (
              <BookItem
                key={book.id}
                book={book}
                imageClassName="m-1 md:m-1.5"
                titleClassName="text-tiny leading-4 md:leading-5 md:text-base"
              />
            ))}
          </div>
        </Suspense>
      )}
      {!isLastPage && <LoadMore onClick={() => loadData()} />}
    </React.Fragment>
  )
}
