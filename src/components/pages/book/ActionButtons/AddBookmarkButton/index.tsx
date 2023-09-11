import { Menu, Transition } from '@headlessui/react'
import cn from 'classnames'
import {
  Fragment,
  useState,
  useEffect,
  useContext,
  memo,
  useMemo,
  useCallback,
} from 'react'
import { EnBookmarkType, Bookmark, Chapter } from '@prisma/client'
import { isHentai } from 'src/helpers/main.helper'
import { BookmarkIcon } from '@heroicons/react/24/outline'
import { AuthContext } from 'src/components/providers/AuthProvider'
import React from 'react'
import { useTranslations } from 'next-intl'
import { BookmarkTypeEnum, EnMethod } from 'src/enums'
import { fetcher } from 'src/libs/fetcher'
import { useLogin } from 'src/hooks'
import { handleExceptionRequest } from 'src/helpers/exception.helper'
import { Icon } from 'src/components/common/Icon'

export const AddBookmarkButton = memo(function AddBookmarkButton(props: {
  bookId: number
  bookmark: Bookmark | null
  firstChapter: Chapter
}) {
  const { bookId, bookmark, firstChapter } = props

  const [activeBookmark, setActiveBookmark] = useState(bookmark)
  const { session } = useContext(AuthContext)
  const t = useTranslations()
  const { displayLoginPopup } = useLogin()

  useEffect(() => {
    setActiveBookmark(bookmark)
  }, [bookmark])

  const createBookmark = useCallback(
    async (type: EnBookmarkType, userId: number) => {
      const body = {
        userId,
        bookId,
        type,
        chapterId: firstChapter.id,
        isHentai: isHentai(),
        customTypeId: null,
      }

      fetcher({
        session,
        url: '/bookmarks',
        params: {
          method: EnMethod.POST,
          body: JSON.stringify(body),
        },
      })
        .then((bookmark: Bookmark) => {
          setActiveBookmark(bookmark)
        })
        .catch(handleExceptionRequest)
    },
    [bookId, firstChapter.id, session],
  )

  const updateBookmark = useCallback(
    async (id: number, type: EnBookmarkType) => {
      fetcher({
        session,
        url: `/bookmarks/${id}`,
        params: {
          method: EnMethod.PATCH,
          body: JSON.stringify({ type }),
        },
      })
        .then((bookmark: Bookmark) => {
          setActiveBookmark(bookmark)
        })
        .catch(handleExceptionRequest)
    },
    [session],
  )

  const setBookmark = useCallback(
    async (type: EnBookmarkType) => {
      if (!session) {
        return displayLoginPopup()
      }
      activeBookmark
        ? await updateBookmark(activeBookmark.id, type)
        : await createBookmark(type, session.user.id)
    },
    [
      activeBookmark,
      createBookmark,
      displayLoginPopup,
      session,
      updateBookmark,
    ],
  )

  const color = useMemo(() => {
    switch (activeBookmark?.type) {
      case EnBookmarkType.ABANDONED:
        return 'text-white bg-red-600 dark:bg-red-700'

      case EnBookmarkType.COMPLETED:
        return 'text-white bg-blue-600 dark:bg-blue-700'

      case EnBookmarkType.FAVORITE:
        return 'text-white bg-fuchsia-600 dark:bg-fuchsia-700'

      case EnBookmarkType.PLAN:
        return 'text-white bg-violet-600 dark:bg-violet-700'

      case EnBookmarkType.READ:
        return 'text-white bg-emerald-600 dark:bg-emerald-700'

      default:
        return 'md:bg-gray-200 md:dark:bg-black-600'
    }
  }, [activeBookmark?.type])

  return (
    <Menu
      as="div"
      className={cn(
        'relative inline-block text-left rounded-md md:mt-2',
        color,
      )}
    >
      {({ open }) => (
        <>
          <Menu.Button className="w-full flex items-center rounded-md font-medium justify-center text-sm px-5 py-2.5 text-center">
            <React.Fragment>
              <span className="md:hidden">
                <BookmarkIcon className="h-5 w-5" />
              </span>
              <span className="hidden md:inline-block font-medium">
                {t(
                  activeBookmark
                    ? BookmarkTypeEnum.getLabels()[activeBookmark.type]
                    : 'Add bookmark',
                )}
              </span>
            </React.Fragment>

            <Icon
              name="chevronDown"
              className={cn('ml-3', {
                'rotate-180': open,
              })}
            />
          </Menu.Button>
          <Transition
            as={Fragment}
            enter="transition ease-out duration-100"
            enterFrom="transform opacity-0 scale-95"
            enterTo="transform opacity-100 scale-100"
            leave="transition ease-in duration-75"
            leaveFrom="transform opacity-100 scale-100"
            leaveTo="transform opacity-0 scale-95"
          >
            <Menu.Items className="absolute text-black-1000 dark:text-gray-75 border border-gray-100 dark:border-black-700 md:w-full mt-2 md:mt-1 right-0 origin-top-right rounded-sm bg-white dark:bg-black-600 shadow-lg focus:outline-none">
              {(Object.keys(BookmarkTypeEnum.getLabels()) as EnBookmarkType[])
                .filter((key) => key !== EnBookmarkType.CUSTOM)
                .map((key) => (
                  <Menu.Item key={key}>
                    {({ active }) => (
                      <button
                        onClick={() => setBookmark(key)}
                        className={cn(
                          'flex w-full items-center pl-10 pr-4 md:pr-2 py-2 relative',
                          {
                            'bg-gray-100 font-medium dark:bg-black-700 text-primary-main':
                              key === activeBookmark?.type,
                            'hover:bg-gray-100 dark:hover:bg-black-700 text-primary-main':
                              active,
                          },
                        )}
                      >
                        {t(BookmarkTypeEnum.getLabels()[key])}
                        {key === activeBookmark?.type && (
                          <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-primary-main">
                            <Icon name="check" />
                          </span>
                        )}
                      </button>
                    )}
                  </Menu.Item>
                ))}
            </Menu.Items>
          </Transition>
        </>
      )}
    </Menu>
  )
})
