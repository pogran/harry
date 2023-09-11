'use client'

import React, { lazy, useContext } from 'react'
import { Icon } from 'src/components/common/Icon'
import { ChapterContext } from 'src/components/providers/ChapterProvider'
import { EnMenuItem } from 'src/enums'

const CommentList = lazy(() => import('src/components/common/List/CommentList'))
const ChapterList = lazy(() => import('src/components/common/List/ChapterList'))
const Settings = lazy(() => import('../Settings'))

export default function MenuContent(props: {
  bookSlug: string
  bookId: number
  activeChapterId?: number
}) {
  const { activeMenuItem, setActiveMenuItem } = useContext(ChapterContext)

  if (!activeMenuItem) {
    return <React.Fragment />
  }

  const renderActiveMenuPoint = () => {
    switch (activeMenuItem) {
      case EnMenuItem.COMMENTS: {
        return <CommentList />
      }

      case EnMenuItem.CHAPTERS: {
        return (
          <ChapterList
            bookId={props.bookId}
            bookSlug={props.bookSlug}
            activeChapterId={props.activeChapterId}
            isInfinityLoadAvailable={false}
            isFullList
            chapters={[]}
          />
        )
      }

      case EnMenuItem.SETTINGS: {
        return <Settings />
      }

      default:
        return <React.Fragment />
    }
  }

  return (
    <div className="md:w-96 fixed md:static top-0 bottom-0 z-30 md:z-10 w-screen flex-shrink-0 bg-white dark:bg-black-700 md:ml-1 md:mr-24 addition-menu">
      <div
        style={{ height: 'calc(100vh - 3rem)' }}
        className="pt-6 px-2 md:fixed md:w-96 md:py-2 md:pt-6 overflow-x-hidden overflow-y-auto"
      >
        <span
          className="absolute top-1 right-3 cursor-pointer hover:text-primary-main"
          onClick={() => setActiveMenuItem(null)}
        >
          <Icon name="close" />
        </span>
        {activeMenuItem && renderActiveMenuPoint()}
      </div>
    </div>
  )
}
