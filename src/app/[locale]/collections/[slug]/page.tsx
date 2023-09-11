import { Collection, Book } from '@prisma/client'
import { isMobile } from 'src/helpers/main.helper'
import { headers } from 'next/headers'
import { notFound } from 'next/navigation'
import { baseApi, BOOKS_COUNT_DESK, BOOKS_COUNT_MOBILE } from 'src/config'
import { isHentai } from 'src/helpers/main.helper'
import { BookItem } from 'src/components/common/Item/BookItem'
import { getTranslations } from 'next-intl/server'

interface IntProps {
  params: {
    slug: string
  }
}

async function getCollection(slug: string): Promise<{
  collection: Collection | null
  books: Book[]
  relatives: Collection[]
}> {
  const res = await fetch(`${baseApi}/collections/${slug}`)
  return { collection: null, books: [], relatives: [] }
}

export default async function PageCollection({ params }: IntProps) {
  const headersList = headers()
  const mobile = isMobile(headersList.get('user-agent') || '')
  const count = mobile ? BOOKS_COUNT_MOBILE : BOOKS_COUNT_DESK
  const { collection, books, relatives } = await getCollection(params.slug)
  const t = await getTranslations()

  if (!collection || collection.isHentai !== isHentai()) {
    return notFound()
  }

  return (
    <>
      <div className="mx-auto sm:max-w-7xl pb-0">
        <h1 className="font-semibold text-2xl md:text-3xl my-4 md:my-4 text-center line-clamp-2 truncate">
          {collection.title}
        </h1>
        {/* {(collection.alternativeNames && (
          <h2 className="dark:text-gray-250 text-tiny italic mb-2 text-gray-500 text-center px-4 md:px-32">
            {collection.alternativeNames}
          </h2>
        )) ||
          ''}
        <p className="text-secondary font-normal leading-6 dark:text-gray-250 text-center px-4 md:px-32">
          {collection.desc}
        </p> */}

        {!relatives.length && (
          <div className="justify-center mt-7 md:mt-10 px-4 md:px-32 flex flex-wrap">
            {/* {relatives.map((relative) => (
              <Tag
                key={relative.id}
                isActive={params.slug === relative.slug}
                link={`/collections/${relative.slug}`}
                title={relative.shortName}
              />
            ))} */}
          </div>
        )}

        {(!books.length && (
          <p className="mx-2 mt-7 text-center">
            {t('In this collection books not found 😨')}
          </p>
        )) ||
          ''}

        <div className="mb-4">
          <div className="grid grid-cols-3 md:grid-cols-6 gap-y-2 md:gap-y-3 mt-5 mx-1">
            {books.map((book) => (
              <BookItem
                key={book.id}
                book={book}
                imageClassName="m-1 md:m-1.5"
                titleClassName="text-tiny leading-4 md:leading-5 md:text-base"
              />
            ))}
          </div>

          {/* {(books.length >= count && (
            <BookGrid
              link={`${baseApi}/collections/${collection.id}/books`}
              count={count}
            />
          )) ||
            ''} */}
        </div>
      </div>
    </>
  )
}
