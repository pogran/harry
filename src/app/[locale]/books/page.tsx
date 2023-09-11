import { prisma } from 'src/instances/prisma'
import {
  EnBookStatus,
  EnBookType,
  Book,
  Bookmark,
  EnTagType,
} from '@prisma/client'
import { headers } from 'next/headers'
import {
  CATALOG_BOOKS_COUNT_DESK,
  CATALOG_BOOKS_COUNT_MOBILE,
} from 'src/config'
import { EnSort } from 'src/enums'
import { DEFAULT_BOOKS_ORDER_BY, DEFAULT_BOOKS_SORT } from 'src/config/index'
import { objectToQueryString } from 'src/helpers/query.helper'
import { IntCatalogFilters, IntCatalogFormData } from 'types/form'
import { getSession } from 'src/app/layout'
import { isHentai, isMobile } from 'src/helpers/main.helper'
import { EnBookOrderBy } from 'src/enums'
import { getTags } from 'src/helpers/catalog.helper'
import { commonArrayElements } from 'src/helpers/common.helper'
import { getTranslations } from 'next-intl/server'
import { Metadata } from 'next'
import { getCatalogUrlMeta } from 'src/helpers/meta.helper'
import BookGrid from 'src/components/pages/catalog/BookGrid'
import { BookItem } from 'src/components/common/Item/BookItem'
import React from 'react'

export const revalidate = 300

const filterBookByTags = async (tagIds: number[]) => {
  const tagGroups = await prisma.bookTag.groupBy({
    by: ['bookId'],
    where: {
      tagId: {
        in: tagIds,
      },
    },
    orderBy: {
      bookId: 'desc',
    },
    having: {
      bookId: {
        _count: {
          equals: tagIds.length,
        },
      },
    },
  })
  return tagGroups.map((b) => b.bookId)
}

const filterBookByGenres = async (genres: number[]) => {
  const genreGroups = await prisma.bookGenre.groupBy({
    by: ['bookId'],
    where: {
      genreId: {
        in: genres,
      },
    },
    orderBy: {
      bookId: 'desc',
    },
    having: {
      bookId: {
        _count: {
          equals: genres.length,
        },
      },
    },
  })
  return genreGroups.map((b) => b.bookId)
}

async function getFilterEntities() {
  const [series, genres, tags] = await Promise.all([
    prisma.serie.findMany(),
    prisma.genre.findMany(),
    prisma.tag.findMany(),
  ])

  return {
    genres,
    series,
    tags: tags.filter((tag) => tag.type !== EnTagType.COLLECTION),
    persons: tags.filter((tag) => tag.type === EnTagType.COLLECTION),
  }
}

async function getBooks(params: {
  countPerPage: number
  filtersData: IntCatalogFormData
  orderBy: EnBookOrderBy
  sort: EnSort
  userId: number | null
}): Promise<(Book & { bookmark: Bookmark | null })[]> {
  const { filtersData, userId } = params
  const tags = getTags(filtersData)

  const bookIdGenres = filtersData.genres
    ? await filterBookByGenres(filtersData.genres)
    : []

  const bookIdTags = tags.length ? await filterBookByTags(tags) : []

  const bookIds =
    tags.length && filtersData.genres
      ? commonArrayElements<number>(bookIdGenres, bookIdTags)
      : !tags.length && !filtersData.genres
      ? undefined
      : [...bookIdGenres, ...bookIdTags]

  const books = await prisma.book.findMany({
    where: {
      id: bookIds
        ? {
            in: bookIds,
          }
        : undefined,
      status: {
        not: EnBookStatus.DRAFT,
      },
      bookSeries: filtersData.serie
        ? {
            some: {
              serieId: filtersData.serie,
            },
          }
        : undefined,
      isHentai: isHentai(),
      type: filtersData.types
        ? {
            in: filtersData.types.map((t) => t.toUpperCase() as EnBookType),
          }
        : undefined,
    },
    include: {
      bookmarks: userId
        ? {
            where: {
              userId,
            },
          }
        : false,
    },
    orderBy: {
      newUploadAt: 'asc',
    },
    take: 100,
  })

  return books.map((book) => {
    const { bookmarks = [], ...data } = book
    return { ...data, bookmark: bookmarks.length ? bookmarks[0] : null }
  })
}

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations()
  const title = t('Catalog title')
  const description = t('Catalog description')

  const url = getCatalogUrlMeta()

  return {
    title,
    description,
    alternates: {
      canonical: url,
    },
    openGraph: {
      description,
      title,
      url,
    },
  }
}

