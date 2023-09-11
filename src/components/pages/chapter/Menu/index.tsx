'use client'

import {
  memo,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react'
import cn from 'classnames'
import { EnMenuItem, EnMethod } from 'src/enums'
import { Icon } from 'src/components/common/Icon'
import { IntMenuItem } from './types'
import { Bookmark } from '@prisma/client'
import useSWR from 'swr'
import { fetcher } from 'src/libs/fetcher'
import { EnBookmarkType } from '@prisma/client'
import { AuthContext } from 'src/components/providers/AuthProvider'
import { useLogin } from 'src/hooks'
import { handleExceptionRequest } from 'src/helpers/exception.helper'
import { ChapterContext } from 'src/components/providers/ChapterProvider'

export const Menu = memo(function Menu(props: {
  chapterId: number
  bookId: number
}) {
  const [isMenuDisplay, setIsMenuDisplay] = useState<boolean>(false)
  const [activeBookmark, setActiveBookmark] = useState<Bookmark | null>(null)
  const { session } = useContext(AuthContext)
  const { displayLoginPopup } = useLogin()
  const { setActiveMenuItem, activeMenuItem } = useContext(ChapterContext)

  const { data: bookmark } = useSWR<Bookmark>(
    session
      ? {
          url: `/bookmarks/find-first?where[bookId]=${props.bookId}`,
          session,
        }
      : null,
    fetcher,
    { shouldRetryOnError: false },
  )

  useEffect(() => {
    bookmark && setActiveBookmark(bookmark)
  }, [bookmark])

  useEffect(() => {
    // FIXME: check if user use mobile phone
    const isDesctop = document.body.clientWidth > 768

    if (isDesctop) {
      setIsMenuDisplay(true)
    }

    const handleClick = (event: UIEvent) => {
      if (isDesctop) {
        return
      }
      if (!(event.target as Element)?.classList.contains('img')) {
        return
      }
      setIsMenuDisplay((isMenuDisplay) => !isMenuDisplay)
    }

    window.addEventListener('click', handleClick)
    return () => {
      window.removeEventListener('click', handleClick)
    }
  }, [])

  const changeActiveItem = useCallback(
    (newItem: EnMenuItem) => {
      setActiveMenuItem(activeMenuItem === newItem ? null : newItem)
    },
    [activeMenuItem, setActiveMenuItem],
  )

  const onCreateBookmark = useCallback(() => {
    fetcher({
      url: '/bookmarks',
      session,
      params: {
        method: EnMethod.POST,
        body: JSON.stringify({
          chapterId: props.chapterId,
          bookId: props.bookId,
          type: EnBookmarkType.READ,
        }),
      },
    })
      .then((data: Bookmark) => {
        setActiveBookmark(data)
      })
      .catch(handleExceptionRequest)
  }, [props.bookId, props.chapterId, session])

  const onDeleteBookmark = useCallback(() => {
    fetcher({
      url: `/bookmarks/${activeBookmark?.id}`,
      session,
      params: {
        method: EnMethod.DELETE,
      },
    })
      .then(() => {
        setActiveBookmark(null)
      })
      .catch(handleExceptionRequest)
  }, [activeBookmark?.id, session])

  const onUpdateBookmark = useCallback(() => {
    fetcher({
      url: `/bookmarks/${activeBookmark?.id}`,
      session,
      params: {
        method: EnMethod.PATCH,
        body: JSON.stringify({
          chapterId: props.chapterId,
        }),
      },
    })
      .then((data: Bookmark) => {
        setActiveBookmark(data)
      })
      .catch(handleExceptionRequest)
  }, [activeBookmark?.id, props.chapterId, session])

  const items: IntMenuItem[] = useMemo(
    () => [
      {
        id: EnMenuItem.SETTINGS,
        className: 'hidden md:flex',
        isBeta: false,
        icon: <Icon name="settings" />,
      },
      {
        id: EnMenuItem.CHAPTERS,
        className: '',
        isBeta: false,
        icon: <Icon name="list" />,
      },
      {
        id: EnMenuItem.COMMENTS,
        className: '',
        isBeta: true,
        icon: <Icon name="comment" />,
      },
      {
        id: EnMenuItem.BOOKMARK,
        className: '',
        isBeta: false,
        onClick: () => {
          if (!session) {
            return displayLoginPopup()
          }
          if (!activeBookmark) {
            return onCreateBookmark()
          }
          return activeBookmark.chapterId === props.chapterId
            ? onDeleteBookmark()
            : onUpdateBookmark()
        },
        icon:
          activeBookmark && activeBookmark.chapterId === props.chapterId ? (
            <Icon name="bookmarkFull" className="text-primary-main" />
          ) : (
            <Icon name="bookmark" />
          ),
      },
    ],
    [
      activeBookmark,
      displayLoginPopup,
      onCreateBookmark,
      onDeleteBookmark,
      onUpdateBookmark,
      props.chapterId,
      session,
    ],
  )

  return (
    <div
      className={cn(
        'fixed bg-white dark:bg-black-700 dark:text-gray-150 addition-menu md:shadow-none md:dark:bg-transparent md:bg-transparent h-12 md:top-0 bottom-0 md:table md:right-0 lg:right-3 md:z-10 z-40 overflow-hidden text-center md:pt-14 md:px-2 w-full md:w-auto md:h-full',
        isMenuDisplay ? '' : 'hidden-menu',
      )}
    >
      <div className="md:table-cell align-middle h-12 md:h-auto md:w-16">
        {/* <p className="py-2 text-tiny hidden md:block w-16 text-center">
          1 / {props.countSlides}
        </p> */}
        <div className="md:px-1 md:py-2 flex justify-around md:block bg-white dark:bg-black-700 dark:text-gray-150 md:rounded-2xl">
          {items.map((item) => (
            <p
              key={item.id}
              onClick={() =>
                item.onClick ? item.onClick() : changeActiveItem(item.id)
              }
              className={cn(
                'md:my-1 py-3 px-2 relative cursor-pointer rounded-md flex md:p-2 justify-center md:hover:bg-gray-100 md:dark:hover:bg-black-600',
                item.className,
                {
                  'text-primary-main md:bg-gray-100 md:dark:bg-black-600':
                    activeMenuItem === item.id,
                },
              )}
            >
              {(item.isBeta && (
                <span className="absolute select-none text-[10px] text-white dark:text-black-1000 rounded-sm px-1 py-[0.5px] top-1 md:top-0 right-0 bg-primary-main">
                  beta
                </span>
              )) ||
                ''}
              {item.icon}
            </p>
          ))}
        </div>
      </div>
    </div>
  )
})
