'use client'

import { useCallback, useContext, useEffect, useState } from 'react'
import { UserChapterLike } from '@prisma/client'
import { EnMethod } from 'src/enums'
import { useLogin } from 'src/hooks'
import { useTranslations } from 'next-intl'
import { Icon } from 'src/components/common/Icon'
import { AuthContext } from 'src/components/providers/AuthProvider'
import { fetcher } from 'src/libs/fetcher'
import { handleExceptionRequest } from 'src/helpers/exception.helper'

export default function Thanks(props: { likes: number; chapterId: number }) {
  const { session } = useContext(AuthContext)
  const { displayLoginPopup } = useLogin()
  const t = useTranslations()
  const [likes, setLikes] = useState(props.likes)
  const [isUserLike, setIsUserLike] = useState(false)

  const onClick = useCallback(() => {
    if (!session) {
      return displayLoginPopup()
    }

    if (isUserLike) {
      return fetcher({
        url: '/users-chapter-likes',
        session,
        params: {
          method: EnMethod.DELETE,
          body: JSON.stringify({
            chapterId: props.chapterId,
          }),
        },
      })
        .then(() => {
          setIsUserLike(false)
          setLikes((likes) => likes - 1)
        })
        .catch(handleExceptionRequest)
    }

    return fetcher({
      url: '/users-chapter-likes',
      session,
      params: {
        method: EnMethod.POST,
        body: JSON.stringify({
          chapterId: props.chapterId,
        }),
      },
    })
      .then(() => {
        setIsUserLike(true)
        setLikes((likes) => likes + 1)
      })
      .catch(handleExceptionRequest)
  }, [session, isUserLike, props.chapterId, displayLoginPopup])

  useEffect(() => {
    if (!session) {
      return
    }

    fetcher({
      url: `/users-chapter-likes/find-first?where[chapterId]=${props.chapterId}`,
      session,
      params: {
        method: EnMethod.GET,
      },
    })
      .then((data: UserChapterLike | null) => {
        if (data) {
          setIsUserLike(true)
        }
      })
      .catch(handleExceptionRequest)
  }, [session, props.chapterId])

  return (
    <div className="flex text-center flex-col mt-7 justify-center dark:text-gray-250 text-gray-500">
      <button
        onClick={() => onClick()}
        className="px-3 hover:bg-orange-500 hover:bg-opacity-10 m-auto py-2 text-primary-main w-max whitespace-nowrap border-2 border-primary-main rounded-lg flex items-center"
      >
        <Icon name={isUserLike ? 'heartFull' : 'heart'} />
        <span className="ml-2 text-sm">{t('Thanks!')}</span>
      </button>
      <span className="mt-1 text-tiny italic">
        {t('They said thank you: ')}
        {likes}
      </span>
    </div>
  )
}
