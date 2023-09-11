'use client'

import { useDebounce } from 'src/hooks'
import React, { useCallback, useEffect, useState } from 'react'
import { Book } from '@prisma/client'
import { BookItem } from 'src/components/common/Item/BookItem'
import { fetcher } from 'src/libs/fetcher'
import { EnMethod } from 'src/enums'
import { handleExceptionRequest } from 'src/helpers/exception.helper'
import { SEARCH_MIN_LENGTH } from 'src/config'
import { LoadMore } from 'src/components/common/LoadMore'
import { useTranslations } from 'next-intl'
import { Icon } from 'src/components/common/Icon'

export default function Search(props: { limit: number }) {
  const [value, setValue] = useState('')
  const [isLastPage, setIsLastPage] = useState(true)
  const [page, setPage] = useState(0)
  const [loading, setLoading] = useState(false)
  const t = useTranslations()

  const [books, setBooks] = useState<Book[]>([])
  const debouncedValue = useDebounce<string>(value, 500)

  useEffect(() => {
    if (!debouncedValue || debouncedValue.length < SEARCH_MIN_LENGTH) {
      setIsLastPage(false)
      setPage(0)
      setBooks([])

      return
    }

    fetcher({
      url: `/books/search?query=${debouncedValue}&limit=${props.limit}`,
      params: {
        method: EnMethod.GET,
      },
    })
      .then((data: Book[]) => {
        setBooks(data)

        if (data.length >= props.limit) {
          setIsLastPage(false)
        } else {
          setIsLastPage(true)
        }
      })
      .catch(handleExceptionRequest)
      .finally(() => {
        setLoading(false)
      })
  }, [debouncedValue, props.limit])

  const handleChange = useCallback(
    (event: React.FormEvent<HTMLInputElement>) => {
      const value = event.currentTarget.value
      setLoading(value.length >= SEARCH_MIN_LENGTH)
      setValue(event.currentTarget.value)
    },
    [],
  )

  const loadData = useCallback(() => {
    fetcher({
      url: `/books/search?query=${debouncedValue}&limit=${props.limit}&page=${
        page + 1
      }`,
      params: {
        method: EnMethod.GET,
      },
    })
      .then((data: Book[]) => {
        setBooks([...books, ...data])
        setPage((page) => page + 1)

        if (data.length >= props.limit) {
          setIsLastPage(false)
        } else {
          setIsLastPage(true)
        }
      })
      .catch(handleExceptionRequest)
  }, [books, debouncedValue, page, props.limit])

  const renderData = () => {
    if (books.length) {
      return (
        <div className="grid grid-cols-3 md:grid-cols-6 pb-4 gap-y-2 md:gap-y-3 mx-1 mt-2 md:mt-3">
          {books.map((b) => (
            <BookItem
              key={b.id}
              book={b}
              imageClassName="m-1 md:m-1.5"
              titleClassName="text-tiny leading-4 md:leading-5 md:text-base"
            />
          ))}
        </div>
      )
    }

    if (
      !books.length &&
      value &&
      value.length >= SEARCH_MIN_LENGTH &&
      !loading
    ) {
      return <p>{t('Books not found 🙄')}</p>
    }

    return <React.Fragment />
  }

  return (
    <>
      <div className="mt-1 flex rounded-md shadow-sm mb-4 mx-2 md:mx-0">
        <span className="inline-flex items-center rounded-l-md border border-r-0 border-gray-300  dark:bg-black-700 dark:border-black-600 text-gray-500 dark:text-gray-200 pl-4 pr-2 text-sm">
          <Icon name="search" className="!w-4 !h-4" />
        </span>
        <input
          type="text"
          name="title"
          id="title"
          autoFocus
          onChange={handleChange}
          value={value}
          className="block border dark:border-black-600  w-full py-2 px-3 flex-1 focus:border-primary-main border-l-white dark:border-l-black-700 focus:ring-primary-main rounded-none rounded-r-md dark:bg-black-700 border-gray-300 dark:text-gray-200 sm:text-sm"
          placeholder={t('What are you search?')}
        />
      </div>

      {renderData()}

      {!isLastPage && !!books.length && <LoadMore onClick={() => loadData()} />}
    </>
  )
}
