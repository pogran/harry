'use client'

import { Bookmark, Chapter, Book, EnBookmarkType } from '@prisma/client'
import Link from 'next/link'
import cn from 'classnames'
import Image from 'next/image'
import { getChapterUrl } from 'src/helpers/chapter.helper'
import React, { useCallback, useContext, useMemo, useState } from 'react'
import { Session } from 'next-auth'
import { BookmarkTypeEnum, EnMethod } from 'src/enums'
import { Icon } from 'src/components/common/Icon'
import { useTranslations } from 'next-intl'
import { fetcher } from 'src/libs/fetcher'
import { AuthContext } from 'src/components/providers/AuthProvider'
import { handleExceptionRequest } from 'src/helpers/exception.helper'
import { Dropdown } from 'src/components/common/Dropdown'
import { IntDropdownItem } from 'src/components/common/Dropdown/types'
import ScrollWrapper from 'src/components/common/ScrollWrapper'
import { getImageSrc } from 'src/helpers/image.helper'

export default function Bookmarks(props: {
  bookmarksJson: string
  session: Session
}) {
  const t = useTranslations()
  const [activeType, setActiveType] = useState<EnBookmarkType>(
    EnBookmarkType.READ,
  )
  const [bookmarks, setBookmarks] = useState<
    (Bookmark & { chapter: Chapter; book: Book })[]
  >(JSON.parse(props.bookmarksJson))
  const { session } = useContext(AuthContext)

  const [selected, setSelected] = useState<number[]>([])

  const onMove = useCallback(
    async (type: EnBookmarkType) => {
      fetcher({
        url: '/bookmarks/update-all',
        session,
        params: {
          method: EnMethod.POST,
          body: JSON.stringify({
            ids: selected,
            type,
          }),
        },
      })
        .then(() => {
          setBookmarks((bookmarks) =>
            bookmarks.map((bookmark) =>
              selected.includes(bookmark.id) ? { ...bookmark, type } : bookmark,
            ),
          )
          setSelected([])
        })
        .catch(handleExceptionRequest)
    },
    [selected, session],
  )

  const onDelete = useCallback(async () => {
    fetcher({
      url: '/bookmarks/delete-all',
      session,
      params: {
        method: EnMethod.POST,
        body: JSON.stringify({
          ids: selected,
        }),
      },
    })
      .then(() => {
        setBookmarks((bookmarks) =>
          bookmarks.filter((bookmark) => !selected.includes(bookmark.id)),
        )
        setSelected([])
      })
      .catch(handleExceptionRequest)
  }, [selected, session])

  const typeList = useMemo(() => {
    return (Object.keys(EnBookmarkType) as EnBookmarkType[]).filter(
      (type) => type !== EnBookmarkType.CUSTOM,
    )
  }, [])

  const typeTabs = useMemo(() => {
    return typeList.map((type) => ({
      id: type,
      label: t(BookmarkTypeEnum.getLabels()[type]),
      count: bookmarks.filter((bookmark) => bookmark.type === type).length,
    }))
  }, [bookmarks, t, typeList])

  const actions = useMemo(() => {
    const items: IntDropdownItem[] = typeList
      .filter((type) => activeType !== type)
      .map((type) => ({
        id: type,
        label: t(BookmarkTypeEnum.getLabels()[type]),
        icon: <Icon name="arrowLongDown" className="-rotate-90 !w-4 !h-4" />,
        className: '',
        onClick: () => onMove(type),
      }))

    items.push({
      id: 'delete',
      label: t('Delete'),
      icon: <Icon name="trash" className="!w-3 !h-3 text-primary-main" />,
      className:
        'border-t dark:border-black-800 border-gray-200 text-primary-main',
      onClick: () => onDelete(),
    })

    return items
  }, [activeType, onDelete, onMove, t, typeList])

  if (!bookmarks.length) {
    return <p>{t("You don't have bookmarks")}</p>
  }

  const activeBookmarks = bookmarks.filter(
    (bookmark) => bookmark.type === activeType,
  )

  return (
    <React.Fragment>
      <div className="flex items-center py-2 pb-4">
        {!!selected.length && (
          <Dropdown
            className="mr-2"
            menuClassName="min-w-[180px]"
            items={actions}
          />
        )}
        <ScrollWrapper className="scroll-container flex ">
          {typeTabs.map((type) => (
            <button
              key={type.id}
              onClick={() => setActiveType(type.id)}
              className={cn(
                'm-0.5 first:ml-0 last:mr-0 px-3 whitespace-nowrap rounded-sm py-[2px] md:px-5 border text-tiny',
                {
                  'bg-primary-main text-white dark:text-black-1000 border-primary-main':
                    type.id === activeType,
                  'hover:border-primary-main dark:hover:border-primary-main hover:text-primary-main dark:hover:text-primary-main dark:text-gray-300 text-gray-700 bg-gray-200 border-transparent dark:bg-black-600':
                    type.id !== activeType,
                },
              )}
            >
              {type.label} <span className="ml-1 text-xs">{type.count}</span>
            </button>
          ))}
        </ScrollWrapper>
      </div>

      {activeBookmarks.length
        ? activeBookmarks.map((bookmark) => {
            const { chapter, book } = bookmark
            const bookImage = getImageSrc(
              book.imageLow || book.imageMid || book.imageHigh || '',
            )
            return (
              <div className="px-2 py-2" key={bookmark.id}>
                <div className="flex items-center relative">
                  <div className="form-check">
                    <input
                      className="form-check-input appearance-none h-6 w-6 border dark:border-black-500 border-gray-300 rounded-sm dark:bg-black-600 text-primary-main checked:bg-primary-main dark:checked:bg-primary-main dark:checked:border-primary-main checked:border-primary-main focus:outline-none transition duration-200 align-top bg-no-repeat bg-center bg-contain float-left mr-2 cursor-pointer"
                      type="checkbox"
                      onChange={() => {
                        selected.includes(bookmark.id)
                          ? setSelected(
                              selected.filter((el) => el !== bookmark.id),
                            )
                          : setSelected([...selected, bookmark.id])
                      }}
                      checked={selected.includes(bookmark.id)}
                    />
                  </div>
                  <Link href={`/books/${book.slug}`}>
                    <Image
                      alt={book.title}
                      className="flex-shrink-0 max-h-[100px] min-h-[100px] rounded object-cover overflow-hidden"
                      width={67}
                      height={100}
                      src={bookImage}
                    />
                  </Link>
                  <div className="px-2 truncate flex-col pl-5 flex-1 h-full">
                    <Link
                      className="dark:hover:text-primary-main hover:text-primary-main text-black-1000 dark:text-white"
                      href={`/books/${book.slug}`}
                    >
                      <h4 className="font-medium mb-2 text-base lg:text-lg truncate">
                        {book.title || book.titleEn}
                      </h4>
                    </Link>
                    <div className="flex flex-col">
                      <Link
                        className="text-sm dark:text-gray-300 text-gray-700 lg:text-base truncate dark:hover:text-primary-main hover:text-primary-main"
                        href={getChapterUrl(book.slug, chapter.id)}
                      >
                        {t('Tom {tom}, Chapter {chapter}', {
                          tom: chapter.tom,
                          chapter: chapter.number,
                        })}
                      </Link>
                    </div>

                    {/* <p title={__('x')} className="text-xs mt-4">0 / 0</p> */}
                  </div>
                </div>
              </div>
            )
          })
        : t('Bookmarks that type not found 🤔')}
    </React.Fragment>
  )
}