export default async function CatalogPage(props: {
  searchParams: {
    types?: string | string[]
    genres?: string | string[]
    tags?: string | string[]
    persons?: string | string[]
    serie?: string
    orderBy?: string
  }
}) {
  const headersList = headers()
  const mobile = isMobile(headersList.get('user-agent') || '')
  const session = await getSession(headers().get('cookie') ?? '')
  const { searchParams } = props
  const t = await getTranslations()

  const { orderBy, sort, ...searchFilterParams } =
    searchParams && searchParams.orderBy
      ? {
          ...searchParams,
          orderBy:
            (searchParams.orderBy?.replace('-', '') as EnBookOrderBy) ||
            DEFAULT_BOOKS_ORDER_BY,
          sort: searchParams.orderBy?.includes('-') ? EnSort.DESC : EnSort.ASC,
        }
      : {
          ...searchParams,
          orderBy: DEFAULT_BOOKS_ORDER_BY,
          sort: DEFAULT_BOOKS_SORT,
        }

  const getFiltersData = (params: IntCatalogFilters): IntCatalogFormData => {
    const data: IntCatalogFormData = {}

    Object.keys(params).map((key) => {
      switch (key) {
        case 'types': {
          data.types = Array.isArray(params[key])
            ? (params[key] as string[]).map((v) => v as EnBookType)
            : [params[key] as EnBookType]
          return key
        }

        case 'serie': {
          data.serie = Number(params[key])
          return key
        }
        case 'persons':
        case 'tags':
        case 'genres': {
          data[key] = Array.isArray(params[key])
            ? (params[key] as string[]).map((v) => Number(v))
            : [Number(params[key])]
          return key
        }
        default: {
          return key
        }
      }
    })

    return data
  }

  const filtersData = getFiltersData(searchFilterParams)
  const queryFilterParams = objectToQueryString(searchFilterParams)
  const { ...filterEntities } = await getFilterEntities()

  const countPerPage = mobile
    ? CATALOG_BOOKS_COUNT_MOBILE
    : CATALOG_BOOKS_COUNT_DESK

  const books = await getBooks({
    countPerPage,
    filtersData,
    orderBy,
    sort,
    userId: session?.user.id || null,
  })

  return (
    <React.Fragment>
      <div className="mx-auto sm:max-w-7xl pb-0 bg-white dark:bg-transparent">
        <>
          <div className="pb-4 flex">
            <div className="w-full pt-4">
              {!books.length && (
                <p className="mx-2 md:mx-4 mt-3 md:mt-5">
                  {t('For your request books not found 🤔')}
                </p>
              )}
              <div className="grid grid-cols-3 md:grid-cols-6 gap-y-2 md:gap-y-3 mt-1 mx-1">
                {books.map((book) => (
                  <BookItem
                    key={book.id}
                    book={book}
                    imageClassName="m-1 md:m-1.5"
                    titleClassName="text-tiny leading-4 md:leading-5 md:text-base"
                  />
                ))}
              </div>

              {books.length >= countPerPage && (
                <BookGrid
                  limit={countPerPage}
                  queryFilterParams={queryFilterParams}
                  orderBy={`${sort === EnSort.ASC ? '' : '-'}${orderBy}`}
                  gridClassName="grid-cols-3 md:grid-cols-5"
                />
              )}
            </div>
          </div>
        </>
      </div>
    </React.Fragment>
  )
}
