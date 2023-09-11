import { UserChapterLike } from '@prisma/client'
import { memo, useCallback, useContext, useEffect, useState } from 'react'
import { Icon } from 'src/components/common/Icon'
import { AuthContext } from 'src/components/providers/AuthProvider'
import { EnMethod } from 'src/enums'
import { handleExceptionRequest } from 'src/helpers/exception.helper'
import { useLogin } from 'src/hooks'
import { fetcher } from 'src/libs/fetcher'
import cn from 'classnames'

export const Likes = memo(function Likes(props: {
  likes: number
  chapterId: number
  className?: string
  userChapterLike: UserChapterLike | undefined
}) {
  const {
    chapterId,
    userChapterLike,
    className = 'hover:bg-orange-500 text-primary-main hover:bg-opacity-10',
  } = props

  const { session } = useContext(AuthContext)
  const { displayLoginPopup } = useLogin()
  const [isUserLike, setIsUserLike] = useState<boolean>(false)
  const [likes, setLikes] = useState(props.likes)

  useEffect(() => {
    setIsUserLike(!!userChapterLike)
  }, [userChapterLike])

  const addLike = useCallback(async () => {
    if (!session) {
      return displayLoginPopup()
    }

    if (isUserLike) {
      return fetcher({
        url: '/users-chapter-likes',
        session,
        params: {
          method: EnMethod.DELETE,
          body: JSON.stringify({ chapterId }),
        },
      })
        .then(() => {
          setIsUserLike(false)
          setLikes(likes - 1)
        })
        .catch(handleExceptionRequest)
    }

    return fetcher({
      url: '/users-chapter-likes',
      session,
      params: {
        method: EnMethod.POST,
        body: JSON.stringify({ chapterId }),
      },
    })
      .then(() => {
        setIsUserLike(true)
        setLikes(likes + 1)
      })
      .catch(handleExceptionRequest)
  }, [chapterId, displayLoginPopup, isUserLike, likes, session])

  return (
    <div
      onClick={addLike}
      className={cn(
        'flex ml-3 md:ml-0 cursor-pointer items-center px-2 py-1 rounded-md',
        className,
      )}
    >
      <Icon name={isUserLike ? 'heartFull' : 'heart'} />
      <span className="ml-2 min-w-[20px]">{likes >= 0 ? likes : 0}</span>
    </div>
  )
})
