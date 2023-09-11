'use client'

import { Book, Chapter } from '@prisma/client'
import React, { useState, Suspense, memo, useContext, useMemo } from 'react'
import { LoadMore } from 'src/components/common/LoadMore'
import { AuthContext } from 'src/components/providers/AuthProvider'
import { Icon } from 'src/components/common/Icon'
import { fetcher } from 'src/libs/fetcher'
import { handleExceptionRequest } from 'src/helpers/exception.helper'
import { UpdateItem } from '../UpdateItem'

export const UpdateList = memo(function UpdateList(props: {
  orderBy: string
  limit: number
  queryFilterParams: string
}) {
  const { queryFilterParams } = props
  const { session } = useContext(AuthContext)

  const [page, setPage] = useState(1)
  const [isLastPage, setIsLastPage] = useState(false)
  const [books, setBooks] = useState<(Book & { lastChapter: Chapter })[]>([])

  const params = useMemo(() => {
    let params = `orderBy=${props.orderBy}&limit=${props.limit}&page=${page}`
    if (queryFilterParams.length) {
      params += `&${queryFilterParams}`
    }
    return params
  }, [props.orderBy, props.limit, page, queryFilterParams])

  const loadData = async () => {
    fetcher({
      url: `/books/?${params}`,
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
          {books.map((book) => (
            <UpdateItem key={book.id} book={JSON.stringify(book)} />
          ))}
        </Suspense>
      )}
      {!isLastPage && <LoadMore onClick={() => loadData()} />}
    </React.Fragment>
  )
})
